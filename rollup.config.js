import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import livereload from "rollup-plugin-livereload";
import serve from "rollup-plugin-serve";
import pkg from "./package.json";

const input = "./src/index.ts";
const external = Object.keys(pkg.dependencies);

const commonTSPluginOptions = {
  lib: ["es5", "es6", "ESNext", "dom"],
};

const getPlugins = (plugins) =>
  process.env.NODE_ENV === "development"
    ? [
        ...plugins,
        serve({
          open: true,
          contentBase: ".",
        }),
        livereload({
          watch: "dist",
        }),
      ]
    : plugins;

export default [false, true].reduce((carry, min) => {
  const plugins = getPlugins(min ? [terser()] : []);
  return carry.concat([
    {
      input,
      output: {
        name: pkg.umdName,
        file: min ? pkg.browser.replace(".js", ".min.js") : pkg.browser,
        exports: "default",
        format: "umd",
      },
      plugins: [typescript(commonTSPluginOptions), ...plugins],
    },
    {
      input,
      output: {
        file: min ? pkg.module.replace(".js", ".min.js") : pkg.module,
        format: "es",
      },
      external,
      plugins: [typescript({ ...commonTSPluginOptions, target: "es6" }), ...plugins],
    },
  ]);
}, []);
