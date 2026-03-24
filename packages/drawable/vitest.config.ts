import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8", // or 'istanbul'
    },
    // environment: "happy-dom",
    browser: {
      provider: playwright(),
      enabled: true,
      instances: [{ browser: "chromium" }],
    },
    // disableConsoleIntercept: true,
    // globals: true,
  },
});
