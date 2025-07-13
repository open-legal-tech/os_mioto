import { AnalyticsBanner } from "../components/AnalyticsBanner";
import { WaitlistForm } from "../components/WaitlistForm";
import type { BaseSzenario } from "../szenarios/BaseSzenario";
import type { SzenarioData } from "../szenarios/EmployeeSzenario";
import { RegisterPageModel } from "./RegisterPage";

export class HomePageModel<TData extends SzenarioData> {
  readonly szenario: BaseSzenario<TData>;

  get meta() {
    return {
      isAuthenticated: false,
      isTracked: true,
      url: "/home",
    };
  }

  get components() {
    return {
      AnalyticsBanner: new AnalyticsBanner(this.szenario.environment),
      WaitlistForm: new WaitlistForm(this.szenario.environment),
    };
  }

  get locators() {
    return {
      loginLink: this.szenario.environment.page.getByRole("link", {
        name: "Login",
      }),
      registerLink: this.szenario.environment.page.getByRole("link", {
        name: "Registrieren",
      }),
    };
  }

  constructor(szenario: BaseSzenario<TData>) {
    this.szenario = szenario;
  }

  async goto() {
    await this.szenario.environment.page.goto(this.meta.url);
  }

  async gotoLogin() {
    await this.locators.loginLink.click();
    await this.szenario.environment.page.waitForURL("/auth/login");
  }

  async gotoRegister() {
    await this.locators.registerLink.click();
    await this.szenario.environment.page.waitForURL("/auth/register");

    return new RegisterPageModel(this.szenario);
  }
}
