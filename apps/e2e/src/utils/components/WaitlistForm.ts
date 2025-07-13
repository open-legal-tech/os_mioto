import { type Locator, expect } from "@playwright/test";
import type { EnvironmentModel } from "../environments/Environment";

export class WaitlistForm {
  readonly environment: EnvironmentModel;
  readonly form: Locator;
  readonly label: Locator;
  readonly input: Locator;
  readonly submit: Locator;
  readonly success: Locator;
  readonly error: Locator;

  constructor(environment: EnvironmentModel, nthOnPage = 0) {
    this.environment = environment;

    this.form = environment.page
      .getByRole("form", { name: "waitlist-form" })
      .nth(nthOnPage);
    this.label = this.form.getByText("E-Mail");
    this.input = this.form.getByRole("textbox", { name: "E-Mail" });
    this.submit = this.form.getByRole("button", {
      name: "Beta-Testzugang anfragen",
    });
    this.success = this.form.getByRole("alert");
    this.error = this.form.getByRole("alert");
  }

  async addToWaitlist(email: string) {
    await this.input.fill(email);
    await this.submit.click();

    await expect(this.success).toBeVisible();
  }
}
