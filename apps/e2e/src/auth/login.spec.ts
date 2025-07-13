import { FatalError } from "@mioto/errors";
import de from "@mioto/locale/de" with { type: "json" };
import { expect } from "@playwright/test";
import { test } from "../utils/pwTest";
import { LoginPageModel } from "../utils/pages/LoginPage";

test.describe("valid credentials @mobile", () => {
  test("should login and redirect after user submits credentials", async ({
    employeeSzenario,
  }) => {
    await expect(employeeSzenario.environment.page).toHaveURL(/.*dashboard/);
  });

  test("should show generic error message when request fails due to server error @mobile", async ({
    employeeSzenario,
  }) => {
    const LoginPage = new LoginPageModel(employeeSzenario);
    await LoginPage.goto();

    await LoginPage.szenario.environment.page.route(
      "**/auth/login",
      (route) => {
        const error = new FatalError({ code: "unexpected" });

        route.fulfill({
          status: 500,
          contentType: "application/json",
          body: JSON.stringify(error),
        });
      },
    );

    await LoginPage.login({
      email: employeeSzenario.employee.account.email,
      password: employeeSzenario.employee.account.password,
      wait: false,
    });

    await expect(
      LoginPage.szenario.environment.page.getByRole("alert", {
        name: "Fehler",
      }),
    ).toBeVisible();
  });
});

test.describe("invalid credentials @mobile", () => {
  test("should fail to login with wrong credentials and succeed with corrected ones", async ({
    employeeSzenario,
  }) => {
    const LoginPage = new LoginPageModel(employeeSzenario);
    await LoginPage.goto();

    const nonRegisteredUser = employeeSzenario.environment.Employee.create();
    // Try submitting invalid credentials that we have just created and not inserted into the database
    await LoginPage.login({
      wait: false,
      email: nonRegisteredUser.account.email,
      password: nonRegisteredUser.account.password,
    });
    await expect(
      LoginPage.locators.formError(
        de.auth.login.errors.incorrect_email_or_password,
      ),
    ).toBeVisible();

    // Try a login again with correct credentials. These are coming from the login function internally.
    await LoginPage.login({
      email: employeeSzenario.employee.account.email,
      password: employeeSzenario.employee.account.password,
    });

    await expect(LoginPage.szenario.environment.page).toHaveURL(/.*dashboard/);
  });
});

test.describe("incomplete credentials @mobile", () => {
  test("should show error message when data is not provided", async ({
    employeeSzenario,
  }) => {
    const LoginPage = new LoginPageModel(employeeSzenario);
    await LoginPage.goto();

    await LoginPage.locators.emailField.input.fill("test@test.com");
    await LoginPage.locators.submitButton.click();

    await expect(LoginPage.locators.passwordField.error).toBeVisible();

    await LoginPage.locators.emailField.input.clear();
    await LoginPage.locators.passwordField.input.fill("test");
    await LoginPage.locators.submitButton.click();

    await expect(LoginPage.locators.emailField.error).toBeVisible();
  });
});
