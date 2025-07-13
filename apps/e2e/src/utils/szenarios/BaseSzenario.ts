import type { Tree } from "@mioto/prisma";
import {
  EnvironmentModel,
  type EnvironmentModelParams,
} from "../environments/Environment";

type SzenarioData = {
  trees: Record<string, Tree>;
};

export class BaseSzenario<TData extends SzenarioData = any> {
  readonly environment: EnvironmentModel;
  readonly data: TData;

  constructor(
    environment: EnvironmentModel | EnvironmentModelParams,
    data: TData,
  ) {
    this.environment =
      environment instanceof EnvironmentModel
        ? environment
        : new EnvironmentModel(environment);
    this.data = data;
  }

  async cleanup() {
    await this.environment.Employee.cleanup();
    await this.environment.Tree.cleanup();
  }
}
