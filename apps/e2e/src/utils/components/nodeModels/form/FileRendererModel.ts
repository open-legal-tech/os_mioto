import type { EnvironmentModel } from "../../../environments/Environment";

export class FileRendererModel {
  readonly environment: EnvironmentModel;
  constructor(environment: EnvironmentModel) {
    this.environment = environment;
  }

  getAnswerLocator(label: string) {
    return this.environment.page.getByLabel(label);
  }

  async addFile(label: string, filePath: string) {
    await this.getAnswerLocator(label).setInputFiles(filePath);
  }
}
