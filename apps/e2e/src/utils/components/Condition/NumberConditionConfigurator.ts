import type { numberOperators } from "@mioto/workflow-builder/constants";
import type { Locator } from "@playwright/test";
import type { EnvironmentModel } from "../../environments/Environment";
import { OperatorDropdownModel } from "./OperatorDropdown";

export class NumberConditionConfigurator {
  readonly environment: EnvironmentModel;
  readonly operatorDropdown: OperatorDropdownModel<
    keyof typeof numberOperators
  >;
  readonly comparator: NumberComparatorModel;

  constructor(environment: EnvironmentModel) {
    this.environment = environment;

    this.operatorDropdown = new OperatorDropdownModel(environment);
    this.comparator = new NumberComparatorModel(environment);
  }
}

export class NumberComparatorModel {
  readonly environment: EnvironmentModel;
  readonly locators: {
    input: Locator;
  };

  constructor(environment: EnvironmentModel) {
    this.environment = environment;

    this.locators = {
      input: this.environment.page.getByLabel("Vergleichswert"),
    };
  }

  async fillComparator(value: number) {
    await this.locators.input.fill(value.toString());
  }
}
