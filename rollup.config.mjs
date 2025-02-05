import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "rollup";
import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

const createConfig = (outputFormat, env = null) =>
  defineConfig({
    input: fileURLToPath(new URL("./src/index.ts", import.meta.url)),
    plugins: [
      nodeResolve(),
      typescript(),
      env === "production" &&
        terser({
          output: { comments: false },
          ecma: 5,
        }),
    ],
    output: {
      file: `dist/giftexchange.${outputFormat}${env ? "." + env : ""}.js`,
      format: outputFormat,
      name: "GiftExchange",
      sourcemap: true,
    },
  });

export default [
  createConfig("esm"),
  createConfig("cjs"),
  createConfig("umd", "development"),
  createConfig("umd", "production"),
];
