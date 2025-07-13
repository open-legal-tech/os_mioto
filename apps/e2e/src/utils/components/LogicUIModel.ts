import type { Locator } from "@playwright/test";
import type { EnvironmentModel } from "../environments/Environment";
import { ConditionCardModel } from "./Condition/ConditionCardModel";
import { TargetSelectorDropdown } from "./TargetSelectorDropdown";
import type { Nodes } from "./nodeModels/Nodes";

export class LogicUIModel {
  readonly environment: EnvironmentModel;
  readonly locators: {
    connectionList: Locator;
    addConditionButton: Locator;
    fallbackTargetSelector: Locator;
  };

  constructor(environment: EnvironmentModel) {
    this.environment = environment;

    const connectionList = this.environment.page.getByRole("list", {
      name: "Verbindungen",
    });

    this.locators = {
      connectionList,
      addConditionButton: this.environment.page.getByRole("button", {
        name: "Verbindung hinzufügen",
      }),
      fallbackTargetSelector: this.environment.page.getByRole("button", {
        name: "Zielblock auswählen",
      }),
    };
  }

  async addCondition(target: string, type: keyof Nodes) {
    await this.locators.addConditionButton.click();
    await this.environment.page.keyboard.type(target);

    const TargetSelector = new TargetSelectorDropdown(this.environment);
    await TargetSelector.createItem(target, type);

    return this.getCondition(target);
  }

  async getCondition(title: string) {
    return new ConditionCardModel(this.environment, { title });
  }
}
