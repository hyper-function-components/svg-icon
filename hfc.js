import ts from "hfc-plugin-typescript";

let SVG_ATTRS;
let SVG_HTML;

const isProd = process.env.NODE_ENV === "production";

if (!isProd) {
}

export default {
  entry: "./src/index.ts",
  plugins: [ts()],
  defineEnv: isProd
    ? {}
    : {
        "process.env.SVG_ATTRS": `[["xmlns","http://www.w3.org/2000/svg"],["viewBox","0 0 24 24"]]`,
        "process.env.SVG_HTML": JSON.stringify(
          `<g fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\">    <path d=\"M3 16v-5.5a2.5 2.5 0 0 1 5 0V16m0-4H3\"></path>    <path d=\"M12 6v12\"></path>    <path d=\"M16 16V8h3a2 2 0 0 1 0 4h-3m3 0a2 2 0 0 1 0 4h-3\"></path>  </g>`
        ),
      },
};
