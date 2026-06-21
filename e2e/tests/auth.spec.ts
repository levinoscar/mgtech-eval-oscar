import { test, expect } from "@playwright/test";

const PASSWORD = "password123";

function uniqueEmail(tag = "auth") {
  return `e2e.${tag}.${Date.now()}.${Math.floor(Math.random() * 1000)}@example.com`;
}

test.describe("Authentication flows", () => {
  test("register -> see profile -> logout -> log back in", async ({ page }) => {
    const email = uniqueEmail();
    await page.goto("/app/");

    // Register
    await page.getByTestId("tab-register").click();
    await page.getByTestId("register-email").fill(email);
    await page.getByTestId("register-password").fill(PASSWORD);
    await page.getByTestId("register-firstname").fill("E2E");
    await page.getByTestId("register-lastname").fill("Tester");
    await page.getByTestId("register-submit").click();

    // Logged in -> profile visible with our email
    await expect(page.getByTestId("app-view")).toBeVisible();
    await expect(page.getByTestId("profile-email")).toHaveText(email);

    // The JWT should be persisted in localStorage
    const token = await page.evaluate(() => localStorage.getItem("eval_token"));
    expect(token).toBeTruthy();

    // Logout -> back to auth view
    await page.getByTestId("logout-button").click();
    await expect(page.getByTestId("auth-view")).toBeVisible();

    // Log back in
    await page.getByTestId("login-email").fill(email);
    await page.getByTestId("login-password").fill(PASSWORD);
    await page.getByTestId("login-submit").click();
    await expect(page.getByTestId("profile-email")).toHaveText(email);
  });

  test("session persists across a page reload", async ({ page }) => {
    const email = uniqueEmail("persist");
    await page.goto("/app/");
    await page.getByTestId("tab-register").click();
    await page.getByTestId("register-email").fill(email);
    await page.getByTestId("register-password").fill(PASSWORD);
    await page.getByTestId("register-submit").click();
    await expect(page.getByTestId("app-view")).toBeVisible();

    await page.reload();
    // Still logged in after reload (token read from localStorage)
    await expect(page.getByTestId("app-view")).toBeVisible();
    await expect(page.getByTestId("profile-email")).toHaveText(email);
  });

  test("login with a wrong password shows an error", async ({ page }) => {
    const email = uniqueEmail("wrongpw");
    await page.goto("/app/");

    // Create the account first
    await page.getByTestId("tab-register").click();
    await page.getByTestId("register-email").fill(email);
    await page.getByTestId("register-password").fill(PASSWORD);
    await page.getByTestId("register-submit").click();
    await expect(page.getByTestId("app-view")).toBeVisible();
    await page.getByTestId("logout-button").click();

    // Attempt with the wrong password
    await page.getByTestId("login-email").fill(email);
    await page.getByTestId("login-password").fill("definitely-wrong");
    await page.getByTestId("login-submit").click();

    await expect(page.getByTestId("auth-error")).toBeVisible();
    await expect(page.getByTestId("auth-error")).toContainText(/invalid/i);
    // Must NOT be logged in
    await expect(page.getByTestId("auth-view")).toBeVisible();
  });

  test("registration rejects a too-short password (server validation surfaced)", async ({
    page,
  }) => {
    await page.goto("/app/");
    await page.getByTestId("tab-register").click();
    await page.getByTestId("register-email").fill(uniqueEmail("shortpw"));
    await page.getByTestId("register-password").fill("123");
    await page.getByTestId("register-submit").click();

    await expect(page.getByTestId("auth-error")).toBeVisible();
    await expect(page.getByTestId("auth-view")).toBeVisible();
  });
});
