/**
 * Copies the latin subsets of our three variable fonts out of node_modules and
 * into src/assets/fonts, so the built site serves its own fonts and no visitor
 * request ever reaches a font CDN. Re-run after bumping the @fontsource-variable
 * packages.
 */
import { copyFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "src/assets/fonts");
mkdirSync(out, { recursive: true });

const wanted = [
  ["inter", "inter-latin-wght-normal.woff2"],
  ["inter", "inter-latin-ext-wght-normal.woff2"],
  ["space-grotesk", "space-grotesk-latin-wght-normal.woff2"],
  ["space-grotesk", "space-grotesk-latin-ext-wght-normal.woff2"],
  ["jetbrains-mono", "jetbrains-mono-latin-wght-normal.woff2"],
  ["jetbrains-mono", "jetbrains-mono-latin-ext-wght-normal.woff2"],
];

let total = 0;
for (const [pkg, file] of wanted) {
  const src = join(root, "node_modules/@fontsource-variable", pkg, "files", file);
  const dest = join(out, file);
  copyFileSync(src, dest);
  total += statSync(dest).size;
  console.log(`  ${(statSync(dest).size / 1024).toFixed(1).padStart(6)}K  ${file}`);
}
console.log(`\n${readdirSync(out).length} files, ${(total / 1024).toFixed(0)}K total`);
