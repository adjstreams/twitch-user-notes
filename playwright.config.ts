import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "__tests__/e2e",
  testMatch: "**/*.e2e.ts",
  use: {
    headless: false,
  },
});
