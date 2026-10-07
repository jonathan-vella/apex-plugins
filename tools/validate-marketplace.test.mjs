import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import test from "node:test";
import { MARKETPLACE_PATH, PROVENANCE_PATH, hashTree, validateRepository } from "./validate-marketplace.mjs";

const repositoryRoot = resolve(import.meta.dirname, "..");
const commit = "a".repeat(40);

async function write(path, text) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, text);
}

async function writeJson(path, value) {
  await write(path, `${JSON.stringify(value, null, 2)}\n`);
}

/** A marketplace with one hosted plugin whose provenance matches its files. */
async function fixture(context) {
  const root = await mkdtemp(join(tmpdir(), "apex-plugins-"));
  context.after(() => rm(root, { recursive: true, force: true }));
  const pluginRoot = join(root, "plugins/apex");
  await write(join(pluginRoot, "plugin.json"), '{"name":"apex","version":"1.0.0"}\n');
  await write(join(pluginRoot, "mcp/apex.mjs"), "export {};\n");
  await write(join(pluginRoot, "skills/a/SKILL.md"), "---\nname: a\n---\n");
  await write(join(pluginRoot, ".mcp.json"), "{}\n");
  const tree = await hashTree(pluginRoot);
  const marketplace = {
    name: "apex-plugins",
    owner: { name: "Owner" },
    metadata: { description: "Test", version: "1.0.0" },
    plugins: [{ name: "apex", description: "APEX", version: "1.0.0", source: "./plugins/apex", license: "MIT" }],
  };
  const provenance = {
    schemaVersion: "1.0.0",
    plugins: [
      {
        name: "apex",
        version: "1.0.0",
        source: { repository: "jonathan-vella/apex-vnext", commit },
        cli: { package: "@apexops/cli", version: "1.0.0", gitHead: commit },
        tree: { algorithm: "apex-plugin-tree-sha256-v1", sha256: tree.sha256, files: tree.files.length },
      },
    ],
  };
  await writeJson(join(root, MARKETPLACE_PATH), marketplace);
  await writeJson(join(root, PROVENANCE_PATH), provenance);
  return {
    root,
    pluginRoot,
    marketplace,
    provenance,
    save: async () => {
      await writeJson(join(root, MARKETPLACE_PATH), marketplace);
      await writeJson(join(root, PROVENANCE_PATH), provenance);
    },
  };
}

test("the committed marketplace is valid", async () => {
  const { errors } = await validateRepository(repositoryRoot);
  assert.deepEqual(errors, []);
});

test("hashTree matches the apex-vnext build-plugin algorithm", async (context) => {
  const { pluginRoot } = await fixture(context);
  // Vector computed with apex-vnext tools/scripts/build-plugin.mjs hashTree over the same four files.
  assert.deepEqual(await hashTree(pluginRoot), {
    files: [".mcp.json", "mcp/apex.mjs", "plugin.json", "skills/a/SKILL.md"],
    sha256: "24401aeb2956bfac1f0e9d9a417f0811a25ed11ca980eb89dffe60d5783297af",
  });
});

test("a hosted plugin with matching provenance is valid", async (context) => {
  const { root } = await fixture(context);
  const { errors, summary } = await validateRepository(root);
  assert.deepEqual(errors, []);
  assert.match(summary[0], /^apex 1\.0\.0: 4 files, tree sha256 24401aeb/u);
});

test("a changed hosted file fails the tree hash", async (context) => {
  const { root, pluginRoot } = await fixture(context);
  await write(join(pluginRoot, "mcp/apex.mjs"), "export {};\r\n");
  const { errors } = await validateRepository(root);
  assert.equal(errors.length, 1);
  assert.match(errors[0], /^plugins\/apex tree sha256 is [0-9a-f]{64}; provenance\.json records 24401aeb/u);
});

test("an added hosted file fails the tree hash and file count", async (context) => {
  const { root, pluginRoot } = await fixture(context);
  await write(join(pluginRoot, "extra.txt"), "x\n");
  const { errors } = await validateRepository(root);
  assert.equal(errors.length, 2);
  assert.match(errors[1], /plugins\/apex has 5 files; provenance\.json records 4/u);
});

