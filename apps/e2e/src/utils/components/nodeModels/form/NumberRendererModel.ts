import type { Locator } from "@playwright/test";
import type { EnvironmentModel } from "../../../environments/Environment";

export class NumberRendererModel {
  readonly environment: EnvironmentModel;
  readonly input: (label: string) => Locator;

  constructor(environment: EnvironmentModel) {
    this.environment = environment;

    this.input = (label: string) => this.environment.page.getByLabel(label);
  }

  async fillAnswer(label: string, answer: number) {
    const input = this.input(label);

    await input.fill(answer.toString());
  }
}
