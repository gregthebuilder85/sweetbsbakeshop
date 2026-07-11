// Builds the entire app into one portable, self-contained HTML (no server,
// works from file://). Uses a classic IIFE bundle so it runs in any sandbox.
import { build } from "esbuild";
import { mkdirSync, writeFileSync } from "fs";

const res = await build({
  entryPoints: ["src/main.jsx"],
  bundle: true,
  format: "iife",
  jsx: "automatic",
  loader: { ".jpg": "dataurl", ".png": "dataurl" },
  define: { __USE_HASH__: "true" },   // hash routing so it works offline/file://
  minify: true,
  write: false,
  outdir: "out",
});

const js = res.outputFiles.find((f) => f.path.endsWith(".js"))?.text ?? "";
const css = res.outputFiles.find((f) => f.path.endsWith(".css"))?.text ?? "";

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,600&family=Karla:ital,wght@0,400;0,500;0,700;1,400&display=swap" rel="stylesheet"/>
<title>Sweet B's Bake Shop — Custom Cakes, Cupcakes &amp; Classes</title>
<style>${css}</style>
</head>
<body>
<div id="root"></div>
<script>${js}</script>
</body>
</html>`;

mkdirSync("dist-single", { recursive: true });
writeFileSync("dist-single/index.html", html);
console.log(`built dist-single/index.html (${Math.round(html.length / 1024)} KB)`);
