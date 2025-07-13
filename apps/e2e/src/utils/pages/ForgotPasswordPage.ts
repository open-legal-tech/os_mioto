import de from "@mioto/locale/de" with { type: "json" };
import { AnalyticsBanner } from "../components/AnalyticsBanner";
import type {
  EmployeeSzenario,
  SzenarioData,
} from "../szenarios/EmployeeSzenario";

export class ForgotPasswordPageModel<TSzenario extends SzenarioData> {
  readonly szenario: EmployeeSzenario<TSzenario>;

  get meta() {
    return {
      isAuthenticated: false,
      isTracked: true,
      url: "/auth/forgot-password",
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
      submitButton: this.szenario.environment.page.locator(
        `button >> text=${de.auth.forgotPassword.submitButton}`,
      ),
      successTitle: this.szenario.environment.page.locator(
        `text=${de.auth.forgotPassword.success.title}`,
      ),
      loginLink: this.szenario.environment.page.locator(
        `text=${de.auth.forgotPassword.success.loginLink}`,
      ),
    };
  }

  constructor(szenario: EmployeeSzenario<TSzenario>) {
    this.szenario = szenario;
  }

  async goto() {
    await this.szenario.environment.page.goto(this.meta.url);
  }
}
