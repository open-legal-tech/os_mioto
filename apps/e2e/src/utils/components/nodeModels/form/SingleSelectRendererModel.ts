import type { EnvironmentModel } from "../../../environments/Environment";

export class SingleSelectRendererModel {
  readonly environment: EnvironmentModel;
  constructor(environment: EnvironmentModel) {
    this.environment = environment;
  }

  getAnswerLocator(text: string) {
    return this.environment.page.locator(`label >> text=${text}`);
  }

  async selectAnswer(text: string) {
    await this.getAnswerLocator(text).click();
  }
}
