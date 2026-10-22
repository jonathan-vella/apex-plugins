import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { createHash } from "node:crypto";
import { BUNDLED_DEPS_PATH, buildSbom, bundledPackages, generate, SBOM_PATH } from "./generate-sbom.mjs";
import { MARKETPLACE_PATH, PROVENANCE_PATH, hashTree } from "./validate-marketplace.mjs";

const repositoryRoot = resolve(import.meta.dirname, "..");
const commit = "a".repeat(40);
const binary = Buffer.from("native");

async function write(path, content) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content);
}

const writeJson = (path, value) => write(path, `${JSON.stringify(value, null, 2)}\n`);

/** A repository with one plugin whose bundle inlines zod, plus matching provenance, deps list and README markers. */
async function fixture(context) {
  const root = await mkdtemp(join(tmpdir(), "apex-sbom-"));
  context.after(() => rm(root, { recursive: true, force: true }));
  const pluginRoot = join(root, "plugins/apex");
  await write(join(pluginRoot, "mcp/apex.mjs"), "// node_modules/zod/v4/index.js\nexport {};\n");
  await write(join(pluginRoot, "native/resvg-js/linux-x64/r.node"), binary);
  await writeJson(join(pluginRoot, "native/resvg-js/manifest.json"), {
    license: "MPL-2.0",
    source: "https://example.test/resvg",
    binaries: {
      "linux-x64": {
        file: "linux-x64/r.node",
        sha256: createHash("sha256").update(binary).digest("hex"),
        package: "@resvg/resvg-js-linux-x64-gnu",
        version: "2.6.2",
        tarball: "https://example.test/r.tgz",
        integrity: `sha512-${Buffer.from("x").toString("base64")}`,
      },
    },
  });
  await writeJson(join(pluginRoot, "mcp.json"), {
    mcpServers: {
      apex: { type: "stdio", command: "node", args: ["${PLUGIN_ROOT}/mcp/apex.mjs"] },
      pricing: { type: "streamable-http", url: "https://mcp.example.test" },
    },
  });
  const tree = await hashTree(pluginRoot);
  await writeJson(join(root, MARKETPLACE_PATH), {
    name: "apex-plugins",
    owner: { name: "Owner" },
    plugins: [{ name: "apex", description: "APEX", version: "1.0.0", source: "./plugins/apex", license: "MIT" }],
  });
  await writeJson(join(root, PROVENANCE_PATH), {
    schemaVersion: "1.0.0",
    plugins: [
      {
        name: "apex",
        version: "1.0.0",
        source: { repository: "o/apex-vnext", commit },
        cli: { package: "@apexops/cli", version: "1.0.0", gitHead: commit },
        tree: { algorithm: "apex-plugin-tree-sha256-v1", sha256: tree.sha256, files: tree.files.length },
      },
    ],
  });
  await writeJson(join(root, BUNDLED_DEPS_PATH), {
    source: { repository: "o/apex-vnext", commit, lockfile: "package-lock.json" },
    components: [{ name: "zod", version: "4.0.0", license: "MIT", integrity: `sha512-${Buffer.from("z").toString("base64")}` }],
  });
  await write(join(root, "README.md"), "# Test\n<!-- sbom:start -->\n<!-- sbom:end -->\n");
  return { root, pluginRoot };
}

test("the committed SBOM and README block are current", async () => {
  assert.deepEqual(await generate(repositoryRoot, { check: true }), []);
});

test("bundledPackages reads esbuild markers, including scoped packages", () => {
  const text = "// node_modules/zod/a.js\n// node_modules/@scope/pkg/b.js\n// node_modules/zod/c.js\nconst x = '// node_modules/no/';";
  assert.deepEqual(bundledPackages(text), ["@scope/pkg", "zod"]);
});

test("builds a deterministic CycloneDX document that matches the tree", async (context) => {
  const { root } = await fixture(context);
  const { sbom } = await buildSbom(root);
  assert.equal(sbom.bomFormat, "CycloneDX");
  assert.equal(sbom.specVersion, "1.6");
  assert.deepEqual(sbom.components.filter((c) => c.type === "file").map((c) => c.name).sort(), [
    "mcp.json",
    "mcp/apex.mjs",
    "native/resvg-js/linux-x64/r.node",
    "native/resvg-js/manifest.json",
  ]);
  assert.deepEqual(sbom.services.map((s) => s.name), ["pricing"]);
  assert.ok(sbom.components.some((c) => c.purl === "pkg:npm/zod@4.0.0"));
  assert.ok(sbom.components.some((c) => c.purl === "pkg:npm/%40resvg/resvg-js-linux-x64-gnu@2.6.2"));
  assert.deepEqual((await buildSbom(root)).sbom, sbom);
});

test("write mode creates the files and check mode detects drift", async (context) => {
  const { root } = await fixture(context);
  assert.deepEqual(await generate(root, { check: true }), [SBOM_PATH, "README.md"]);
  await generate(root);
  assert.deepEqual(await generate(root, { check: true }), []);
  assert.match(await readFile(join(root, "README.md"), "utf8"), /```mermaid/u);
  await write(join(root, "README.md"), (await readFile(join(root, "README.md"), "utf8")).replace("zod 4.0.0", "zod 9"));
  assert.deepEqual(await generate(root, { check: true }), ["README.md"]);
});

test("fails when the bundle and the curated list disagree", async (context) => {
  const { root, pluginRoot } = await fixture(context);
  await write(join(pluginRoot, "mcp/apex.mjs"), "// node_modules/zod/x.js\n// node_modules/ajv/y.js\n");
  const tree = await hashTree(pluginRoot);
  const provenance = JSON.parse(await readFile(join(root, PROVENANCE_PATH), "utf8"));
  provenance.plugins[0].tree.sha256 = tree.sha256;
  await writeJson(join(root, PROVENANCE_PATH), provenance);
  await assert.rejects(buildSbom(root), /bundles \[ajv, zod\] but .* lists \[zod\]/u);
});

test("fails when the curated list is for another source commit", async (context) => {
  const { root } = await fixture(context);
  const deps = JSON.parse(await readFile(join(root, BUNDLED_DEPS_PATH), "utf8"));
  deps.source.commit = "b".repeat(40);
  await writeJson(join(root, BUNDLED_DEPS_PATH), deps);
  await assert.rejects(buildSbom(root), /--from-lockfile/u);
});

test("fails when the tree does not match provenance", async (context) => {
  const { root, pluginRoot } = await fixture(context);
  await write(join(pluginRoot, "extra.txt"), "x");
  await assert.rejects(buildSbom(root), /does not match provenance/u);
});

test("fails when a native binary does not match its manifest", async (context) => {
  const { root, pluginRoot } = await fixture(context);
  await write(join(pluginRoot, "native/resvg-js/linux-x64/r.node"), "tampered");
  const tree = await hashTree(pluginRoot);
  const provenance = JSON.parse(await readFile(join(root, PROVENANCE_PATH), "utf8"));
  provenance.plugins[0].tree.sha256 = tree.sha256;
  await writeJson(join(root, PROVENANCE_PATH), provenance);
  await assert.rejects(buildSbom(root), /does not match its manifest/u);
});
