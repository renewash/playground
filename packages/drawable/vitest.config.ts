import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8", // or 'istanbul'
    },
    disableConsoleIntercept: true,
    globals: true,
    environment: "jsdom",
  },
});
