import { expect } from "@playwright/test";
import { test } from "../utils/pwTest";
import { RegisterPageModel } from "../utils/pages/RegisterPage";
import { EmployeeSzenario } from "../utils/szenarios/EmployeeSzenario";

// test.describe("with valid data @mobile", () => {
//   test("successfull register @mail", async ({ anonymusSzenario }) => {
//     const RegisterPage = new RegisterPageModel(anonymusSzenario);

//     await RegisterPage.goto();
//     await RegisterPage.getAccess();
//     const employee = anonymusSzenario.environment.Employee.create();
//     const employeeSzenario = new EmployeeSzenario(
//       anonymusSzenario.environment,
//       employee,
//       { trees: {} },
//     );
//     await RegisterPage.register({
//       email: employee.account.email,
//       password: employee.account.password,
//     });

//     if (!employee.organization.name) {
//       throw new Error("Organization name is missing");
//     }

//     await RegisterPage.configureOrg({
//       orgName: employee.organization.name,
//       orgSlug: employee.organization.slug,
//     });

//     await expect(
//       anonymusSzenario.environment.page,
//       "should have redirected after successfull registration",
//     ).toHaveURL(/.*dashboard/);

//     const latestEmail = await employee.mail.getLatestMail();

//     expect(latestEmail.subject).toBe(
//       "Nur noch wenige Schritte um mit Mioto zu starten.",
//     );
//     expect(latestEmail.from?.[0]?.email).toBe("mail@mioto.app");

//     const verifyEmailLink =
//       latestEmail.text?.links?.find((link) => link.href?.includes("token"))
//         ?.href ?? "";

//     await anonymusSzenario.environment.page.goto(verifyEmailLink);
//   });
// });

test.describe("with invalid credentials @mobile", () => {
  test("should show field error when data is missing", async ({
    anonymusSzenario,
  }) => {
    const RegisterPage = new RegisterPageModel(anonymusSzenario);
    await RegisterPage.goto();

    await RegisterPage.getAccess();

    const user = anonymusSzenario.environment.Employee.create();
    // We assume that each input works on its own so we can check all errors at once
    await RegisterPage.locators.registerForm.emailField.input.fill(
      user.account.email,
    );
    await RegisterPage.locators.registerForm.submitButton.click();

    await expect(
      RegisterPage.locators.registerForm.emailField.error,
    ).toBeHidden();

    await expect(
      RegisterPage.locators.registerForm.passwordField.error,
    ).toBeVisible();

    await expect(
      RegisterPage.locators.registerForm.passwordConfirmationField.error,
    ).toBeVisible();

    await expect(
      RegisterPage.locators.registerForm.termsField.error,
    ).toBeVisible();

    await expect(
      RegisterPage.locators.registerForm.termsField.error,
    ).toBeVisible();

    await expect(
      RegisterPage.locators.registerForm.privacyField.error,
    ).toBeVisible();
  });

  test("should not register when email is taken", async ({
    anonymusSzenario,
  }) => {
    const RegisterPage = new RegisterPageModel(anonymusSzenario);
    await RegisterPage.goto();

    const user = await anonymusSzenario.environment.Employee.insert();

    await RegisterPage.getAccess();
    await RegisterPage.register({
      email: user.account.email,
      password: user.account.password,
    });

    await expect(
      RegisterPage.locators.registerForm.emailField.error,
    ).toBeVisible();
  });
});

test("should navigate to the data protection agreement @mobile", async ({
  anonymusSzenario,
  context,
}) => {
  const RegisterPage = new RegisterPageModel(anonymusSzenario);
  await RegisterPage.goto();

  await RegisterPage.getAccess();

  const [newPage] = await Promise.all([
    context.waitForEvent("page"),
    RegisterPage.locators.registerForm.dataProtectionLink.click(),
  ]);

  await newPage.waitForLoadState();

  await expect(newPage, "should be on privacy page").toHaveURL(`/de/privacy`);
});

test("should navigate to login @mobile", async ({ anonymusSzenario }) => {
  const RegisterPage = new RegisterPageModel(anonymusSzenario);
  await RegisterPage.goto();

  await Promise.all([
    RegisterPage.szenario.environment.page.waitForURL("/de/auth/login"),
    RegisterPage.locators.registerForm.loginLink.click(),
  ]);
});
