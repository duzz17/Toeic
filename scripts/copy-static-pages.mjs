import { copyFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = resolve(root, "dist");
const pages = [
  "part1.html",
  "part2.html",
  "part4.html",
  "part5.html",
  "part6.html",
  "part7.html",
];

for (const page of pages) {
  copyFileSync(resolve(root, page), resolve(output, page));
}
