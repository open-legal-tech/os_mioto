import de from "@mioto/locale/de" with { type: "json" };
import { AnalyticsBanner } from "../components/AnalyticsBanner";
import type { BaseSzenario } from "../szenarios/BaseSzenario";
import type { SzenarioData } from "../szenarios/EmployeeSzenario";
import { testUtilsEnv } from "../../../env";

export class RegisterPageModel<TData extends SzenarioData> {
  readonly szenario: BaseSzenario<TData>;
  get meta() {
    return {
      isAuthenticated: false,
      isTracked: true,
      url: "/auth/register",
    };
  }

  get components() {
    return {
      AnalyticsBanner: new AnalyticsBanner(this.szenario.environment),
    };
  }

  get locators() {
    return {
      accessForm: {
        input: this.szenario.environment.page.locator(
          `label >> text=Zugangscode`,
        ),
        error: this.szenario.environment.page.locator(
          `data-test=error-password`,
        ),
        submitButton: this.szenario.environment.page.getByRole("button", {
          name: `Weiter zur Registrierung`,
        }),
      },

      registerForm: {
        emailField: {
          input: this.szenario.environment.page.locator(
            `label >> text=${de.components["email-input"].label}`,
          ),
          error: this.szenario.environment.page.locator(
            `data-test=error-email`,
          ),
        },

        passwordField: {
          input: this.szenario.environment.page
            .locator(`label >> text=${de.components["password-input"].label}`)
            .nth(0),
          error: this.szenario.environment.page.locator(
            `data-test=error-password`,
          ),
        },

        passwordConfirmationField: {
          input: this.szenario.environment.page.locator(
            `label >> text=${de.auth.register["register-form"].form.passwordConfirmation.label}`,
          ),
          error: this.szenario.environment.page.locator(
            `data-test=error-passwordConfirmation`,
          ),
        },

        privacyField: {
          input: this.szenario.environment.page.locator(
            `label >> text=Ich habe die Datenschutzerklä`,
          ),
          error: this.szenario.environment.page.locator(
            `data-test=error-privacy`,
          ),
        },

        alphaDisclaimer: {
          input: this.szenario.environment.page.getByLabel(
            "Ich habe zur Kenntnis",
          ),
          error: this.szenario.environment.page.locator(
            `data-test=error-disclaimer`,
          ),
        },

        termsField: {
          input: this.szenario.environment.page.getByLabel(
            "Ich habe die allgemeinen",
          ),
          error: this.szenario.environment.page.locator(
            `data-test=error-terms`,
          ),
        },

        submitButton: this.szenario.environment.page.locator(
          `text=${de.auth.register["register-form"].form.submit}`,
        ),
        formError:
          this.szenario.environment.page.locator(`data-test=form-error`),
        dataProtectionLink: this.szenario.environment.page
          .locator("form")
          .getByRole("link", { name: "Datenschutzerklärung" }),
        loginLink: this.szenario.environment.page.locator(
          `text=${de.auth.register["register-form"].loginCTA.link}`,
        ),
      },

      orgForm: {
        nameField: {
          input: this.szenario.environment.page.getByRole("textbox", {
            name: "Organisationsname",
          }),
          error: this.szenario.environment.page.locator(`data-test=error-name`),
        },
        slugField: {
          input: this.szenario.environment.page.getByRole("textbox", {
            name: "Organisations-URL",
          }),
          error: this.szenario.environment.page.locator(`data-test=error-slug`),
        },
        submitButton: this.szenario.environment.page.getByRole("button", {
          name: "Registrieren",
        }),
      },
    };
  }

  constructor(szenario: BaseSzenario<TData>) {
    this.szenario = szenario;
  }

  async goto() {
    await this.szenario.environment.page.goto(this.meta.url);
  }

  async getAccess(password?: string) {
    const code = password ?? testUtilsEnv.REGISTER_ACCESS_CODES?.[0];

    if (!code)
      throw Error(
        "No access code provided. For testing the access code can be provided as the REGISTER_ACCESS_CODES environment variable",
      );

    await this.locators.accessForm.input.fill(code);
    await this.locators.accessForm.submitButton.click();
  }

  async register({ email, password }: { email: string; password: string }) {
    await this.locators.registerForm.emailField.input.fill(email);
    await this.locators.registerForm.passwordField.input.fill(password);
    await this.locators.registerForm.passwordConfirmationField.input.fill(
      password,
    );
    await this.locators.registerForm.privacyField.input.click();
    await this.locators.registerForm.alphaDisclaimer.input.click();
    await this.locators.registerForm.termsField.input.click();

    await this.locators.registerForm.submitButton.click();
  }

  async configureOrg({
    orgName,
    orgSlug,
  }: {
    orgName: string;
    orgSlug: string;
  }) {
    await this.locators.orgForm.nameField.input.fill(orgName);
    await this.locators.orgForm.slugField.input.fill(orgSlug);

    await this.locators.orgForm.submitButton.click();
  }
}
