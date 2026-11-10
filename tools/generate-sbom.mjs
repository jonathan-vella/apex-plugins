#!/usr/bin/env node
/**
 * Generate the CycloneDX 1.6 SBOM of the hosted apex plugin (.github/plugin/sbom.cdx.json) and the diagram and table
 * between the sbom markers in README.md. Dependency-free; run with Node.js 24 or later.
 *
 * Usage:
 *   node tools/generate-sbom.mjs [--root <dir>]          write the SBOM and the README block
 *   node tools/generate-sbom.mjs --check [--root <dir>]  fail if either is stale (used by CI)
 *   node tools/generate-sbom.mjs --from-lockfile <package-lock.json>
 *       refresh tools/sbom-bundled-deps.json from the apex-vnext lockfile at the recorded source commit
 *
 * Output is deterministic: no timestamp, and the serial number derives from the plugin tree hash.
 */
import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";
import { MARKETPLACE_PATH, PROVENANCE_PATH, hashTree } from "./validate-marketplace.mjs";

export const SBOM_PATH = ".github/plugin/sbom.cdx.json";
export const BUNDLED_DEPS_PATH = "tools/sbom-bundled-deps.json";
export const README_PATH = "README.md";
export const PLUGIN_NAME = "apex";
const BUNDLE_PATH = "mcp/apex.mjs";
const RESVG_MANIFEST_PATH = "native/resvg-js/manifest.json";
const MCP_CONFIG_PATH = "mcp.json";
const START = "<!-- sbom:start -->";
const END = "<!-- sbom:end -->";

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const byName = (left, right) => (left.name < right.name ? -1 : left.name > right.name ? 1 : 0);
const npmPurl = (name, version) => `pkg:npm/${name.replace(/^@/u, "%40")}@${version}`;
const NPX_SPEC = /^((?:@[^/@]+\/)?[^/@]+)@([^@\s]+)$/u;
const integrityToHex = (integrity) => {
  const [algorithm, base64] = integrity.split("-");
  return { alg: algorithm.toUpperCase().replace(/^SHA/u, "SHA-"), content: Buffer.from(base64, "base64").toString("hex") };
};

async function readJson(path) {
  return JSON.parse(await readFile(path, "utf8"));
}

/** External npm MCP server packages launched via npx in mcp.json (such as @azure/mcp@3.0.0). */
export function externalMcpPackages(mcp) {
  const packages = [];
  for (const [serverName, server] of Object.entries(mcp.mcpServers ?? {}).sort(([a], [b]) => (a < b ? -1 : 1))) {
    if (server.command !== "npx" || !Array.isArray(server.args)) continue;
    const spec = server.args.find((arg) => typeof arg === "string" && !arg.startsWith("-") && NPX_SPEC.test(arg));
    if (spec === undefined) continue;
    const [, name, version] = spec.match(NPX_SPEC);
    const readOnly = server.args.includes("--read-only");
    const properties = [
      { name: "apex:mcp-server", value: serverName },
      { name: "apex:mcp-transport", value: server.type ?? "stdio" },
      { name: "apex:mcp-read-only", value: String(readOnly) },
    ];
    packages.push({
      type: "application",
      "bom-ref": npmPurl(name, version),
      name,
      version,
      scope: "required",
      purl: npmPurl(name, version),
      properties,
    });
  }
  return packages;
}

