import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";
import copy from "rollup-plugin-copy";

export default {
  input: "src/server.ts",
  output: {
    file: "./dist/bundle.js",
    format: "es"
  },
  plugins: [
    typescript(),
    terser(),
    copy({
      targets: [{ src: "src/views/**/*", dest: "dist/views" }],
      verbose: true,
      hook: "writeBundle"
    })
  ]
};
