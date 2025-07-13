import { AnalyticsBanner } from "../components/AnalyticsBanner";
import type {
  EmployeeSzenario,
  SzenarioData,
} from "../szenarios/EmployeeSzenario";
import { TreeDashboardPageModel } from "./TreeDashboardPage";

export class ResetPasswordPageModel<TData extends SzenarioData> {
  readonly szenario: EmployeeSzenario<TData>;
  get meta() {
    return {
      isAuthenticated: false,
      isTracked: true,
      url: `/auth/reset-password/${this.token}`,
    };
  }
  readonly token: string;

  get components() {
    return {
      AnalyticsBanner: new AnalyticsBanner(this.szenario.environment),
    };
  }

  get locators() {
    return {
      input: this.szenario.environment.page.getByRole("textbox", {
        name: "Passwort",
        exact: true,
      }),
      confirmationInput: this.szenario.environment.page.getByRole("textbox", {
        name: "Passwort wiederholen",
      }),
      submit: this.szenario.environment.page.getByRole("button", {
        name: "Passwort zurücksetzen",
      }),
    };
  }

  constructor(szenario: EmployeeSzenario<TData>, { token }: { token: string }) {
    this.szenario = szenario;

    this.token = token;
  }

  async resetPassword(password: string) {
    await this.locators.input.fill(password);
    await this.locators.confirmationInput.fill(password);
    await this.locators.submit.click();

    return new TreeDashboardPageModel(this.szenario);
  }

  async goto() {
    await this.szenario.environment.page.goto(this.meta.url);
  }
}
