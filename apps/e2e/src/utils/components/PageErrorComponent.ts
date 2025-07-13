import type { Locator } from "@playwright/test";
import type { EnvironmentModel } from "../environments/Environment";

export class PageErrorComponent {
  readonly environment: EnvironmentModel;
  readonly locators: {
    title: (text: string) => Locator;
    description: (text: string) => Locator;
  };

  constructor(environment: EnvironmentModel) {
    this.environment = environment;

    this.locators = {
      title: (text: string) =>
        this.environment.page.getByRole("heading", { name: text }),
      description: (text: string) => this.environment.page.getByText(text),
    };
  }
}
