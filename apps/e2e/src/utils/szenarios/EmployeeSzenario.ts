import type { Tree } from "@mioto/prisma";
import {
  EnvironmentModel,
  type EnvironmentModelParams,
} from "../environments/Environment";
import type { TEmployee } from "../fixtures/Employee";
import { EditorPageModel } from "../pages/EditorPage";
import { ResetPasswordPageModel } from "../pages/ResetPasswordPage";

export type SzenarioData = {
  trees: Record<string, Tree>;
};

export class EmployeeSzenario<TData extends SzenarioData = any> {
  readonly environment: EnvironmentModel;
  readonly employee: TEmployee;
  readonly data: TData;
  isOnTrackedRoute = false;

  constructor(
    environment: EnvironmentModel | EnvironmentModelParams,
    employee: TEmployee,
    data: TData,
  ) {
    this.environment =
      environment instanceof EnvironmentModel
        ? environment
        : new EnvironmentModel(environment);
    this.data = data;

    this.employee = employee;
  }

  async gotoEditor(id: keyof TData["trees"]) {
    if (!id) throw new Error("Please provide a tree id.");

    const EditorPage = new EditorPageModel(this, {
      tree: this.data.trees[id as any] as any,
    });
    this.isOnTrackedRoute = EditorPage.meta.isTracked;

    await EditorPage.goto();

    return EditorPage;
  }

  async gotoResetPassword(token: string) {
    const ResetPasswordPage = new ResetPasswordPageModel(this, {
      token,
    });
    this.isOnTrackedRoute = ResetPasswordPage.meta.isTracked;

    await ResetPasswordPage.goto();

    return ResetPasswordPage;
  }

  async cleanup() {
    await this.environment.Employee.cleanup();
    await this.environment.Tree.cleanup();
  }
}
