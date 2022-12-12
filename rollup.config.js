"use strict";

import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import dts from "rollup-plugin-dts";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from 'rollup-plugin-typescript2';
import { DEFAULT_EXTENSIONS } from "@babel/core";
import { terser } from "rollup-plugin-terser";

const NAME = process.env.npm_package_name;
const VERSION = process.env.npm_package_version;
const LICENSE = process.env.npm_package_license;
const CURRENT_YEAR = new Date().getFullYear();

const extensions = [...DEFAULT_EXTENSIONS, ".ts"];
const globals = {};
const bannerText =
`/*! *****************************************************************************
 *
 * HappyNodeTokenizer
 * @name ${NAME}
 * @version ${VERSION}
 * @author Peter Hughes<github@phugh.es>(www.phugh.es)
 * @license ${LICENSE}
 * @copyright 2018-${CURRENT_YEAR}. All rights reserved.
 *
 ***************************************************************************** */\n`;

const input = "./src/index.ts";

export default [
  // ESM
  {
    input,

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
        tsconfigOverride: { declaration: false },
        useTsconfigDeclarationDir: true,
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
        tsconfigOverride: { declaration: false },
        useTsconfigDeclarationDir: true,
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
      name: NAME,
      sourcemap: true,
      globals,
    },
  },

  // UMD & IIFE
  {
    input,

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
        tsconfigOverride: { declaration: false },
        useTsconfigDeclarationDir: true,
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
        name: NAME,
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
        name: NAME,
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
