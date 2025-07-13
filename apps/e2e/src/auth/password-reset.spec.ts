// import { expect } from "@playwright/test";
// import { test } from "../utils/pwTest";
// import { ForgotPasswordPageModel } from "../utils/pages/ForgotPasswordPage";
// import { ResetPasswordPageModel } from "../utils/pages/ResetPasswordPage";

// test("should be able to reset password @mail @mobile", async ({
//   employeeSzenario,
// }) => {
//   const ForgotPasswordPage = new ForgotPasswordPageModel(employeeSzenario);
//   await ForgotPasswordPage.goto();

//   await ForgotPasswordPage.locators.emailField.input.fill(
//     employeeSzenario.employee.account.email,
//   );

//   await ForgotPasswordPage.locators.submitButton.click();

//   await expect(ForgotPasswordPage.locators.successTitle).toBeVisible();

//   const ResetPasswordPage = new ResetPasswordPageModel(employeeSzenario, {
//     token,
//   });
//   await ResetPasswordPage.goto();

//   const newPassword = "agsnih4345r@!_fdsa";
//   const Dashboardpage = await ResetPasswordPage.resetPassword(newPassword);

//   const LoginPage = await Dashboardpage.Header.userMenu.logout();

//   await LoginPage.login({
//     email: employeeSzenario.employee.account.email,
//     password: newPassword,
//   });
// });
