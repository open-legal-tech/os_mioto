import de from "@mioto/locale/de" with { type: "json" };
import { expect } from "@playwright/test";
import { test } from "./utils/pwTest";
import { SettingsPageModel } from "./utils/pages/SettingsPage";
import { TreeDashboardPageModel } from "./utils/pages/TreeDashboardPage";
import { LoginPageModel } from "./utils/pages/LoginPage";

test.describe("change email", () => {
  // test("should allow changing email @mail", async ({ employeeSzenario }) => {
  //   const user = employeeSzenario.environment.Employee.create();
  //   const SettingsPage = new SettingsPageModel(employeeSzenario);
  //   await SettingsPage.goto();

  //   await SettingsPage.locators.changeEmailCard.input.fill(user.account.email);
  //   await SettingsPage.locators.changeEmailCard.submitButton.click();

  //   await SettingsPage.locators.verifyLogin.passwordInput.fill(
  //     employeeSzenario.employee.account.password,
  //   );
  //   await SettingsPage.locators.verifyLogin.submitButton.click();

  //   const latestEmail = await user.mail.getLatestMail();

  //   const verifyEmailLink = latestEmail.html?.links?.find(
  //     (link) => link.text === " E-Mail bestätigen",
  //   )?.href;

  //   if (!verifyEmailLink) {
  //     throw new Error("No verify email link found");
  //   }

  //   await employeeSzenario.environment.page.goto(verifyEmailLink);

  //   const Dashboard = new TreeDashboardPageModel(employeeSzenario);
  //   await Dashboard.goto();

  //   const LoginPage = await Dashboard.Header.userMenu.logout();

  //   await LoginPage.login({
  //     email: user.account.email,
  //     password: employeeSzenario.employee.account.password,
  //   });

  //   await expect(LoginPage.szenario.environment.page).toHaveURL(/.*dashboard/);
  // });

  test("should not allow changing email to existing email", async ({
    employeeSzenario,
  }) => {
    const SettingsPage = new SettingsPageModel(employeeSzenario);
    await SettingsPage.goto();

    const otherUser = await employeeSzenario.environment.Employee.insert();

    await SettingsPage.locators.changeEmailCard.input.fill(
      otherUser.account.email,
    );
    await SettingsPage.locators.changeEmailCard.submitButton.click();

    await SettingsPage.locators.verifyLogin.passwordInput.fill(
      employeeSzenario.employee.account.password,
    );
    await SettingsPage.locators.verifyLogin.submitButton.click();

    await expect(SettingsPage.locators.changeEmailCard.formError).toHaveText(
      de.components["change-email"].errors.email_already_used,
    );
  });
});

test.describe("change password", () => {
  test("should allow changing password", async ({ employeeSzenario }) => {
    const newPassword = "fasdglfaskjg345rf@4!#@#";
    const SettingsPage = new SettingsPageModel(employeeSzenario);
    await SettingsPage.goto();

    await SettingsPage.locators.changePasswordCard.input.fill(newPassword);
    await SettingsPage.locators.changePasswordCard.submitButton.click();

    await SettingsPage.locators.verifyLogin.passwordInput.fill(
      employeeSzenario.employee.account.password,
    );
    await SettingsPage.locators.verifyLogin.submitButton.click();

    const LoginPage = await SettingsPage.Header.userMenu.logout();

    await LoginPage.login({
      password: newPassword,
      email: employeeSzenario.employee.account.email,
    });

    await expect(LoginPage.szenario.environment.page).toHaveURL(/.*dashboard/);
  });

  test("should enforce password complexity", async ({ employeeSzenario }) => {
    const newPassword = "password";
    const SettingsPage = new SettingsPageModel(employeeSzenario);
    await SettingsPage.goto();

    await SettingsPage.locators.changePasswordCard.input.fill(newPassword);
    await SettingsPage.locators.changePasswordCard.submitButton.click();

    await expect(
      SettingsPage.locators.changePasswordCard.formError,
    ).toBeVisible();
  });
});

test("should allow deletion of account", async ({ employeeSzenario }) => {
  const SettingsPage = new SettingsPageModel(employeeSzenario);
  await SettingsPage.goto();

  await SettingsPage.locators.deleteAccountCard.submitButton.click();

  await SettingsPage.locators.verifyLogin.passwordInput.fill(
    employeeSzenario.employee.account.password,
  );

  await Promise.all([
    employeeSzenario.environment.page.waitForURL(/.*home/),
    SettingsPage.locators.verifyLogin.submitButton.click(),
  ]);

  const LoginPage = new LoginPageModel(employeeSzenario);
  await LoginPage.goto();

  await LoginPage.login({
    email: employeeSzenario.employee.account.email,
    password: employeeSzenario.employee.account.password,
    wait: false,
  });

  await expect(
    LoginPage.locators.formError(
      de.auth.login.errors.incorrect_email_or_password,
    ),
  ).toBeVisible();
});

test("should show error and stay open on invalid credentials", async ({
  employeeSzenario,
}) => {
  const SettingsPage = new SettingsPageModel(employeeSzenario);
  await SettingsPage.goto();

  await SettingsPage.locators.changeEmailCard.input.fill(
    "doesntmatter@doesntmatter.com",
  );
  await SettingsPage.locators.changeEmailCard.submitButton.click();

  await SettingsPage.locators.verifyLogin.passwordInput.fill("wrongpassword");

  await SettingsPage.locators.verifyLogin.submitButton.click();

  await expect(SettingsPage.locators.verifyLogin.formError).toBeVisible();
});
