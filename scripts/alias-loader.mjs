// Tiny Node resolve hook so build scripts can import project TypeScript that uses the "@/" alias.
import { pathToFileURL } from "node:url";
import { existsSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const tryExt = ["", ".ts", ".tsx", "/index.ts", "/index.tsx"];

export async function resolve(specifier, context, next) {
  if (specifier.startsWith("@/")) {
    const base = path.join(root, specifier.slice(2));
    for (const ext of tryExt) {
      if (existsSync(base + ext) && !base.endsWith("/") && (ext !== "" || path.extname(base))) {
        return next(pathToFileURL(base + ext).href, context);
      }
    }
  }
  if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL && !path.extname(specifier)) {
    const dir = path.dirname(new URL(context.parentURL).pathname);
    for (const ext of [".ts", ".tsx"]) {
      if (existsSync(path.join(dir, specifier + ext))) return next(pathToFileURL(path.join(dir, specifier + ext)).href, context);
    }
  }
  return next(specifier, context);
}

import { readFile } from "node:fs/promises";
/** JSON imports without import attributes, as the bundler allows. */
export async function load(url, context, next) {
  if (url.endsWith(".json")) {
    const src = await readFile(new URL(url), "utf8");
    return { format: "module", source: `export default ${src};`, shortCircuit: true };
  }
  return next(url, context);
}
