// Next.js 16 static export writes segment prefetch payloads as nested files
// (`setup/__next.setup/__PAGE__.txt`), but the client router requests the flat name
// (`setup/__next.setup.__PAGE__.txt`). Static hosts like GitHub Pages then return 404 and
// client navigation falls back to full page loads. This copies each nested payload to its
// flat name. Usage: node scripts/flatten-rsc-payloads.mjs [outDir]
import { copyFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const outDir = process.argv[2] ?? "out";
let copied = 0;

function flatten(dir, prefix, targetDir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) flatten(path, `${prefix}.${name}`, targetDir);
    else {
      copyFileSync(path, join(targetDir, `${prefix}.${name}`));
      copied += 1;
    }
  }
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (!statSync(path).isDirectory()) continue;
    if (name.startsWith("__next.")) flatten(path, name, dir);
    else walk(path);
  }
}

walk(outDir);
console.log(`flatten-rsc-payloads: ${copied} payload(s) copied in ${outDir}`);
