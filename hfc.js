import ts from "hfc-plugin-typescript";
import { join } from "path";
import { parseSvg } from "./publish.js";

let SVG_ATTRS;
let SVG_HTML;

const isProd = process.env.NODE_ENV === "production";
let docEnv = {};

if (!isProd) {
  ({ SVG_ATTRS, SVG_HTML } = parseSvg(join(process.cwd(), "example.svg")));
  docEnv.HFC_DOC_ICON_NAME = "svg-icon";
}

export default {
  entry: "./src/index.ts",
  plugins: [ts()],
  env: isProd
    ? {}
    : {
        HFC_PUBLIC_SVG_ATTRS: SVG_ATTRS,
        HFC_PUBLIC_SVG_HTML: SVG_HTML,
      },
  docEnv,
};
