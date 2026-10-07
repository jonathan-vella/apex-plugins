#!/usr/bin/env node
/**
 * Validate the marketplace: .github/plugin/marketplace.json, .github/plugin/provenance.json and every hosted plugin
 * tree under plugins/. Dependency-free; run with Node.js 24 or later.
 *
 * Usage:
 *   node tools/validate-marketplace.mjs [--root <dir>] [--verify-source]
 *   node tools/validate-marketplace.mjs --tree <plugin dir>
 *
 * --verify-source also asks the GitHub API whether each recorded source commit is on its repository's main branch
 * (uses GITHUB_TOKEN when set). --tree prints the tree hash of an installed or built plugin folder, for example
 * ~/.copilot/installed-plugins/apex-plugins/apex, so it can be compared with provenance.json.
 */
import { createHash } from "node:crypto";
import { lstat, readFile, readdir } from "node:fs/promises";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parseArgs } from "node:util";

export const MARKETPLACE_NAME = "apex-plugins";
export const MARKETPLACE_PATH = ".github/plugin/marketplace.json";
export const PROVENANCE_PATH = ".github/plugin/provenance.json";
export const TREE_ALGORITHM = "apex-plugin-tree-sha256-v1";
export const SOURCE_REPOSITORY = "jonathan-vella/apex-vnext";
export const CLI_PACKAGE = "@apexops/cli";

// Field names from the GitHub Copilot CLI plugin reference, "marketplace.json fields":
// https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference#marketplacejson-fields
const TOP_LEVEL_FIELDS = ["name", "owner", "plugins", "metadata"];
const OWNER_FIELDS = ["name", "email"];
const METADATA_FIELDS = ["description", "version", "pluginRoot"];
const ENTRY_FIELDS = [
  "name",
  "source",
  "description",
  "version",
  "author",
  "homepage",
  "repository",
  "license",
  "keywords",
  "category",
  "tags",
  "commands",
  "agents",
  "skills",
  "hooks",
  "mcpServers",
  "lspServers",
  "strict",
];
const NAME = /^[a-z0-9]+(?:[-.][a-z0-9]+)*$/u;
const SEMVER =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*)(?:\.(?:0|[1-9]\d*|\d*[A-Za-z-][0-9A-Za-z-]*))*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/u;
const FULL_SHA = /^[0-9a-f]{40}$/u;
const SHA256 = /^[0-9a-f]{64}$/u;

