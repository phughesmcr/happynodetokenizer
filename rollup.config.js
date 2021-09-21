"use strict";

import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import dts from "rollup-plugin-dts";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import * as pkg from "./package.json";
import typescript from "@rollup/plugin-typescript";
import { DEFAULT_EXTENSIONS } from "@babel/core";
import { terser } from "rollup-plugin-terser";

const pkgName = pkg.name;
const extensions = [...DEFAULT_EXTENSIONS, ".ts", ".tsx"];
const external = [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})];
const globals = {};
const bannerText =
`/*! *****************************************************************************
 *
 * ${pkgName}
 * v${pkg.version}
 * license ${pkg.license}
 *
 ***************************************************************************** */\n`;

const input = "./src/index.ts";

export default [
  // ESM
  {
    input,

    external,

    plugins: [
      nodeResolve({
        extensions,
        mainFields: ["module", "main"],
      }),

      commonjs({
        include: "node_modules/**",
        transformMixedEsModules: true,
      }),

      typescript({
        exclude: [ "node_modules", "*.d.ts", "**/*.d.ts" ],
        include: [ "*.ts+(|x)", "**/*.ts+(|x)", "*.m?js+(|x)", "**/*.m?js+(|x)" ],
        module: "ES2020",
        tsconfig: "tsconfig.json",
        tslib: require("tslib"),
        typescript: require("typescript"),
      }),

      babel({
        extensions,
        babelHelpers: "bundled",
        include: ["src/**/*"],
        exclude: ["node_modules/**/*"],
      }),

      terser({
        safari10: true,
        ecma: 2020,
        module: true,
        compress: true,
        mangle: true,
      }),
    ],

    output: [{
      banner: bannerText,
      esModule: true,
      exports: "named",
      file: "./dist/esm/index.min.js",
      format: "es",
      sourcemap: true,
      globals,
    }],
  },

  // CJS
  {
    input,

    external,

    plugins: [
      nodeResolve({
        extensions,
        mainFields: ["node", "main"],
      }),

      commonjs({
        include: "node_modules/**",
        transformMixedEsModules: true,
      }),

      typescript({
        exclude: [ "node_modules", "*.d.ts", "**/*.d.ts" ],
        include: [ "*.ts+(|x)", "**/*.ts+(|x)", "*.m?js+(|x)", "**/*.m?js+(|x)" ],
        tsconfig: "tsconfig.json",
        tslib: require("tslib"),
        typescript: require("typescript"),
      }),

      babel({
        extensions,
        babelHelpers: "bundled",
        include: ["src/**/*"],
        exclude: ["node_modules/**/*"],
      }),

      terser({
        ecma: 2020,
        compress: true,
        mangle: true,
      }),
    ],

    output: {
      banner: bannerText,
      esModule: false,
      exports: "named",
      file: "./dist/cjs/index.min.js",
      format: "cjs",
      name: pkgName,
      sourcemap: true,
      globals,
    },
  },

  // UMD & IIFE
  {
    input,

    external,

    plugins: [
      nodeResolve({
        extensions,
        mainFields: ["browser", "main"],
        browser: true,
      }),

      commonjs({ include: "node_modules/**" }),

      typescript({
        exclude: [ "node_modules", "*.d.ts", "**/*.d.ts" ],
        include: [ "*.ts+(|x)", "**/*.ts+(|x)", "*.m?js+(|x)", "**/*.m?js+(|x)" ],
        tsconfig: "tsconfig.json",
        tslib: require("tslib"),
        typescript: require("typescript"),
      }),

      babel({
        extensions,
        babelHelpers: "bundled",
        include: ["src/**/*"],
        exclude: ["node_modules/**/*"],
      }),

      terser({
        ecma: 2020,
        compress: true,
        mangle: true,
      }),
    ],

    output: [
      {
        banner: bannerText,
        esModule: false,
        exports: "named",
        file: "./dist/umd/index.min.js",
        format: "umd",
        name: pkgName,
        noConflict: true,
        sourcemap: true,
        globals,
      },
      {
        banner: bannerText,
        esModule: false,
        exports: "named",
        file: "./dist/iife/index.min.js",
        format: "iife",
        name: pkgName,
        sourcemap: true,
        globals,
      }
    ]
  },
  // TYPESCRIPT DECLARATIONS
  {
    input: "./types/index.d.ts",
    output: [
      // CJS
      {
        file: "./dist/cjs/index.min.d.ts",
        format: "es"
      },
      // UMD
      {
        file: "./dist/umd/index.min.d.ts",
        format: "es"
      },
      // Browser
      {
        file: "./dist/iife/index.min.d.ts",
        format: "es"
      },
      // ESM
      {
        file: "./dist/esm/index.min.d.ts",
        format: "es"
      },
    ],
    plugins: [
      dts(),
    ],
  },
];
