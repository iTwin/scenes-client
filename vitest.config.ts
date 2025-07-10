// vitest.config.ts
import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';

// load your tests/.env before Vitest runs
dotenv.config({ path: './tests/.env' });

export default defineConfig({
  // if you want to use envDir for code under test:
  envDir: './tests',
});
