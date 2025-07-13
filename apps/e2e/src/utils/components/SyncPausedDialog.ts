import type { Locator } from "@playwright/test";
import type { EnvironmentModel } from "../environments/Environment";

export class SyncPausedInfoComponent {
  readonly environment: EnvironmentModel;
  readonly title: Locator;
  readonly restartButton: Locator;

  constructor(environment: EnvironmentModel) {
    this.environment = environment;

    this.title = this.environment.page.locator(
      `text=Die Verbindung zum Server wurde pausiert.`,
    );

    this.restartButton = this.environment.page.getByRole("button", {
      name: "Neu verbinden",
    });
  }

  async restart() {
    await this.restartButton.click();
  }
}
