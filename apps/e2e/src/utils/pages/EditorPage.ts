import type { Prisma } from "@mioto/prisma";
import { EditorComponent } from "../components/Editor";
import { EditorHeaderComponent } from "../components/EditorHeaderComponent";
import type { EmployeeSzenario } from "../szenarios/EmployeeSzenario";

export type EditorPageContstructorParams = {
  tree: Prisma.Tree;
};

export class EditorPageModel {
  readonly szenario: EmployeeSzenario;
  get meta() {
    return {
      isAuthenticated: true,
      isTracked: true,
      url: `/org/${this.szenario.employee.organization.slug}/builder/${this.tree.uuid}`,
    };
  }
  readonly tree: Prisma.Tree;

  get Header() {
    return new EditorHeaderComponent(this.szenario, this.tree.name);
  }

  get Editor() {
    return new EditorComponent(this.szenario.environment);
  }

  constructor(
    szenario: EmployeeSzenario,
    { tree }: EditorPageContstructorParams,
  ) {
    this.szenario = szenario;
    this.tree = tree;
  }

  async goto() {
    await this.szenario.environment.page.goto(this.meta.url);
  }
}
