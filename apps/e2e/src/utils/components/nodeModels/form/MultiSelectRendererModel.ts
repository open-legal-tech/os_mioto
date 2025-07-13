import type { EnvironmentModel } from "../../../environments/Environment";

export class MultiSelectRendererModel {
  readonly environment: EnvironmentModel;
  constructor(environment: EnvironmentModel) {
    this.environment = environment;
  }

  getAnswerLocator(text: string) {
    return this.environment.page.getByRole("checkbox", { name: text });
  }

  async selectAnswers(answerTexts: string[]) {
    for (const answer of answerTexts) {
      await this.getAnswerLocator(answer).click();
    }
  }
}
