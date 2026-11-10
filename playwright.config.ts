import { defineConfig } from "@playwright/test"
export default defineConfig({
  testDir: "./tests/visual",
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: "http://127.0.0.1:5175",
    viewport: { width: 1280, height: 720 },
    timezoneId: "UTC",
  },
  webServer: {
    command: "yarn dev --host 127.0.0.1 --port 5175 --strictPort",
    url: "http://127.0.0.1:5175/graphics/",
    reuseExistingServer: !process.env.CI,
  },
})
