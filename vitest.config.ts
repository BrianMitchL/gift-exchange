import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: "test/setupTests.ts",
    coverage: {
      exclude: ["test/to-be-valid-derangement.ts"],
      provider: "v8",
      reporter: ["clover", "json", "lcov", "text"],
    },
  },
});
