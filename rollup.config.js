import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import copy from "rollup-plugin-copy";
import json from "@rollup/plugin-json";

export default {
  input: "src/server.ts",
  output: {
    file: "./dist/bundle.js",
    format: "es"
  },
  plugins: [
    typescript(),
    json(),
    terser(),
    copy({
      targets: [{ src: "src/views/**/*", dest: "dist/views" }],
      verbose: true,
      hook: "writeBundle"
    })
  ]
};
