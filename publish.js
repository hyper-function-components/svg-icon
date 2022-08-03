import fs from "fs-extra";
import { join } from "path";
import crypto from "crypto";
import esMain from "es-main";
import { load } from "cheerio";
import { execSync } from "child_process";
import { LocalStorage } from "node-localstorage";

const icons = fs.readJsonSync("./icons.json");
const buildDir = join(process.cwd(), ".hfc", "build");
const buildTemplateDir = join(process.cwd(), ".hfc", "build-tmpl");

const localStorage = new LocalStorage("./tmp/localStorage");

function getModuleHash(name, version) {
  const hash = crypto
    .createHash("sha256")
    .update(`../../../wfm-entry-${name}-${version}.js`)
    .digest("base64")
    .slice(0, 13);

  return hash;
}

const publishFailed = [];

let wfmHfcPath = "";
async function publishIcon(icon) {
  if (!icon.name || !icon.version || !icon.path) {
    console.log(`icon ${icon.name} is missing name, version or path`);
    process.exit(-1);
  }

  const publishKey = `${icon.name}-${icon.version}-done`;
  const published = !!localStorage.getItem(publishKey);

  if (published) {
    console.log(icon.name, "already published");
    return;
  }

  const { SVG_ATTRS, SVG_HTML } = parseSvg(icon.path);

  await fs.rm(buildDir, { recursive: true, force: true });
  await fs.copy(buildTemplateDir, buildDir, { recursive: true });

  const docHtmlPath = join(buildDir, "doc", "index.html");
  let docHtml = await fs.readFile(docHtmlPath, "utf8");

  docHtml = docHtml
    .replace(/svg-icon/g, icon.name)
    .replace(/0\.0\.0/g, icon.version);
  await fs.writeFile(docHtmlPath, docHtml);

  const pkgJsonPath = join(buildDir, "pkg", "package.json");
  const pkgJson = await fs.readJson(pkgJsonPath);
  pkgJson.name = "@hyper.fun/" + icon.name;
  pkgJson.hfc.name = icon.name;
  pkgJson.version = icon.version;

  if (icon.description) {
    pkgJson.description = icon.description;
  }

  const keywords = icon.keywords || [];
  pkgJson.keywords = [...pkgJson.keywords, ...keywords];

  await fs.writeJson(pkgJsonPath, pkgJson);

  const esmHfcPath = join(buildDir, "pkg", "esm", "hfc.js");
  let esmHfc = await fs.readFile(esmHfcPath, "utf8");
  esmHfc = esmHfc
    .replace(/process\.env\.SVG_ATTRS/g, SVG_ATTRS)
    .replace(/process\.env\.SVG_HTML/g, SVG_HTML);
  await fs.writeFile(esmHfcPath, esmHfc);

  if (!wfmHfcPath) {
    const fileNames = await fs.readdir(join(buildDir, "pkg", "wfm"));
    fileNames.forEach((fileName) => {
      if (fileName !== "entry.js") {
        wfmHfcPath = join(buildDir, "pkg", "wfm", fileName);
      }
    });
  }

  const MODULE_HASH = /NGqT5kK0h0Cjo/g;
  const moduleHash = getModuleHash(icon.name, icon.version);

  let wfmHfc = await fs.readFile(wfmHfcPath, "utf8");
  wfmHfc = wfmHfc
    .replace(MODULE_HASH, JSON.stringify(moduleHash))
    .replace(/process\.env\.SVG_ATTRS/g, SVG_ATTRS)
    .replace(/process\.env\.SVG_HTML/g, SVG_HTML);
  await fs.writeFile(wfmHfcPath, wfmHfc);

  let wfmEntryPath = join(buildDir, "pkg", "wfm", "entry.js");
  let wfmEntry = await fs.readFile(wfmEntryPath, "utf8");
  wfmEntry = wfmEntry
    .replace(MODULE_HASH, moduleHash)
    .replace(/@hyper\.fun\/svg\-icon/g, pkgJson.name);
  await fs.writeFile(wfmEntryPath, wfmEntry);

  await fs.copy(icon.path, join(process.cwd(), "banner.svg"));

  const out = execSync("npm run publish-hfc -- --skip-build").toString();
  if (out.includes("success")) {
    console.log(icon.name, "published");
    localStorage.setItem(publishKey, true);
  } else {
    console.log(out);
    publishFailed.push(icon);
    console.log(icon.name, "publish failed");
  }
}

export function parseSvg(filePath) {
  const svg = fs.readFileSync(filePath, "utf8");

  const elem = load(svg)("svg");
  const attrs = elem.attr();

  attrs.xmlns = "http://www.w3.org/2000/svg";
  delete attrs.xlink;
  delete attrs.version;

  const SVG_ATTRS = JSON.stringify(Object.entries(attrs));
  const SVG_HTML = JSON.stringify(elem.html().replace(/\n/g, "").trim());

  return { SVG_ATTRS, SVG_HTML };
}

async function run() {
  process.env.NODE_ENV = "production";
  await fs.rm(join(process.cwd(), ".hfc"), { recursive: true, force: true });

  console.log("build fresh pkg");
  execSync("npm run build");
  console.log("build pkg done");

  await fs.copy(buildDir, buildTemplateDir, { recursive: true });

  for (const icon of icons) {
    await publishIcon(icon);
  }

  if (publishFailed.length) {
    fs.writeFileSync(
      "publish-failed.json",
      JSON.stringify(publishFailed, null, 2)
    );
  }
}

if (esMain(import.meta)) {
  run();
}
