import type { Locator } from "@playwright/test";
import type { EnvironmentModel } from "../environments/Environment";

export class Attachements {
  readonly environment: EnvironmentModel;
  readonly locators: {
    input: Locator;
    item: (name: string) => Locator;
  };

  constructor(environment: EnvironmentModel) {
    this.environment = environment;

    const menuContainer = this.environment.page.getByRole("listbox", {
      name: "Anhangauswahlliste",
    });

    this.locators = {
      input: this.environment.page.locator("label", { hasText: /^Anhänge$/ }),
      item: (name) => menuContainer.getByRole("option", { name }),
    };
  }
}
