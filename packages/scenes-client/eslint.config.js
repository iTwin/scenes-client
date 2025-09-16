import prettierConfig from "eslint-config-prettier";
import headerPlugin from "eslint-plugin-header";
import importPlugin from "eslint-plugin-import";
import prettierPlugin from "eslint-plugin-prettier";
import tseslint from "typescript-eslint";
headerPlugin.rules.header.meta.schema = false; // this makes header plugin compatible with eslint 9

export default tseslint.config(
  {
    files: ["src/**/*.ts", "tests/**/*.ts", "*.d.ts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        project: "tsconfig.eslint.json",
      },
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "tsconfig.eslint.json",
        },
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
      "no-console": "warn",
      "no-empty": ["warn", { allowEmptyCatch: true }],
      "no-eval": "error",
      "quotes": ["error", "double"],
      "import/order": ["error", { alphabetize: { order: "asc" } }],
      "header/header": [
        "error",
        "block",
        [
          "---------------------------------------------------------------------------------------------",
          " * Copyright (c) Bentley Systems, Incorporated. All rights reserved.",
          " * See LICENSE.md in the project root for license terms and full copyright notice.",
          " *--------------------------------------------------------------------------------------------",
        ],
      ],
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/return-await": "warn",
      "@typescript-eslint/switch-exhaustiveness-check": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_", caughtErrors: "none" }],
    },
  },
  {
    ignores: [
      'lib/**/*',
    ]
  },
);
