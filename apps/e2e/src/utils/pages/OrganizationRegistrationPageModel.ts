import type { CustomerSzenario } from "../szenarios/CustomerSzenario";
import type { SzenarioData } from "../szenarios/EmployeeSzenario";
import { CustomerDashboardPageModel } from "./CustomerDashboardPageModel";

export class OrganizationRegistrationPageModel<TData extends SzenarioData> {
  readonly szenario: CustomerSzenario<TData>;
  get meta() {
    return {
      isAuthenticated: false,
      isTracked: false,
      url: `/${this.szenario.customer.organization.slug}/accept-invite?type=customer&uuid=${this.szenario.customer.customer.userUuid}`,
    };
  }

  get locators() {
    return {
      passwordInput: this.szenario.environment.page.getByRole("textbox", {
        name: "Passwort",
        exact: true,
      }),
      repeatPasswordInput: this.szenario.environment.page.getByRole("textbox", {
        name: "Passwort bestätigen",
      }),
      agbCheckbox: this.szenario.environment.page.getByLabel(
        "Ich habe die allgemeinen",
      ),
      privacyCheckbox: this.szenario.environment.page.getByLabel(
        "Ich habe die Datenschutzerklä",
      ),
      submit: this.szenario.environment.page.getByRole("button", {
        name: "Registrieren",
      }),
    };
  }

  constructor(szenario: CustomerSzenario<TData>) {
    this.szenario = szenario;
  }

  async goto() {
    await this.szenario.environment.page.goto(this.meta.url);
  }

  async register() {
    await this.locators.passwordInput.fill(
      this.szenario.customer.account.password,
    );
    await this.locators.repeatPasswordInput.fill(
      this.szenario.customer.account.password,
    );
    await this.locators.agbCheckbox.check();
    await this.locators.privacyCheckbox.check();

    await this.locators.submit.click();

    return new CustomerDashboardPageModel(this.szenario);
  }
}
