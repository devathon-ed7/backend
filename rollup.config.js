import { terser } from "rollup-plugin-terser"
import typescript from "rollup-plugin-typescript2"

export default {
  input: "src/server.ts",
  output: {
    file: "./dist/bundle.js",
    format: "es"
  },
  plugins: [typescript(), terser()]
}
