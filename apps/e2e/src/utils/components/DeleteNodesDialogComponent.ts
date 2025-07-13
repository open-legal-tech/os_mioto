import type { Locator } from "@playwright/test";
import type { EnvironmentModel } from "../environments/Environment";

export class DeleteNodesDialogComponent {
  readonly environment: EnvironmentModel;
  readonly submitButton: Locator;
  readonly title: Locator;
  readonly dialog: Locator;
  readonly error: Locator;

  constructor(environment: EnvironmentModel) {
    this.environment = environment;

    this.submitButton = this.environment.page.locator(
      `[role=dialog] >> button >> text=Löschen`,
    );

    this.title = this.environment.page.locator(
      `[role=dialog] >> text=Bist du sicher, dass du die Blöcke löschen willst?`,
    );
    this.dialog = this.environment.page.locator(`[role="dialog"]`);
    this.error = this.environment.page.locator("data-test=error-treeName");
  }

  async confirm() {
    await this.submitButton.click();
  }
}
