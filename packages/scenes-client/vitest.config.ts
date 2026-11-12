// Copyright (c) Bentley Systems, Incorporated. All rights reserved.
import { defineConfig } from "vitest/config";

export default defineConfig({
  envDir: "./tests",
  test: {
    typecheck: {
      enabled: true,
      tsconfig: "./tsconfig.eslint.json",
    },
  },
});
