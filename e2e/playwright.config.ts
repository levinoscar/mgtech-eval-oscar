import { defineConfig } from "@playwright/test";

// The app + API must be running (docker compose up -d) before running these.
// The SPA is served by the backend at http://localhost:3000/app/.
export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: { timeout: 7_000 },
  fullyParallel: true,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
    screenshot: "only-on-failure",
    trace: "on-first-retry",
  },
});
