import type { Tree } from "@mioto/prisma";
import {
  EnvironmentModel,
  type EnvironmentModelParams,
} from "../environments/Environment";
import type { TCustomer } from "../fixtures/Customer";

type SzenarioData = {
  trees: Record<string, Tree>;
};

export class CustomerSzenario<TData extends SzenarioData = any> {
  readonly environment: EnvironmentModel;
  readonly data: TData;
  readonly customer: TCustomer;
  isOnTrackedRoute = false;

  constructor(
    environment: EnvironmentModelParams | EnvironmentModel,
    customer: TCustomer,
    data: TData,
  ) {
    this.environment =
      environment instanceof EnvironmentModel
        ? environment
        : new EnvironmentModel(environment);
    this.data = data;
    this.customer = customer;
  }

  async cleanup() {
    await this.environment.Employee.cleanup();
    await this.environment.Tree.cleanup();
  }
}
