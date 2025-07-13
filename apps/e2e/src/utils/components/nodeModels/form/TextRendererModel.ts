import type { EnvironmentModel } from "../../../environments/Environment";

export class TextRendererModel {
  readonly environment: EnvironmentModel;
  constructor(environment: EnvironmentModel) {
    this.environment = environment;
  }

  getAnswerLocator(label: string) {
    return this.environment.page.getByRole("textbox", { name: label });
  }

  async fillAnswer(label: string, content: string) {
    await this.getAnswerLocator(label).fill(content);
  }
}
