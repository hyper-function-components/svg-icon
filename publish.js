import fs from "fs-extra";
import { join } from "path";
import esMain from "es-main";
import { load } from "cheerio";
import { execSync } from "child_process";
import { LocalStorage } from "node-localstorage";

const icons = fs.readJsonSync("./icons.json");

const localStorage = new LocalStorage("./tmp/localStorage");

const publishFailed = [];

async function publishIcon(icon) {
  if (!icon.name || !icon.version || !icon.path) {
    console.log(`icon ${icon.name} is missing name, version or path`);
    process.exit(-1);
  }

  const publishKey = `${icon.name}-${icon.version}-done`;
  const published = !!localStorage.getItem(publishKey);

  if (published) {
    // console.log(icon.name, "already published");
    return;
  }

  // npm package name can nor contain download
  if (icon.name.split("-").includes("download")) {
    return;
  }

  const { SVG_ATTRS, SVG_HTML } = parseSvg(icon.path);

  console.log("building icon:", icon.name, icon.version);
  const env = {
    ...process.env,
    HFC_NAME: icon.name,
    HFC_VERSION: icon.version,
    HFC_PUBLIC_SVG_ATTRS: SVG_ATTRS,
    HFC_PUBLIC_SVG_HTML: SVG_HTML,
    HFC_DOC_ICON_NAME: icon.name,
  };

  if (icon.description) {
    env.HFC_DESCRIPTION = icon.description;
  }

  env.HFC_KEYWORDS = (icon.keywords || []).join(",");

  const startTime = Date.now();
  execSync(`npm run build`, {
    cwd: process.cwd(),
    env,
  });
  console.log("build done, used:", Date.now() - startTime, "ms");

  await fs.copy(icon.path, join(process.cwd(), "banner.svg"));

  console.log("publishing icon:", icon.name, icon.version);
  const startTime2 = Date.now();
  const out = execSync("npm run publish-hfc -- --skip-build", {
    cwd: process.cwd(),
    env,
  }).toString();
  if (out.includes("success")) {
    console.log(icon.name, "published, used:", Date.now() - startTime2, "ms");
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
  delete attrs.class;

  const SVG_ATTRS = JSON.stringify(Object.entries(attrs));
  const SVG_HTML = JSON.stringify(
    elem
      .html()
      .replaceAll("\n", "")
      .replaceAll("\t", "")
      .replaceAll("\r", "")
      .trim()
  );

  return { SVG_ATTRS, SVG_HTML };
}

async function run() {
  process.env.NODE_ENV = "production";
  await fs.rm(join(process.cwd(), ".hfc"), { recursive: true, force: true });

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
