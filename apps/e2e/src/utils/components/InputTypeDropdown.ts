import type { Locator } from "@playwright/test";
import type { EnvironmentModel } from "../environments/Environment";

export class InputTypeDropdownComponent {
  readonly environment: EnvironmentModel;
  readonly locators: {
    button: Locator;
    menu: Locator;
    item: (title: string, nth?: number) => Locator;
  };

  constructor(environment: EnvironmentModel) {
    this.environment = environment;

    const menu = this.environment.page.getByRole("menu", {
      name: "Eingabetyp auswählen",
    });

    this.locators = {
      button: this.environment.page.getByRole("button", {
        name: "Eingabetyp auswählen",
      }),
      menu,
      item: (title, nth = 0) =>
        menu.getByRole("menuitem", { name: title }).nth(nth),
    };
  }

  async selectOption(option: string) {
    await this.locators.button.click();
    await this.locators.item(option).click();
  }
}
