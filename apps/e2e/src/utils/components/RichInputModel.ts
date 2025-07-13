import { expect } from "@playwright/test";
import type { EnvironmentModel } from "../environments/Environment";
import { VariableDropdownModel } from "./VariableDropdownModel";

export class RichInputModel {
  readonly environment: EnvironmentModel;
  readonly label: string;

  get locators() {
    const slashMenuContainer = this.environment.page.getByRole("listbox", {
      name: "Rich Text Editor Menü",
    });
    return {
      editor: this.environment.page.getByRole("textbox", { name: "" }),
      label: this.environment.page.getByText(this.label),
      slashMenu: {
        container: slashMenuContainer,
        options: {
          variable: slashMenuContainer.getByRole("option", {
            name: "Variable",
          }),
        },
      },
    };
  }

  constructor({
    environment,
    label,
  }: { environment: EnvironmentModel; label: string }) {
    this.environment = environment;
    this.label = label;
  }

  async focus() {
    await this.locators.label.click();
    await this.environment.page.waitForTimeout(100);
  }

  async fill(text: string) {
    await this.focus();
    await this.environment.page.keyboard.type(text);
  }

  async openMenu() {
    await this.focus();
    await this.environment.page.keyboard.type(" /");
    await expect(this.locators.slashMenu.container).toBeVisible();
  }

  async selectMenuOption(option: keyof typeof this.locators.slashMenu.options) {
    await this.openMenu();
    await this.locators.slashMenu.options[option].click();
  }

  async openVariableSubMenu() {
    await this.selectMenuOption("variable");

    return new VariableDropdownModel(this.environment, "Rich Text Editor Menü");
  }
}
