import ts from "hfc-plugin-typescript";
import { join } from "path";
import { parseSvg } from "./publish.js";

let SVG_ATTRS;
let SVG_HTML;

const isProd = process.env.NODE_ENV === "production";

if (!isProd) {
  ({ SVG_ATTRS, SVG_HTML } = parseSvg(join(process.cwd(), "example.svg")));
}

export default {
  entry: "./src/index.ts",
  plugins: [ts()],
  defineEnv: isProd
    ? {}
    : {
        "process.env.SVG_ATTRS": SVG_ATTRS,
        "process.env.SVG_HTML": SVG_HTML,
      },
};
