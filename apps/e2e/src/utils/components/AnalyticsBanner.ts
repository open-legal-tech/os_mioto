import type { Locator } from "@playwright/test";
import type { EnvironmentModel } from "../environments/Environment";

export class AnalyticsBanner {
  readonly environment: EnvironmentModel;
  readonly title: Locator;
  readonly confirmButton: Locator;
  readonly denyButton: Locator;

  constructor(environment: EnvironmentModel) {
    this.environment = environment;

    this.title = environment.page.getByText("Magst du uns helfen?");
    this.confirmButton = environment.page.getByRole("button", {
      name: "Zustimmen",
    });
    this.denyButton = environment.page.getByRole("button", {
      name: "Ablehnen",
    });
  }

  async accept() {
    await this.confirmButton.click();
  }

  async deny() {
    // This is necessary to allow posthog to finish the tracking of the deny click
    const trackDenialPromise = this.environment.page.waitForResponse(
      "https://eu.posthog.com/e/?compression**",
    );
    await this.denyButton.click();

    await await Promise.race([
      new Promise((resolve) => {
        setTimeout(resolve, 5000);
      }),
      trackDenialPromise,
    ]);
  }
}