/** Package names that esbuild inlined into the MCP bundle, from its "// node_modules/<package>/..." markers. */
export function bundledPackages(bundleText) {
  const names = new Set();
  for (const match of bundleText.matchAll(/^\/\/ node_modules\/((?:@[^/\n]+\/)?[^/\n]+)\//gmu)) names.add(match[1]);
  return [...names].sort();
}

/** Refreshes the curated list of bundled libraries from an apex-vnext package-lock.json. */
export async function bundledDepsFromLockfile(root, lockfile) {
  const provenance = await readJson(join(root, PROVENANCE_PATH));
  const entry = provenance.plugins.find((plugin) => plugin.name === PLUGIN_NAME);
  const names = bundledPackages(await readFile(join(root, "plugins", PLUGIN_NAME, BUNDLE_PATH), "utf8"));
  const components = names.map((name) => {
    const found = lockfile.packages?.[`node_modules/${name}`];
    if (found === undefined) throw new Error(`${name} is bundled but missing from the lockfile`);
    return { name, version: found.version, license: found.license, integrity: found.integrity };
  });
  return {
    source: { repository: entry.source.repository, commit: entry.source.commit, lockfile: "package-lock.json" },
    components,
  };
}

/** Builds the CycloneDX document and returns it with the data the README rendering needs. */
export async function buildSbom(root) {
  const [marketplace, provenance, bundled] = await Promise.all([
    readJson(join(root, MARKETPLACE_PATH)),
    readJson(join(root, PROVENANCE_PATH)),
    readJson(join(root, BUNDLED_DEPS_PATH)),
  ]);
  const entry = provenance.plugins.find((plugin) => plugin.name === PLUGIN_NAME);
  const listing = marketplace.plugins.find((plugin) => plugin.name === PLUGIN_NAME);
  if (entry === undefined || listing === undefined) throw new Error(`${PLUGIN_NAME} is not in the marketplace`);
  const pluginRoot = join(root, "plugins", PLUGIN_NAME);

  const tree = await hashTree(pluginRoot);
  if (tree.sha256 !== entry.tree.sha256)
    throw new Error(`plugin tree hash ${tree.sha256} does not match provenance ${entry.tree.sha256}`);

  if (bundled.source.commit !== entry.source.commit)
    throw new Error(
      `${BUNDLED_DEPS_PATH} was taken at ${bundled.source.commit}, not release commit ${entry.source.commit}; ` +
        "refresh it with --from-lockfile",
    );
  const inBundle = bundledPackages(await readFile(join(pluginRoot, BUNDLE_PATH), "utf8"));
  const listed = bundled.components.map((component) => component.name).sort();
  if (JSON.stringify(inBundle) !== JSON.stringify(listed))
    throw new Error(
      `${BUNDLE_PATH} bundles [${inBundle.join(", ")}] but ${BUNDLED_DEPS_PATH} lists [${listed.join(", ")}]`,
    );

  const libraries = [...bundled.components].sort(byName).map((library) => ({
    type: "library",
    "bom-ref": npmPurl(library.name, library.version),
    name: library.name,
    version: library.version,
    scope: "required",
    purl: npmPurl(library.name, library.version),
    licenses: [{ license: { id: library.license } }],
    hashes: [integrityToHex(library.integrity)],
    properties: [{ name: "apex:bundled-in", value: BUNDLE_PATH }],
  }));

  const resvg = await readJson(join(pluginRoot, RESVG_MANIFEST_PATH));
  const natives = [];
  for (const [platform, binary] of Object.entries(resvg.binaries).sort(([a], [b]) => (a < b ? -1 : 1))) {
    const actual = sha256(await readFile(join(pluginRoot, "native/resvg-js", binary.file)));
    if (actual !== binary.sha256) throw new Error(`${binary.file} hash ${actual} does not match its manifest`);
    natives.push({
      type: "library",
      "bom-ref": npmPurl(binary.package, binary.version),
      name: binary.package,
      version: binary.version,
      scope: "required",
      purl: npmPurl(binary.package, binary.version),
      licenses: [{ license: { id: resvg.license } }],
      hashes: [{ alg: "SHA-256", content: binary.sha256 }],
      externalReferences: [
        { type: "distribution", url: binary.tarball, hashes: [integrityToHex(binary.integrity)] },
        { type: "vcs", url: resvg.source },
      ],
      properties: [
        { name: "apex:platform", value: platform },
        { name: "apex:file", value: `native/resvg-js/${binary.file}` },
        { name: "apex:unmodified-upstream-binary", value: "true" },
      ],
    });
  }

  const mcp = await readJson(join(pluginRoot, MCP_CONFIG_PATH));
  const mcpPackages = externalMcpPackages(mcp);
  const services = Object.entries(mcp.mcpServers)
    .filter(([, server]) => server.url !== undefined)
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([name, server]) => ({
      "bom-ref": `service:${name}`,
      name,
      endpoints: [server.url],
      description: `MCP server called over ${server.type}${
        server.headers?.["x-mcp-toolset"] ? `, toolset ${server.headers["x-mcp-toolset"]}` : ""
      }`,
    }));

  const cli = {
    type: "application",
    "bom-ref": npmPurl(entry.cli.package, entry.cli.version),
    name: entry.cli.package,
    version: entry.cli.version,
    scope: "required",
    purl: npmPurl(entry.cli.package, entry.cli.version),
    properties: [{ name: "apex:git-head", value: entry.cli.gitHead }],
  };

  const files = [];
  for (const file of tree.files)
    files.push({
      type: "file",
      "bom-ref": `file:${file}`,
      name: file,
      hashes: [{ alg: "SHA-256", content: sha256(await readFile(join(pluginRoot, file))) }],
    });

  const rootRef = `pkg:generic/${PLUGIN_NAME}@${entry.version}`;
  const author = listing.author ?? marketplace.owner;
  const sbom = {
    bomFormat: "CycloneDX",
    specVersion: "1.6",
    serialNumber: `urn:uuid:${tree.sha256.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12}).*$/u, "$1-$2-$3-$4-$5")}`,
    version: 1,
    metadata: {
      tools: { components: [{ type: "application", name: "apex-plugins generate-sbom", author: author.name }] },
      supplier: { name: author.name, url: author.url === undefined ? undefined : [author.url] },
      component: {
        type: "application",
        "bom-ref": rootRef,
        name: PLUGIN_NAME,
        version: entry.version,
        description: listing.description,
        licenses: [{ license: { id: listing.license } }],
        purl: rootRef,
        externalReferences: [
          { type: "vcs", url: `https://github.com/${entry.source.repository}`, comment: `commit ${entry.source.commit}` },
        ],
        properties: [
          { name: "apex:source-repository", value: entry.source.repository },
          { name: "apex:source-commit", value: entry.source.commit },
          { name: "apex:tree-algorithm", value: entry.tree.algorithm },
          { name: "apex:tree-sha256", value: entry.tree.sha256 },
          { name: "apex:tree-file-count", value: String(tree.files.length) },
        ],
      },
    },
    components: [cli, ...mcpPackages, ...libraries, ...natives, ...files],
    services,
    dependencies: [
      {
        ref: rootRef,
        dependsOn: [cli, ...mcpPackages, ...libraries, ...natives]
          .map((component) => component["bom-ref"])
          .concat(services.map((service) => service["bom-ref"])),
      },
    ],
  };
  if (sbom.metadata.supplier.url === undefined) delete sbom.metadata.supplier.url;

  return { sbom, summary: { entry, cli, mcpPackages, libraries, natives, services, fileCount: tree.files.length } };
}

const label = (text) => text.replaceAll('"', "'");
const prop = (item, name) => item.properties?.find((p) => p.name === name)?.value;

/** Markdown for the README: a Mermaid diagram of the components plus a provenance summary and component table. */
export function renderReadmeBlock({ entry, cli, mcpPackages = [], libraries, natives, services, fileCount }) {
  const lines = [];
  const ids = new Map();
  const node = (key, text, shape = ["[", "]"]) => {
    const id = `n${ids.size}`;
    ids.set(key, id);
    return `${id}${shape[0]}"${label(text)}"${shape[1]}`;
  };
  const root = node("root", `apex ${entry.version}<br/>${fileCount} files · MIT`, ["([", "])"]);
  const cliNode = node("cli", `${cli.name} ${cli.version}<br/>mcp/apex.mjs bundle`);
  const nodes = [`    ${root}`, `    ${cliNode}`];
  const edges = [`    ${ids.get("root")} --> ${ids.get("cli")}`];
  const groups = [];
  const gridLinks = (itemIds, columns = 3) => {
    const links = [];
    for (let i = 0; i < itemIds.length; i += columns) {
      const row = itemIds.slice(i, i + columns);
      if (row.length > 1) links.push(`      ${row.join(" ~~~ ")}`);
    }
    return links;
  };
  const group = (title, items, render, { from = "root", columns = 3 } = {}) => {
    if (items.length === 0) return;
    const gid = `g${groups.length}`;
    const body = items.map((item) => `      ${node(item["bom-ref"], render(item))}`);
    const itemIds = items.map((item) => ids.get(item["bom-ref"]));
    const bodyLines = [...body, ...gridLinks(itemIds, columns)];
    groups.push(`    subgraph ${gid}["${label(`${title} (${items.length})`)}"]\n${bodyLines.join("\n")}\n    end`);
    edges.push(`    ${ids.get(from)} --> ${gid}`);
  };
  group(
    "Bundled libraries",
    libraries,
    (item) => `${item.name} ${item.version}<br/>${item.licenses[0].license.id}`,
    { from: "cli", columns: 3 },
  );
  group(
    "Native binaries",
    natives,
    (item) => `${item.name} ${item.version}<br/>${item.licenses[0].license.id} · ${prop(item, "apex:platform")}`,
    { from: "root", columns: 2 },
  );
  const externalItems = [
    ...mcpPackages.map((item) => ({
      "bom-ref": item["bom-ref"],
      label: `${item.name} ${item.version}<br/>${prop(item, "apex:mcp-server")} · ${prop(item, "apex:mcp-transport")}${
        prop(item, "apex:mcp-read-only") === "true" ? " · read-only" : ""
      }`,
    })),
    ...services.map((item) => ({
      "bom-ref": item["bom-ref"],
      label: `${item.name}<br/>${item.endpoints[0]}`,
    })),
  ];
  group("MCP servers", externalItems, (item) => item.label, { from: "root", columns: 2 });

  const classAssignments = [
    [ [ids.get("root")], "plugin" ],
    [ [ids.get("cli")], "cli" ],
    [ libraries.map((item) => ids.get(item["bom-ref"])), "lib" ],
    [ natives.map((item) => ids.get(item["bom-ref"])), "native" ],
    [ externalItems.map((item) => ids.get(item["bom-ref"])), "service" ],
  ]
    .filter(([nodeIds]) => nodeIds.length > 0)
    .map(([nodeIds, className]) => `    class ${nodeIds.join(",")} ${className}`);

  lines.push(
    "```mermaid",
    "flowchart LR",
    ...nodes,
    ...groups,
    ...edges,
    "    classDef plugin fill:#0b5cad,color:#ffffff,stroke:#08427c,stroke-width:2px",
    "    classDef cli fill:#ddf4ff,color:#0550ae,stroke:#54aeff,stroke-width:1.5px",
    "    classDef lib fill:#f6f8fa,color:#1f2328,stroke:#d0d7de",
    "    classDef native fill:#fff8c5,color:#5c4300,stroke:#d4a72c",
    "    classDef service fill:#fbefff,color:#6639ba,stroke:#d8b9ff",
    ...classAssignments,
    "```",
    "",
    "| Plugin | Version | Source Commit | Tree SHA-256 | CycloneDX 1.6 Inventory |",
    "| :--- | :--- | :--- | :--- | :--- |",
    `| **\`apex\`** (\`MIT\`) | \`${entry.version}\` | [\`${entry.source.commit.slice(0, 12)}\`](https://github.com/${entry.source.repository}/commit/${entry.source.commit}) | \`${entry.tree.sha256.slice(0, 16)}…\` | [\`${SBOM_PATH}\`](${SBOM_PATH}) (${fileCount} files) |`,
    "",
    "| Component | Version | Kind | Licence | Digest |",
    "| :--- | :--- | :--- | :--- | :--- |",
  );
  const digest = (item) => {
    const hash = item.hashes[0];
    return `\`${hash.alg.toLowerCase()}:${hash.content.slice(0, 12)}…\``;
  };
  lines.push(`| \`${cli.name}\` | \`${cli.version}\` | CLI & MCP bundle source | \`MIT\` | — |`);
  for (const item of mcpPackages) {
    const mode = prop(item, "apex:mcp-read-only") === "true" ? ", read-only" : "";
    lines.push(
      `| \`${item.name}\` | \`${item.version}\` | External MCP server (\`${prop(item, "apex:mcp-server")}\`${mode}) | — | — |`,
    );
  }
  for (const item of libraries)
    lines.push(
      `| \`${item.name}\` | \`${item.version}\` | Bundled library | \`${item.licenses[0].license.id}\` | ${digest(item)} |`,
    );
  for (const item of natives)
    lines.push(
      `| \`${item.name}\` | \`${item.version}\` | Native binary (\`${prop(item, "apex:platform")}\`) | \`${item.licenses[0].license.id}\` | ${digest(item)} |`,
    );
  for (const item of services) lines.push(`| \`${item.name}\` | — | Remote service | — | — |`);
  return lines.join("\n");
}

export function replaceReadmeBlock(readme, block) {
  const start = readme.indexOf(START);
  const end = readme.indexOf(END);
  if (start === -1 || end === -1 || end < start) throw new Error(`README.md needs ${START} and ${END} markers`);
  return `${readme.slice(0, start + START.length)}\n${block}\n${readme.slice(end)}`;
}

export async function generate(root, { check = false } = {}) {
  const { sbom, summary } = await buildSbom(root);
  const sbomText = `${JSON.stringify(sbom, null, 2)}\n`;
  const readmePath = join(root, README_PATH);
  const readme = await readFile(readmePath, "utf8");
  const nextReadme = replaceReadmeBlock(readme, renderReadmeBlock(summary));
  const sbomPath = join(root, SBOM_PATH);
  const current = await readFile(sbomPath, "utf8").catch(() => undefined);
  const stale = [];
  if (current !== sbomText) stale.push(SBOM_PATH);
  if (readme !== nextReadme) stale.push(README_PATH);
  if (!check) {
    if (current !== sbomText) await writeFile(sbomPath, sbomText);
    if (readme !== nextReadme) await writeFile(readmePath, nextReadme);
  }
  return stale;
}

async function main() {
  const { values } = parseArgs({
    options: {
      root: { type: "string", default: resolve(import.meta.dirname, "..") },
      check: { type: "boolean", default: false },
      "from-lockfile": { type: "string" },
    },
  });
  const root = resolve(values.root);
  if (values["from-lockfile"] !== undefined) {
    const deps = await bundledDepsFromLockfile(root, await readJson(resolve(values["from-lockfile"])));
    await writeFile(join(root, BUNDLED_DEPS_PATH), `${JSON.stringify(deps, null, 2)}\n`);
    console.log(`Updated ${BUNDLED_DEPS_PATH} (${deps.components.length} libraries)`);
    return;
  }
  const stale = await generate(root, { check: values.check });
  if (values.check) {
    if (stale.length > 0) {
      console.error(`Stale: ${stale.join(", ")}. Run: node tools/generate-sbom.mjs`);
      process.exitCode = 1;
    } else console.log("SBOM and README block are up to date");
  } else console.log(stale.length > 0 ? `Updated ${stale.join(", ")}` : "Already up to date");
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
