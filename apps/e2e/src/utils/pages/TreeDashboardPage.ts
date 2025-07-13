import de from "@mioto/locale/de" with { type: "json" };
import { testPrisma } from "@mioto/server/db/testPrisma";
import { CreateProjectDialogComponent } from "../components/CreateProjectDialogComponent";
import { HeaderComponent } from "../components/HeaderComponent";
import { LegalNotifications } from "../components/LegalNotification";
import { ProjectMenuComponent } from "../components/ProjectMenuComponent";
import type {
  EmployeeSzenario,
  SzenarioData,
} from "../szenarios/EmployeeSzenario";
import { EditorPageModel } from "./EditorPage";

export class TreeDashboardPageModel<TData extends SzenarioData> {
  readonly szenario: EmployeeSzenario<TData>;
  get meta() {
    return {
      isAuthenticated: true,
      isTracked: true,
      url: `/org/${this.szenario.employee.organization.slug}/dashboard`,
    };
  }

  get locators() {
    return {
      sortButton: this.szenario.environment.page.locator(`text=Sortieren`),
      createProjectDropdown: this.szenario.environment.page.getByRole(
        "button",
        {
          name: "Anwendung erstellen",
          exact: true,
        },
      ),
      searchInput: this.szenario.environment.page.getByRole("textbox", {
        name: "Anwendungsname",
      }),
    };
  }

  ProjectCard(title: string) {
    return {
      container: this.szenario.environment.page.locator(`h3 >> text=${title}`),
      link: this.szenario.environment.page.getByRole("link", {
        name: `Anwendung ${title}`,
      }),
      menu: new ProjectMenuComponent(this.szenario.environment, title),
    };
  }

  get CreateProjectDialog() {
    return new CreateProjectDialogComponent(this.szenario);
  }

  get Header() {
    return new HeaderComponent(this.szenario);
  }

  get LegalNotification() {
    return LegalNotifications(this.szenario.environment);
  }

  constructor(szenario: EmployeeSzenario<TData>) {
    this.szenario = szenario;
  }

  async goto() {
    await this.szenario.environment.page.goto(this.meta.url);
  }

  async openCreateProjectDropdown() {
    await this.locators.createProjectDropdown.click();
  }

  async closeCreateProjectDropdown() {
    await this.szenario.environment.page.locator("css=html").click();
  }

  async openCreateProjectDialog() {
    await this.openCreateProjectDropdown();
    await this.szenario.environment.page
      .locator(`text=${de.app.dashboard["new-project"]["create-new"].title}`)
      .click();
  }

  /**
   * Creates a new project and redirects the user to the editor page of that project.
   * @param title - The title for the new project.
   */
  async createProject(title: string) {
    this.openCreateProjectDialog();

    return await this.CreateProjectDialog.createProject(title);
  }

  async openImportProjectDialog() {
    await this.openCreateProjectDropdown();
    await this.szenario.environment.page
      .locator(`text=${de.app.dashboard["new-project"].import.label}`)
      .click();
  }

  async importProject(filePath: string) {
    const [fileChooser] = await Promise.all([
      this.szenario.environment.page.waitForEvent("filechooser"),
      this.openImportProjectDialog(),
    ]);

    await fileChooser.setFiles(filePath);
  }

  async sortByCreationDateAscending() {
    await this.locators.sortButton.click();
    await this.szenario.environment.page
      .locator(`role=menuitemcheckbox >> text=Aufsteigend`)
      .click();
  }

  async sortByCreationDateDescending() {
    await this.locators.sortButton.click();
    await this.szenario.environment.page
      .locator(`role=menuitemcheckbox >> text=Erstellungsdatum`)
      .click();
    await this.locators.sortButton.click();
    await this.szenario.environment.page
      .locator(`role=menuitemcheckbox >> text=Absteigend`)
      .click();
  }

  async sortByLastEditedAscending() {
    await this.locators.sortButton.click();
    await this.szenario.environment.page
      .locator(`role=menuitemcheckbox >> text=Zuletzt bearbeitet`)
      .click();
    await this.locators.sortButton.click();
    await this.szenario.environment.page
      .locator(`role=menuitemcheckbox >> text=Aufsteigend`)
      .click();
  }

  async sortByLastEditedDescending() {
    await this.locators.sortButton.click();
    await this.szenario.environment.page
      .locator(`role=menuitemcheckbox >> text=Zuletzt bearbeitet`)
      .click();
    await this.locators.sortButton.click();
    await this.szenario.environment.page
      .locator(`role=menuitemcheckbox >> text=Absteigend`)
      .click();
  }

  async openProject(title: string) {
    await this.ProjectCard(title).link.click();

    const tree = await testPrisma.tree.findFirst({
      where: {
        name: title,
        organizationUuid: this.szenario.employee.organization.uuid,
      },
    });

    if (!tree) throw new Error("Tree does not exist in database.");

    return new EditorPageModel(this.szenario, { tree });
  }

  async search(searchTerm: string) {
    await this.locators.searchInput.fill(searchTerm);
  }
}
