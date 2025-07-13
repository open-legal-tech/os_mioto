import type { Locator } from "@playwright/test";
import type { EnvironmentModel } from "../environments/Environment";

export class VariableDropdownModel {
  readonly environment: EnvironmentModel;
  readonly locators: {
    button: Locator;
    menu: Locator;
    menuItem: (text: string) => Locator;
  };

  constructor(environment: EnvironmentModel, name: string) {
    this.environment = environment;

    const menu = this.environment.page.getByRole("listbox", { name });

    this.locators = {
      button: this.environment.page.getByRole("button", { name }),
      menu,
      menuItem: (text: string) => menu.getByRole("option", { name: text }),
    };
  }

  async open() {
    await this.locators.button.click();
  }

  async selectVariable(text: string) {
    await this.locators.menuItem(text).click();
  }
}
