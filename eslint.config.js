import json from "@eslint/json";
import prettierConfig from "eslint-config-prettier";
import headerPlugin from "eslint-plugin-header";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";
import schemaPlugin from "./eslint/eslint-plugin-scene-schemas.js";
headerPlugin.rules.header.meta.schema = false; // this makes header plugin compatible with eslint 9

export default tseslint.config(
  // lint json schema files
  {
    files: ["schemas/**/*.json"],
    ignores: ["schemas/CommonTypes.json"],
    language: "json/json",
    plugins: {
      json,
      "scene-schemas": schemaPlugin,
    },
    rules: {
      ...json.configs.recommended.rules,
      "scene-schemas/no-plain-string-types": "error",
      "scene-schemas/no-additional-properties": "error",
      "scene-schemas/top-level-object-type": "error",
    },
  },
  // lint common types
  {
    files: ["schemas/CommonTypes.json"],
    language: "json/json",
    plugins: {
      json,
      "scene-schemas": schemaPlugin,
    },
    rules: {
      ...json.configs.recommended.rules,
      "scene-schemas/no-additional-properties": "error",
    },
  },
  // lint test files
  {
    files: ["test/**.ts"],
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      parser: tseslint.parser,
      sourceType: "module",
      parserOptions: {
        project: "tsconfig.json",
      },
    },
    plugins: {
      prettier: prettierPlugin,
      header: headerPlugin,
    },
    extends: [
      tseslint.configs.recommended,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
      prettierConfig,
    ],
    rules: {
      "prettier/prettier": "error",
      "consistent-return": "warn",
      "curly": ["error", "all"],
      "eqeqeq": "warn",
      "no-alert": "warn",
      "no-empty": ["warn", { allowEmptyCatch: true }],
      "no-eval": "error",
      "quotes": ["error", "double"],
      "import/order": ["error", { alphabetize: { order: "asc" } }],
      "header/header": ["error", "line", [" Copyright (c) Bentley Systems, Incorporated. All rights reserved."]],
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/return-await": "warn",
      "@typescript-eslint/switch-exhaustiveness-check": "warn",
    },
  },
);
