import {
  copyFileSync,
  readFileSync,
  readdirSync,
  rmdirSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
const output = resolve(root, "dist");
const part3Entry = resolve(output, "part3-app.html");
const part3Html = readFileSync(part3Entry, "utf8");
const scriptTag = part3Html.match(
  /<script type="module" crossorigin src="([^"]+)"><\/script>/,
);

if (!scriptTag) {
  throw new Error("Could not find the compiled Part 3 script in dist.");
}

const scriptPath = resolve(output, scriptTag[1]);
const bundle = readFileSync(scriptPath, "utf8");
const inlineBundle = bundle.replace(/<\/script/gi, "<\\/script");
const standalonePart3 = part3Html.replace(
  scriptTag[0],
  () => `<script type="module">\n${inlineBundle}\n</script>`,
);

writeFileSync(resolve(root, "part3.html"), standalonePart3);
writeFileSync(resolve(output, "part3.html"), standalonePart3);
unlinkSync(scriptPath);
unlinkSync(part3Entry);

const assetsDirectory = resolve(output, "assets");
if (readdirSync(assetsDirectory).length === 0) {
  rmdirSync(assetsDirectory);
}

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
