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

const ionicons4Svgs = fs.readdirSync(ionicons4IconPath);
const ionicons5Svgs = fs.readdirSync(ionicons5IconPath);
const antdSvgs = fs.readdirSync(antdIconPath);
const materialSvgs = fs.readdirSync(materialIconPath);
const faSvgs = fs.readdirSync(faIconPath);
const tablerSvgs = fs.readdirSync(tablerIconPath);
const carbonSvgs = fs.readdirSync(carbonIconPath);

const icons = [];

const version = "1.2.2";

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

for (const icon of icons) {
  console.log(icon.name);
  const exists = fs.existsSync(icon.path);
  if (!exists) {
    console.log(icon.name + " not found");
    process.exit(-1);
  }
}

fs.writeFileSync("icons.json", JSON.stringify(icons, null, 2));
