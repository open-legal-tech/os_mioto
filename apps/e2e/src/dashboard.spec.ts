import { dirname } from "path";
import { fileURLToPath } from "url";
import { expect } from "@playwright/test";
import { test } from "./utils/pwTest";
import { TreeDashboardPageModel } from "./utils/pages/TreeDashboardPage";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test("should allow creating and opening trees", async ({
  employeeSzenario,
}) => {
  const newTreeName = "Mein Testprojekt";
  const Dashboard = new TreeDashboardPageModel(employeeSzenario);
  await Dashboard.goto();

  await Dashboard.openCreateProjectDialog();

  await Dashboard.CreateProjectDialog.submitButton.click();
  await expect(Dashboard.CreateProjectDialog.error).toBeVisible();

  const Editor = await Dashboard.CreateProjectDialog.createProject(newTreeName);
  await Editor.Header.goHome();

  await expect(Dashboard.ProjectCard(newTreeName).container).toBeVisible();
});

test("should import an existing project", async ({ employeeSzenario }) => {
  const Dashboard = new TreeDashboardPageModel(employeeSzenario);

  await Promise.all([
    employeeSzenario.environment.page.waitForURL(/.*builder/),
    Dashboard.importProject(`${__dirname}/dashboard.assets/tree.json`),
  ]);

  await expect(employeeSzenario.environment.page).toHaveURL(/.*builder/, {
    timeout: 10000,
  });
});

test("should allow to change name of a tree", async ({ employeeSzenario }) => {
  const newTreeName = "Mein Testprojekt";
  const Dashboard = new TreeDashboardPageModel(employeeSzenario);

  await Dashboard.openCreateProjectDialog();
  await Dashboard.CreateProjectDialog.nameInput.fill(newTreeName);
  await Promise.all([
    employeeSzenario.environment.page.waitForURL(/.*builder/),
    Dashboard.CreateProjectDialog.submitButton.click(),
  ]);

  await Dashboard.goto();

  const projectMenu = Dashboard.ProjectCard(newTreeName).menu;

  const changedTreeName = "Mein umbennantes Projekt";
  await projectMenu.changeName(changedTreeName);

  await expect(Dashboard.ProjectCard(changedTreeName).container).toBeVisible();

  await expect(Dashboard.ProjectCard(newTreeName).container).toBeHidden();
});

test("should allow deleting of a tree", async ({ employeeSzenario }) => {
  const newTreeName = "Mein Testprojekt";
  const Dashboard = new TreeDashboardPageModel(employeeSzenario);
  await Dashboard.goto();

  await Dashboard.openCreateProjectDialog();
  await Dashboard.CreateProjectDialog.nameInput.fill(newTreeName);
  await Dashboard.CreateProjectDialog.submitButton.click();

  const ProjectMenu = Dashboard.ProjectCard(newTreeName).menu;

  await ProjectMenu.delete();

  await expect(Dashboard.ProjectCard(newTreeName).container).toBeHidden();
});

test("should allow creating a version", async ({ mixedTreesSzenario }) => {
  const Dashboard = new TreeDashboardPageModel(mixedTreesSzenario);
  await Dashboard.goto();

  const ProjectMenu = Dashboard.ProjectCard(
    mixedTreesSzenario.data.trees.publicTree.name,
  ).menu;
  await ProjectMenu.createVersion();

  await expect(
    mixedTreesSzenario.environment.Notification("Version wurde erstellt")
      .locators.title,
  ).toBeVisible();
});

test("should filter trees based on search query", async ({
  mixedTreesSzenario,
}) => {
  const Dashboard = new TreeDashboardPageModel(mixedTreesSzenario);
  await Dashboard.goto();

  await Dashboard.search("Public");

  await expect(
    Dashboard.ProjectCard(mixedTreesSzenario.data.trees.privateTree.name)
      .container,
  ).toBeHidden();

  await expect(
    Dashboard.ProjectCard(mixedTreesSzenario.data.trees.publicTree.name)
      .container,
  ).toBeVisible();
});

// pwTest(
//   "should sort ascending or descending based on selection",
//   async ({ mixedTreesSzenario }) => {
//     const Dashboard = new TreeDashboardPageModel(mixedTreesSzenario);
//     await Dashboard.goto();

//     await Dashboard.sortByCreationDateDescending();

//     await expect(
//       Dashboard.szenario.environment.page.locator("h2").nth(0),
//     ).toContainText("Public Tree");

//     await Dashboard.sortByCreationDateAscending();

//     await expect(
//       Dashboard.szenario.environment.page.locator("h2").nth(0),
//     ).toContainText("Private Tree");

//     await Dashboard.sortByLastEditedDescending();

//     await expect(Dashboard.szenario.environment.page.locator("h2").nth(0)).toContainText(
//       "This is an active and empty tree",
//     );

//     await dashboardPage.sortByLastEditedAscending();

//     await expect(dashboardPage.page.locator("h2").nth(0)).toContainText(
//       "This is an active and published tree",
//     );
//   },
// );

// TODO: Currently we do not autoFix on import which makes this test obsolete. We should fix this missing behavior.
// pwTest("should not import a broken project", async ({ employeeSzenario }) => {
//   const dashboardPage = await longTimeUser.goto("dashboard");
//   await dashboardPage.importProject("./fixtures/brokenTreeon");

//   await dashboardPage.closeCreateProjectDropdown();

//   await expect(
//     dashboardPage.notification.getLocator(
//       de.common.errors.import_invalid_file.short,
//     ),
//   ).toBeVisible();
// });
