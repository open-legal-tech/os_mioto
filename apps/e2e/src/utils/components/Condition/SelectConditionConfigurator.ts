import type { selectOperators } from "@mioto/workflow-builder/constants";
import type { Locator } from "@playwright/test";
import type { EnvironmentModel } from "../../environments/Environment";
import { OperatorDropdownModel } from "./OperatorDropdown";

export class SelectConditionConfigurator {
  readonly environment: EnvironmentModel;
  readonly operatorDropdown: OperatorDropdownModel<
    keyof typeof selectOperators
  >;
  readonly comparator: SelectComparatorModel;

  constructor(environment: EnvironmentModel) {
    this.environment = environment;

    this.operatorDropdown = new OperatorDropdownModel(environment);
    this.comparator = new SelectComparatorModel(environment);
  }
}

export class SelectComparatorModel {
  readonly environment: EnvironmentModel;
  readonly locators: {
    input: Locator;
  };

  constructor(environment: EnvironmentModel) {
    this.environment = environment;

    this.locators = {
      input: this.environment.page.getByRole("textbox", {
        name: "Vergleichswert",
      }),
    };
  }
}
