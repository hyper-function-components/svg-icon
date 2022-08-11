import path from "path";
import fs from "fs-extra";
import { paramCase } from "param-case";

const ionicons4IconPath = path.join("node_modules", "@sicons/ionicons4");
const ionicons5IconPath = path.join("node_modules", "@sicons/ionicons5");
const antdIconPath = path.join("node_modules", "@sicons/antd");
const materialIconPath = path.join("node_modules", "@sicons/material");
const faIconPath = path.join("node_modules", "@sicons/fa");
const tablerIconPath = path.join("node_modules", "@sicons/tabler");
const carbonIconPath = path.join("node_modules", "@sicons/carbon");
const featherIconPath = path.join("node_modules", "feather-icons/dist/icons");
const heroOutlineIconPath = path.join("node_modules", "heroicons/outline");
const heroSolidIconPath = path.join("node_modules", "heroicons/solid");
const fluentIconPath = path.join("node_modules", "@fluentui/svg-icons/icons");
const fluentEmojiPath = path.join("node_modules", "fluentui-emoji-svgs/icons");

const ionicons4Svgs = fs.readdirSync(ionicons4IconPath);
const ionicons5Svgs = fs.readdirSync(ionicons5IconPath);
const antdSvgs = fs.readdirSync(antdIconPath);
const materialSvgs = fs.readdirSync(materialIconPath);
const faSvgs = fs.readdirSync(faIconPath);
const tablerSvgs = fs.readdirSync(tablerIconPath);
const carbonSvgs = fs.readdirSync(carbonIconPath);
const featherSvgs = fs.readdirSync(featherIconPath);
const heroOutlineSvgs = fs.readdirSync(heroOutlineIconPath);
const heroSolidSvgs = fs.readdirSync(heroSolidIconPath);
const fluentSvgs = fs
  .readdirSync(fluentIconPath)
  .filter((item) => item.endsWith(".svg"));
const fluentEmojiSvgs = fs.readdirSync(fluentEmojiPath);

const icons = [];

const version = "2.0.0";

fluentEmojiSvgs.forEach((svgFileName) => {
  const name = svgFileName.replace(".svg", "");

  icons.push({
    name: "fluentui-emoji-" + name,
    version,
    description: "",
    keywords: ["fluentui", "emoji", name],
    path: path.join(fluentEmojiPath, svgFileName),
  });
});

const parsedFluentIcons = {};
fluentSvgs.forEach((svgFileName) => {
  const arr = svgFileName.split(".")[0].split("_");
  const size = arr[arr.length - 2];
  const type = arr[arr.length - 1];
  const name = arr.slice(0, arr.length - 2).join("-") + "-" + type;

  parsedFluentIcons[name] = {
    name,
    type,
    size,
    path: path.join(fluentIconPath, svgFileName),
  };
});

Object.values(parsedFluentIcons).forEach((icon) => {
  icons.push({
    name: "fluentui-icon-" + icon.name,
    version,
    description: "",
    keywords: ["fluentui", "icon", icon.name],
    path: icon.path,
  });
});

ionicons4Svgs.forEach((name) => {
  if (!name.endsWith(".svg")) return;

  const casedName = paramCase(name.split(".")[0]);

  icons.push({
    name: "ionicons4-" + casedName,
    version,
    description: "",
    keywords: ["ionicons", casedName],
    path: path.join(ionicons4IconPath, name),
  });
});

ionicons5Svgs.forEach((name) => {
  if (!name.endsWith(".svg")) return;

  const casedName = paramCase(name.split(".")[0]);

  icons.push({
    name: "ionicons-" + casedName,
    version,
    description: "",
    keywords: ["ionicons", casedName],
    path: path.join(ionicons5IconPath, name),
  });
});

antdSvgs.forEach((name) => {
  if (!name.endsWith(".svg")) return;

  const casedName = paramCase(name.split(".")[0]);

  icons.push({
    name: "antd-icon-" + casedName,
    version,
    description: "",
    keywords: ["ant-design", "antd", casedName],
    path: path.join(antdIconPath, name),
  });
});

materialSvgs.forEach((name) => {
  if (!name.endsWith(".svg")) return;

  const casedName = paramCase(name.split(".")[0]);

  icons.push({
    name: "material-icon-" + casedName,
    version,
    description: "",
    keywords: ["material", casedName],
    path: path.join(materialIconPath, name),
  });
});

faSvgs.forEach((name) => {
  if (!name.endsWith(".svg")) return;

  const casedName = paramCase(name.split(".")[0]);

  icons.push({
    name: "fa-" + casedName,
    version,
    description: "",
    keywords: ["fa", "font-awesome", casedName],
    path: path.join(faIconPath, name),
  });
});

tablerSvgs.forEach((name) => {
  if (!name.endsWith(".svg")) return;

  const casedName = paramCase(name.split(".")[0]);

  icons.push({
    name: "tabler-" + casedName,
    version,
    description: "",
    keywords: ["tabler", casedName],
    path: path.join(tablerIconPath, name),
  });
});

carbonSvgs.forEach((name) => {
  if (!name.endsWith(".svg")) return;

  const casedName = paramCase(name.split(".")[0]);

  icons.push({
    name: "carbon-icon-" + casedName,
    version,
    description: "",
    keywords: ["carbon", casedName],
    path: path.join(carbonIconPath, name),
  });
});

featherSvgs.forEach((name) => {
  if (!name.endsWith(".svg")) return;

  const n = name.split(".")[0];
  icons.push({
    name: "feather-" + n,
    version,
    description: "",
    keywords: ["feather", "icon", n],
    path: path.join(featherIconPath, name),
  });
});

heroOutlineSvgs.forEach((name) => {
  if (!name.endsWith(".svg")) return;

  const n = name.split(".")[0];
  icons.push({
    name: "hero-icon-" + n + "-outline",
    version,
    description: "",
    keywords: ["hero", "icon", n],
    path: path.join(heroOutlineIconPath, name),
  });
});

heroSolidSvgs.forEach((name) => {
  if (!name.endsWith(".svg")) return;

  const n = name.split(".")[0];
  icons.push({
    name: "hero-icon-" + n + "-solid",
    version,
    description: "",
    keywords: ["hero", "icon", n],
    path: path.join(heroSolidIconPath, name),
  });
});

for (const icon of icons) {
  console.log(icon.name);
  const exists = fs.existsSync(icon.path);
  if (!exists) {
    console.log(icon.name + " not found");
    process.exit(-1);
  }
}

fs.writeFileSync("icons.json", JSON.stringify(icons, null, 2));
