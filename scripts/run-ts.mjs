// Runner TS -> bundled ESM (cross-platform: WSL & Windows).
// Dipakai untuk prisma/seed.mts dsb. Generated Prisma client memakai
// import extensionless (gaya bundler), jadi file di-bundle dulu dengan
// esbuild (node_modules tetap external), baru dijalankan.
import { build } from "esbuild";
import { pathToFileURL } from "node:url";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";

const entry = process.argv[2];
if (!entry) {
  console.error("Usage: node scripts/run-ts.mjs <entry-file.ts|.mts>");
  process.exit(1);
}

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const entryPath = path.resolve(root, entry);
const outfile = path.join(root, ".next", `ts-run-${path.basename(entry)}.mjs`);

fs.mkdirSync(path.dirname(outfile), { recursive: true });

await build({
  entryPoints: [entryPath],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  packages: "external",
  outfile,
  logLevel: "error",
});

await import(pathToFileURL(outfile).href);
