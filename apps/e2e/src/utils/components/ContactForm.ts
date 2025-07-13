import { type Locator, expect } from "@playwright/test";
import type { EnvironmentModel } from "../environments/Environment";

export class ContactForm {
  readonly environment: EnvironmentModel;
  readonly form: Locator;
  readonly name: {
    readonly label: Locator;
    readonly input: Locator;
    readonly error: Locator;
  };
  readonly email: {
    readonly label: Locator;
    readonly input: Locator;
    readonly error: Locator;
  };
  readonly message: {
    readonly label: Locator;
    readonly input: Locator;
    readonly error: Locator;
  };

  readonly submit: Locator;
  readonly success: Locator;
  readonly error: Locator;

  constructor(environment: EnvironmentModel, nthOnPage = 0) {
    this.environment = environment;

    this.form = environment.page
      .getByRole("form", { name: "contact-form" })
      .nth(nthOnPage);

    this.name = {
      label: this.form.getByText("Dein Name"),
      input: this.form.getByRole("textbox", { name: "Dein Name" }),
      error: this.form.locator(`data-test=error-name`),
    };

    this.email = {
      label: this.form.getByText("Deine E-Mail"),
      input: this.form.getByRole("textbox", { name: "Deine E-Mail" }),
      error: this.form.locator(`data-test=error-email`),
    };

    this.message = {
      label: this.form.getByText("Deine Nachricht"),
      input: this.form.getByRole("textbox", { name: "Deine Nachricht" }),
      error: this.form.locator(`data-test=error-message`),
    };

    this.submit = this.form.getByRole("button", {
      name: "Senden",
    });

    this.success = this.form.getByRole("alert");

    this.error = this.form.getByRole("alert");
  }

  async contactMioto({
    name,
    email,
    message,
  }: {
    name: string;
    email: string;
    message: string;
  }) {
    await this.name.input.fill(name);
    await this.email.input.fill(email);
    await this.message.input.fill(message);
    await this.submit.click();

    await expect(this.success).toBeVisible();
  }
}
