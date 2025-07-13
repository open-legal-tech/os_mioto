import { defineConfig, devices } from "@playwright/test";

// For CI, you may want to set BASE_URL to the deployed application.
const baseURL = process.env.CLIENT_ENDPOINT;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "src",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  use: {
    baseURL,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
        locale: "de",
        viewport: { width: 1920, height: 1080 },
      },
    },

    {
      name: "firefox",
      use: {
        ...devices["Desktop Firefox"],
        locale: "de",
        viewport: { width: 1920, height: 1080 },
      },
    },

    {
      name: "webkit",
      use: {
        ...devices["Desktop Safari"],
        locale: "de",
        viewport: { width: 1920, height: 1080 },
      },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
    {
      name: "Mobile Safari",
      use: { ...devices["iPhone 12"] },
    },
  ],
});