test("marketplace.json uses only documented fields and in-repo sources", async (context) => {
  const state = await fixture(context);
  state.marketplace.extra = true;
  state.marketplace.name = "apex";
  state.marketplace.owner.url = "https://example.com";
  state.marketplace.plugins[0].source = { source: "github", repo: "jonathan-vella/apex-vnext", sha: commit };
  state.marketplace.plugins[0].sha = commit;
  await state.save();
  const { errors } = await validateRepository(state.root);
  assert.deepEqual(errors, [
    'marketplace.json has unknown field "extra"',
    'marketplace.json name must be "apex-plugins"',
    'marketplace.json owner has unknown field "url"',
    'marketplace.json plugins[0] has unknown field "sha"',
    'marketplace.json plugins[0].source must be "./plugins/apex"; this marketplace hosts every plugin in-repo',
  ]);
});

test("versions must agree across marketplace.json, provenance.json and plugin.json", async (context) => {
  const state = await fixture(context);
  state.marketplace.plugins[0].version = "1.0.1";
  await state.save();
  const { errors } = await validateRepository(state.root);
  assert.deepEqual(errors, [
    '"apex" is 1.0.1 in marketplace.json but 1.0.0 in provenance.json',
    "plugins/apex/plugin.json version 1.0.0 differs from marketplace.json 1.0.1",
  ]);
});

test("every listed plugin needs a record and every hosted folder needs a listing", async (context) => {
  const state = await fixture(context);
  state.provenance.plugins = [];
  await state.save();
  await write(join(state.root, "plugins/stray/plugin.json"), "{}\n");
  const { errors } = await validateRepository(state.root);
  assert.deepEqual(errors, [
    "plugins/stray is not listed in marketplace.json",
    'marketplace.json lists "apex" without a valid provenance.json record',
  ]);
});

test("provenance records must pin the apex-vnext commit, the CLI package and a known tree algorithm", async (context) => {
  const state = await fixture(context);
  state.provenance.plugins[0].source = { repository: "someone/else", commit: "v1.0.0" };
  state.provenance.plugins[0].cli.package = "@someone/cli";
  state.provenance.plugins[0].cli.version = "0.9.0";
  state.provenance.plugins[0].tree.algorithm = "sha1";
  await state.save();
  const { errors } = await validateRepository(state.root);
  assert.deepEqual(errors, [
    'provenance.json plugins[0].source.repository must be "jonathan-vella/apex-vnext"',
    "provenance.json plugins[0].source.commit has an invalid format: v1.0.0",
    'provenance.json plugins[0].cli.package must be "@apexops/cli"',
    "provenance.json plugins[0].cli.version must equal the plugin version",
    'provenance.json plugins[0].tree.algorithm must be "apex-plugin-tree-sha256-v1"',
    'marketplace.json lists "apex" without a valid provenance.json record',
  ]);
});

test("an invalid provenance record is reported, not dereferenced", async (context) => {
  const state = await fixture(context);
  state.provenance.plugins[0].tree = null;
  await state.save();
  const { errors } = await validateRepository(state.root);
  assert.deepEqual(errors, [
    "provenance.json plugins[0].tree must be an object",
    'marketplace.json lists "apex" without a valid provenance.json record',
  ]);
});

test("invalid plugin names never become paths and sources need the ./plugins/<name> form", async (context) => {
  const state = await fixture(context);
  state.marketplace.plugins.push(
    { name: "../../..", description: "x", version: "1.0.0", source: "./plugins/../../.." },
    { name: "Apex", description: "x", version: "1.0.0", source: "./plugins/Apex" },
  );
  state.marketplace.plugins[0].source = "plugins/apex";
  await state.save();
  const { errors, summary } = await validateRepository(state.root);
  assert.deepEqual(errors, [
    'marketplace.json plugins[0].source must be "./plugins/apex"; this marketplace hosts every plugin in-repo',
    "marketplace.json plugins[1].name has an invalid format: ../../..",
    "marketplace.json plugins[2].name has an invalid format: Apex",
  ]);
  assert.equal(summary.length, 1, "only the valid entry is hashed");
});

test("--verify-source reports a source commit that is not on main", async (context) => {
  const { root } = await fixture(context);
  const calls = [];
  const { errors } = await validateRepository(root, {
    verifySource: true,
    checkSource: async (source) => {
      calls.push(source);
      return `commit ${source.commit} is not on ${source.repository} main (diverged)`;
    },
  });
  assert.deepEqual(calls, [{ repository: "jonathan-vella/apex-vnext", commit }]);
  assert.deepEqual(errors, [`apex: commit ${commit} is not on jonathan-vella/apex-vnext main (diverged)`]);
});
