import type { Locator } from "@playwright/test";
import type { EnvironmentModel } from "../environments/Environment";
import { VariableDropdownModel } from "./VariableDropdownModel";

export class RichNumberEditorModel {
  readonly environment: EnvironmentModel;
  readonly locators: {
    editor: Locator;
    label: Locator;
  };

  constructor(environment: EnvironmentModel) {
    this.environment = environment;

    this.locators = {
      editor: environment.page.locator(`[data-test=richTextEditor] div`),
      label: environment.page.locator(`label >> text=Formel`),
    };
  }

  async fill(text: string) {
    await this.locators.label.click();
    await this.environment.page.waitForTimeout(100);
    await this.environment.page.keyboard.type(text);
  }

  async openVariableDropdown() {
    await this.locators.editor.focus();
    await this.environment.page.keyboard.type("@");

    return new VariableDropdownModel(this.environment, "Variable auswählen");
  }
}
