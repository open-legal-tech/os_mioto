import de from "@mioto/locale/de" with { type: "json" };
import { AnalyticsBanner } from "../components/AnalyticsBanner";
import type { BaseSzenario } from "../szenarios/BaseSzenario";
import type { SzenarioData } from "../szenarios/EmployeeSzenario";

export class LoginPageModel<TSzenario extends SzenarioData> {
  readonly szenario: BaseSzenario<TSzenario>;
  get meta() {
    return {
      isAuthenticated: false,
      isTracked: true,
      url: "/auth/login",
    };
  }

  get components() {
    return {
      AnalyticsBanner: new AnalyticsBanner(this.szenario.environment),
    };
  }

  get locators() {
    return {
      emailField: {
        input: this.szenario.environment.page.locator(
          `label >> text=${de.components["email-input"].label}`,
        ),
        error: this.szenario.environment.page.locator(`data-test=error-email`),
      },

      passwordField: {
        input: this.szenario.environment.page
          .getByLabel(de.components["password-input"].label)
          .first(),
        error: this.szenario.environment.page.locator(
          `data-test=error-password`,
        ),
      },

      registerLink: this.szenario.environment.page.locator(
        `label >> text=${de.auth.login.registerCTA}`,
      ),

      submitButton: this.szenario.environment.page.locator(
        `text=${de.auth.login.submit}`,
      ),

      passwordResetLink: this.szenario.environment.page.locator(
        `text=${de.auth.login.forgotPasswordLink}`,
      ),

      formError: (error: string) =>
        this.szenario.environment.page.getByRole("alert", { name: error }),
    };
  }

  constructor(szenario: BaseSzenario<TSzenario>) {
    this.szenario = szenario;
  }

  async goto() {
    await this.szenario.environment.page.goto(this.meta.url);
  }

  async login({
    wait = true,
    email,
    password,
  }: {
    email: string;
    password: string;
    wait?: boolean;
  }) {
    await this.locators.emailField.input.fill(email);
    await this.locators.passwordField.input.fill(password);

    wait
      ? await Promise.all([
          this.szenario.environment.page.waitForURL("**/dashboard"),
          this.locators.submitButton.click(),
        ])
      : await this.locators.submitButton.click();
  }
}