function bytewise(left, right) {
  return left < right ? -1 : left > right ? 1 : 0;
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

/**
 * Same algorithm as apex-vnext tools/scripts/build-plugin.mjs hashTree: SHA-256 over every regular file, sorted
 * bytewise by its "/"-separated relative path, hashing path, NUL, contents, NUL. Symlinks and other entries fail.
 */
export async function hashTree(root) {
  const files = [];
  async function visit(directory, relativeDirectory) {
    const entries = (await readdir(directory, { withFileTypes: true })).sort((left, right) =>
      bytewise(left.name, right.name),
    );
    for (const entry of entries) {
      const child = join(directory, entry.name);
      const relativePath = relativeDirectory === "" ? entry.name : `${relativeDirectory}/${entry.name}`;
      if (entry.isDirectory()) await visit(child, relativePath);
      else if (entry.isFile()) files.push(relativePath);
      else throw new Error(`Unsupported entry in plugin tree: ${child}`);
    }
  }
  await visit(root, "");
  const hash = createHash("sha256");
  for (const file of files.sort(bytewise)) {
    hash.update(file);
    hash.update("\0");
    hash.update(await readFile(join(root, file)));
    hash.update("\0");
  }
  return { files, sha256: hash.digest("hex") };
}

async function readJson(path, errors, label) {
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch (error) {
    errors.push(`${label}: ${error.code === "ENOENT" ? "missing" : `invalid JSON (${error.message})`}`);
    return undefined;
  }
}

function checkFields(errors, label, value, allowed, required) {
  if (!isObject(value)) {
    errors.push(`${label} must be an object`);
    return false;
  }
  for (const key of Object.keys(value)) if (!allowed.includes(key)) errors.push(`${label} has unknown field "${key}"`);
  for (const key of required) if (!Object.hasOwn(value, key)) errors.push(`${label} is missing "${key}"`);
  return true;
}

function checkString(errors, label, value, { max, pattern, optional = false } = {}) {
  if (value === undefined && optional) return;
  if (typeof value !== "string" || value.length === 0) errors.push(`${label} must be a non-empty string`);
  else if (max !== undefined && value.length > max) errors.push(`${label} must be at most ${max} characters`);
  else if (pattern !== undefined && !pattern.test(value)) errors.push(`${label} has an invalid format: ${value}`);
}

async function isDirectory(path) {
  try {
    const info = await lstat(path);
    return info.isDirectory() && !info.isSymbolicLink();
  } catch {
    return false;
  }
}

/** Validates the marketplace manifest shape. Returns the in-repo plugin entries keyed by name. */
export function validateMarketplace(marketplace, errors) {
  const entries = new Map();
  if (!checkFields(errors, "marketplace.json", marketplace, TOP_LEVEL_FIELDS, ["name", "owner", "plugins"]))
    return entries;
  checkString(errors, "marketplace.json name", marketplace.name, { max: 64, pattern: NAME });
  if (marketplace.name !== MARKETPLACE_NAME) errors.push(`marketplace.json name must be "${MARKETPLACE_NAME}"`);
  if (checkFields(errors, "marketplace.json owner", marketplace.owner, OWNER_FIELDS, ["name"])) {
    checkString(errors, "marketplace.json owner.name", marketplace.owner.name);
    checkString(errors, "marketplace.json owner.email", marketplace.owner.email, { optional: true });
  }
  if (
    marketplace.metadata !== undefined &&
    checkFields(errors, "marketplace.json metadata", marketplace.metadata, METADATA_FIELDS, [])
  ) {
    for (const field of METADATA_FIELDS)
      checkString(errors, `marketplace.json metadata.${field}`, marketplace.metadata[field], { optional: true });
  }
  if (!Array.isArray(marketplace.plugins)) {
    errors.push("marketplace.json plugins must be an array");
    return entries;
  }
  marketplace.plugins.forEach((entry, index) => {
    const label = `marketplace.json plugins[${index}]`;
    if (!checkFields(errors, label, entry, ENTRY_FIELDS, ["name", "source", "description", "version"])) return;
    checkString(errors, `${label}.name`, entry.name, { max: 64, pattern: NAME });
    checkString(errors, `${label}.description`, entry.description, { max: 1024 });
    checkString(errors, `${label}.version`, entry.version, { pattern: SEMVER });
    // Only a valid name may become a path under plugins/.
    if (typeof entry.name !== "string" || entry.name.length > 64 || !NAME.test(entry.name)) return;
    if (entries.has(entry.name)) errors.push(`${label}.name "${entry.name}" is listed more than once`);
    const expected = `plugins/${entry.name}`;
    if (entry.source !== `./${expected}`)
      errors.push(`${label}.source must be "./${expected}"; this marketplace hosts every plugin in-repo`);
    entries.set(entry.name, entry);
  });
  return entries;
}

/** Validates provenance.json shape. Returns records keyed by plugin name. */
export function validateProvenance(provenance, errors) {
  const records = new Map();
  if (!checkFields(errors, "provenance.json", provenance, ["schemaVersion", "plugins"], ["schemaVersion", "plugins"]))
    return records;
  if (provenance.schemaVersion !== "1.0.0") errors.push('provenance.json schemaVersion must be "1.0.0"');
  if (!Array.isArray(provenance.plugins)) {
    errors.push("provenance.json plugins must be an array");
    return records;
  }
  provenance.plugins.forEach((record, index) => {
    const label = `provenance.json plugins[${index}]`;
    if (
      !checkFields(
        errors,
        label,
        record,
        ["name", "version", "source", "cli", "tree"],
        ["name", "version", "source", "cli", "tree"],
      )
    )
      return;
    const errorsBefore = errors.length;
    checkString(errors, `${label}.name`, record.name, { pattern: NAME });
    checkString(errors, `${label}.version`, record.version, { pattern: SEMVER });
    if (checkFields(errors, `${label}.source`, record.source, ["repository", "commit"], ["repository", "commit"])) {
      if (record.source.repository !== SOURCE_REPOSITORY)
        errors.push(`${label}.source.repository must be "${SOURCE_REPOSITORY}"`);
      checkString(errors, `${label}.source.commit`, record.source.commit, { pattern: FULL_SHA });
    }
    if (
      checkFields(
        errors,
        `${label}.cli`,
        record.cli,
        ["package", "version", "gitHead"],
        ["package", "version", "gitHead"],
      )
    ) {
      if (record.cli.package !== CLI_PACKAGE) errors.push(`${label}.cli.package must be "${CLI_PACKAGE}"`);
      checkString(errors, `${label}.cli.version`, record.cli.version, { pattern: SEMVER });
      checkString(errors, `${label}.cli.gitHead`, record.cli.gitHead, { pattern: FULL_SHA });
      if (record.cli.version !== record.version) errors.push(`${label}.cli.version must equal the plugin version`);
    }
    if (
      checkFields(
        errors,
        `${label}.tree`,
        record.tree,
        ["algorithm", "sha256", "files"],
        ["algorithm", "sha256", "files"],
      )
    ) {
      if (record.tree.algorithm !== TREE_ALGORITHM) errors.push(`${label}.tree.algorithm must be "${TREE_ALGORITHM}"`);
      checkString(errors, `${label}.tree.sha256`, record.tree.sha256, { pattern: SHA256 });
      if (!Number.isInteger(record.tree.files) || record.tree.files < 1)
        errors.push(`${label}.tree.files must be a positive integer`);
    }
    // Only fully valid records are compared with the hosted trees.
    if (errors.length !== errorsBefore) return;
    if (records.has(record.name)) errors.push(`${label}.name "${record.name}" is recorded more than once`);
    records.set(record.name, record);
  });
  return records;
}

async function sourceOnMain({ repository, commit }, token) {
  const headers = { accept: "application/vnd.github+json", "x-github-api-version": "2022-11-28" };
  if (token) headers.authorization = `Bearer ${token}`;
  const response = await fetch(`https://api.github.com/repos/${repository}/compare/${commit}...main`, { headers });
  if (response.status === 404) return `commit ${commit} was not found in ${repository}`;
  if (!response.ok) return `GitHub API returned ${response.status} for ${repository} ${commit}`;
  const { status } = await response.json();
  return status === "ahead" || status === "identical"
    ? null
    : `commit ${commit} is not on ${repository} main (${status})`;
}

export async function validateRepository(root, { verifySource = false, token, checkSource = sourceOnMain } = {}) {
  const errors = [];
  const summary = [];
  const marketplace = await readJson(join(root, MARKETPLACE_PATH), errors, MARKETPLACE_PATH);
  const provenance = await readJson(join(root, PROVENANCE_PATH), errors, PROVENANCE_PATH);
  const entries = marketplace === undefined ? new Map() : validateMarketplace(marketplace, errors);
  const records = provenance === undefined ? new Map() : validateProvenance(provenance, errors);

  for (const name of records.keys())
    if (!entries.has(name)) errors.push(`provenance.json records "${name}", which marketplace.json does not list`);

  const hosted = (await isDirectory(join(root, "plugins")))
    ? (await readdir(join(root, "plugins"), { withFileTypes: true })).map((entry) => entry.name)
    : [];
  for (const name of hosted.sort(bytewise))
    if (!entries.has(name)) errors.push(`plugins/${name} is not listed in marketplace.json`);

  for (const [name, entry] of entries) {
    const directory = join(root, "plugins", name);
    const record = records.get(name);
    if (record === undefined) errors.push(`marketplace.json lists "${name}" without a valid provenance.json record`);
    else if (record.version !== entry.version)
      errors.push(`"${name}" is ${entry.version} in marketplace.json but ${record.version} in provenance.json`);
    if (!(await isDirectory(directory))) {
      errors.push(`plugins/${name} is missing`);
      continue;
    }
    const plugin = await readJson(join(directory, "plugin.json"), errors, `plugins/${name}/plugin.json`);
    if (plugin !== undefined) {
      if (plugin.name !== name) errors.push(`plugins/${name}/plugin.json name is "${plugin.name}"`);
      if (plugin.version !== entry.version)
        errors.push(
          `plugins/${name}/plugin.json version ${plugin.version} differs from marketplace.json ${entry.version}`,
        );
    }
    let tree;
    try {
      tree = await hashTree(directory);
    } catch (error) {
      errors.push(error.message);
      continue;
    }
    if (record !== undefined) {
      if (record.tree.sha256 !== tree.sha256)
        errors.push(`plugins/${name} tree sha256 is ${tree.sha256}; provenance.json records ${record.tree.sha256}`);
      if (record.tree.files !== tree.files.length)
        errors.push(`plugins/${name} has ${tree.files.length} files; provenance.json records ${record.tree.files}`);
    }
    if (verifySource && record !== undefined) {
      const problem = await checkSource(record.source, token);
      if (problem) errors.push(`${name}: ${problem}`);
    }
    summary.push(`${name} ${entry.version}: ${tree.files.length} files, tree sha256 ${tree.sha256}`);
  }
  return { errors, summary };
}

if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const { values } = parseArgs({
    options: {
      root: { type: "string", default: "." },
      tree: { type: "string" },
      "verify-source": { type: "boolean", default: false },
    },
  });
  try {
    if (values.tree !== undefined) {
      const { files, sha256 } = await hashTree(resolve(values.tree));
      process.stdout.write(`${sha256}  ${files.length} files\n`);
    } else {
      const { errors, summary } = await validateRepository(resolve(values.root), {
        verifySource: values["verify-source"],
        token: process.env.GITHUB_TOKEN,
      });
      for (const line of summary) process.stdout.write(`ok ${line}\n`);
      if (errors.length > 0) {
        for (const error of errors) process.stderr.write(`error: ${error}\n`);
        process.exitCode = 1;
      } else {
        process.stdout.write(`Marketplace is valid (${summary.length} plugin(s)).\n`);
      }
    }
  } catch (error) {
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 1;
  }
}
