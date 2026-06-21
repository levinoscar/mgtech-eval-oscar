import { test, expect } from "@playwright/test";

const PASSWORD = "password123";

async function registerAndLogin(page: import("@playwright/test").Page) {
  const email = `e2e.users.${Date.now()}.${Math.floor(Math.random() * 1000)}@example.com`;
  await page.goto("/app/");
  await page.getByTestId("tab-register").click();
  await page.getByTestId("register-email").fill(email);
  await page.getByTestId("register-password").fill(PASSWORD);
  await page.getByTestId("register-submit").click();
  await expect(page.getByTestId("app-view")).toBeVisible();
  return email;
}

test.describe("User list", () => {
  test("a logged-in user sees the user list", async ({ page }) => {
    await registerAndLogin(page);

    await expect(page.getByTestId("users-body").getByTestId("user-row").first()).toBeVisible();
    // status reports a total count
    await expect(page.getByTestId("users-status")).toContainText(/user\(s\)/);
  });

  test("search filters the user list to the matching user", async ({ page }) => {
    const email = await registerAndLogin(page);

    await page.getByTestId("user-search").fill(email);
    await page.getByTestId("user-search-button").click();

    // The matching user should appear...
    await expect(page.getByTestId("user-email").filter({ hasText: email })).toBeVisible();
    // ...and the result set should be narrowed to exactly one row.
    await expect(page.getByTestId("user-row")).toHaveCount(1);
  });

  test("a search with no matches yields an empty list", async ({ page }) => {
    await registerAndLogin(page);

    await page.getByTestId("user-search").fill("no.such.user.zzz@nowhere.invalid");
    await page.getByTestId("user-search-button").click();

    await expect(page.getByTestId("users-status")).toContainText("0 user(s)");
    await expect(page.getByTestId("user-row")).toHaveCount(0);
  });
});
