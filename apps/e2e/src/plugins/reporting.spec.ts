import { expect } from "@playwright/test";
import { createPluginTest } from "./shared";
import { TreeDashboardPageModel } from "../utils/pages/TreeDashboardPage";
import type { EmployeeSzenario } from "../utils/szenarios/EmployeeSzenario";
import { faker } from "@faker-js/faker";

const pluginTest = createPluginTest({
  versionsDir: "reporting_versions",
  pluginVersion: 6,
});

const createAndOpenTree = async (employeeSzenario: EmployeeSzenario) => {
  const Dashboard = new TreeDashboardPageModel(employeeSzenario);

  return await Dashboard.createProject("Reporting Test");
};

pluginTest({
  name: "should be able to create reporting @mail",
  snapshotId: "admin_email",
  interact: async (Editor) => {
    const Preview = await Editor.Editor.openPreview();
    await expect(
      Preview.environment.page.getByRole("heading", {
        name: "Keine Verbindungen",
      }),
    ).toBeVisible({ timeout: 15000 });
  },
  create: async (employeeSzenario) => {
    const Editor = await createAndOpenTree(employeeSzenario);
    const ReportingBlock = await Editor.Editor.createNode({
      nodeName: "Block 1",
      type: "reporting",
    });

    await ReportingBlock.sidebar.RichTextEditor.fill("Test123"); // emails must have a body
    await ReportingBlock.sidebar.locators.subjectInput.fill("Test123");

    return Editor;
  },
});

pluginTest({
  name: "report by email variable @mail",
  snapshotId: "variable_email",
  async interact(Editor) {
    // Fill Preview
    const Preview = await Editor.Editor.openPreview();
    Preview.environment.page
      .getByRole("textbox", { name: "Emaileingabe" })
      .fill(faker.internet.email());
    Preview.environment.page
      .getByRole("button", { name: "Zum nächsten Schritt" })
      .click();

    await expect(
      Editor.szenario.environment.page.getByRole("heading", {
        name: "Keine Verbindungen",
      }),
    ).toBeVisible({ timeout: 15000 });

    // Expect no future blocks
    await expect(
      Preview.environment.page.getByRole("heading", {
        name: "Keine Verbindungen",
      }),
    ).toBeVisible();
  },
  async create(employeeSzenario) {
    const Editor = await createAndOpenTree(employeeSzenario);
    const FormBlock = await Editor.Editor.createNode({
      nodeName: "Block 1",
      type: "form",
    });

    await FormBlock.sidebar.addInput("email", "Emaileingabe");
    const ReportingBlock = await FormBlock.canvasNode.createNewNodeFromPort({
      currentNodeName: "Block 1",
      newNodeName: "Block 2",
      type: "reporting",
      select: true,
    });

    await ReportingBlock.sidebar.RichTextEditor.fill("Test123");
    await ReportingBlock.environment.page
      .getByRole("combobox", { name: "Sende an" })
      .click();
    await ReportingBlock.environment.page
      .getByRole("option", { name: "E-Mail von Variable" })
      .click();
    await ReportingBlock.sidebar.locators.subjectInput.fill("Test123");

    return Editor;
  },
});

pluginTest({
  name: "manually enter reporting email @mail",
  snapshotId: "custom_email",
  async create(employeeSzenario) {
    const Editor = await createAndOpenTree(employeeSzenario);
    const ReportingBlock = await Editor.Editor.createNode({
      nodeName: "Block 1",
      type: "reporting",
      select: true,
    });

    await ReportingBlock.sidebar.RichTextEditor.fill("Test123");
    await ReportingBlock.sidebar.locators.subjectInput.fill("Test123");
    await ReportingBlock.environment.page
      .getByRole("combobox", { name: "Sende an" })
      .click();
    await ReportingBlock.environment.page
      .getByRole("option", { name: "Benutzerdefinierte E-Mail" })
      .click();
    await ReportingBlock.environment.page
      .getByPlaceholder("E-Mail eingeben")
      .fill(faker.internet.email());

    return Editor;
  },
  async interact(Editor) {
    const Preview = await Editor.Editor.openPreview();
    await expect(
      Preview.environment.page.getByRole("heading", {
        name: "Keine Verbindungen",
      }),
    ).toBeVisible({ timeout: 15000 });
  },
});
