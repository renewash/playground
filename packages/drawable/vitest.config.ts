import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";

export default defineConfig({
  test: {
    coverage: {
      provider: "v8", // or 'istanbul'
    },
    // browser: {
    //   provider: playwright(),
    //   enabled: true,
    //   // at least one instance is required
    //   instances: [{ browser: "chromium" }],
    // },
    // disableConsoleIntercept: true,
    // globals: true,
  },
});
