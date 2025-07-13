import de from "@mioto/locale/de" with { type: "json" };
import { testPrisma } from "@mioto/server/db/testPrisma";
import type { Locator } from "@playwright/test";
import { EditorPageModel } from "../pages/EditorPage";
import type { EmployeeSzenario } from "../szenarios/EmployeeSzenario";

export class CreateProjectDialogComponent {
  readonly szenario: EmployeeSzenario;
  readonly nameInput: Locator;
  readonly submitButton: Locator;
  readonly title: Locator;
  readonly dialog: Locator;
  readonly error: Locator;

  constructor(szenario: EmployeeSzenario) {
    this.szenario = szenario;

    this.nameInput = this.szenario.environment.page.locator(
      `[role=dialog] >> label >> text=${de.components["tree-name-input"].label}`,
    );
    this.submitButton = this.szenario.environment.page.locator(
      `[role=dialog] >> button >> text=Erstellen`,
    );
    this.title = this.szenario.environment.page.locator(
      `[role=dialog] >> text=${de.app.dashboard["new-project"]["create-new"].title}`,
    );
    this.dialog = this.szenario.environment.page.locator(`[role="dialog"]`);
    this.error = this.szenario.environment.page.locator(
      "data-test=error-treeName",
    );
  }

  async createProject(name: string) {
    await this.nameInput.fill(name);

    await Promise.all([
      this.szenario.environment.page.waitForURL("**/builder/**"),
      this.submitButton.click(),
    ]);

    const [_, treeUuid] = this.szenario.environment.page
      .url()
      .split("builder/");

    const tree = await testPrisma.tree.findUnique({
      where: { uuid: treeUuid },
    });

    if (!tree) {
      throw new Error(
        "Tree not found in database. Creation might not working.",
      );
    }

    return new EditorPageModel(this.szenario, { tree });
  }
}
