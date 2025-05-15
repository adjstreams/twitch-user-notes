// vitest.config.ts
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "jsdom",
    globals: true,
    include: ["__tests__/unit/**/*.spec.ts"],
    coverage: {
      all: true,
      reporter: ["text", "html", "lcov"],
      reportsDirectory: "coverage",
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/types/**",
        "src/content/content.ts",
        "src/env.d.ts",
        "src/options/options.ts",
        "src/options/init.ts",
        "src/popup/logic.ts",
        "src/popup/popup.ts"
      ]
    }
  }
});
