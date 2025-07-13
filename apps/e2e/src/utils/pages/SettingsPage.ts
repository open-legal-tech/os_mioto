import { HeaderComponent } from "../components/HeaderComponent";
import type {
  EmployeeSzenario,
  SzenarioData,
} from "../szenarios/EmployeeSzenario";

export class SettingsPageModel<TSzenario extends SzenarioData> {
  readonly szenario: EmployeeSzenario<TSzenario>;
  get meta() {
    return {
      isAuthenticated: true,
      isTracked: true,
      url: `/org/${this.szenario.employee.organization.slug}/settings`,
    };
  }

  get locators() {
    const dialog = this.szenario.environment.page.getByRole("dialog");

    return {
      changePasswordCard: {
        input: this.szenario.environment.page.getByRole("textbox", {
          name: "Neues Passwort",
        }),
        submitButton: this.szenario.environment.page.getByRole("button", {
          name: "Passwort ändern",
        }),
        formError: this.szenario.environment.page.locator(
          '[data-test="error-newPassword"]',
        ),
      },

      changeEmailCard: {
        input: this.szenario.environment.page.getByRole("textbox", {
          name: "E-Mail",
        }),
        submitButton: this.szenario.environment.page.getByRole("button", {
          name: "E-Mail ändern",
        }),
        formError: this.szenario.environment.page.locator(
          '[data-test="error-email"]',
        ),
      },

      deleteAccountCard: {
        submitButton: this.szenario.environment.page.getByRole("button", {
          name: "Account löschen",
        }),
      },

      verifyLogin: {
        dialog,
        passwordInput: dialog.getByRole("textbox", { name: "Passwort" }),
        submitButton: this.szenario.environment.page.getByRole("button", {
          name: "Bestätigen",
        }),
        formError: dialog.getByRole("alert"),
      },
    };
  }

  get Header() {
    return new HeaderComponent(this.szenario);
  }

  constructor(szenario: EmployeeSzenario<TSzenario>) {
    this.szenario = szenario;
  }

  async goto() {
    await this.szenario.environment.page.goto(this.meta.url);
  }
}
