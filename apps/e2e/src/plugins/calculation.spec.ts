import { expect } from "@playwright/test";
import { createPluginTest } from "./shared";
import { TreeDashboardPageModel } from "../utils/pages/TreeDashboardPage";
import type { EmployeeSzenario } from "../utils/szenarios/EmployeeSzenario";
import { test } from "../utils/pwTest";

const createAndOpenTree = async (employeeSzenario: EmployeeSzenario) => {
  const Dashboard = new TreeDashboardPageModel(employeeSzenario);

  await Dashboard.goto();

  return await Dashboard.createProject("Calculation Test");
};

const pluginTest = createPluginTest({
  pluginVersion: 3,
  versionsDir: "calculation_versions",
});

pluginTest({
  name: "should be able to create calculation",
  snapshotId: "calculation",
  interact: async (Editor) => {
    const Preview = await Editor.Editor.openPreview();
    await expect(
      Preview.environment.page.getByText("Berechnungsergebnis: 2"),
    ).toBeVisible();
  },
  async create(employeeSzenario) {
    const Editor = await createAndOpenTree(employeeSzenario);
    const CalculationBlock = await Editor.Editor.createNode({
      nodeName: "Block 1",
      type: "calculation",
    });

    await CalculationBlock.sidebar.RichNumberEditor.fill("1 + 1");

    const InfoNode = await CalculationBlock.canvasNode.createNewNodeFromPort({
      currentNodeName: "Block 1",
      newNodeName: "Block 2",
      type: "info",
      select: true,
    });

    await InfoNode.sidebar.RichTextEditor.fill("Berechnungsergebnis:");
    const VariableDropdown =
      await InfoNode.sidebar.RichTextEditor.openVariableSubMenu();
    await VariableDropdown.selectVariable("Berechnung");

    return Editor;
  },
});

test("missing calculation should show error", async ({ employeeSzenario }) => {
  const Editor = await createAndOpenTree(employeeSzenario);

  const CalculationBlock = await Editor.Editor.createNode({
    nodeName: "Block 1",
    type: "calculation",
  });

  const InfoNode = await CalculationBlock.canvasNode.createNewNodeFromPort({
    currentNodeName: "Block 1",
    newNodeName: "Block 2",
    type: "info",
    select: true,
  });

  await InfoNode.sidebar.RichTextEditor.fill("Berechnungsergebnis:");
  const VariableDropdown =
    await InfoNode.sidebar.RichTextEditor.openVariableSubMenu();
  await VariableDropdown.selectVariable("Berechnung");

  const Preview = await Editor.Editor.openPreview();

  await expect(
    Preview.environment.page.getByText("Fehlende Formel"),
  ).toBeVisible();
});

test("invalid calculation should show error", async ({ employeeSzenario }) => {
  const Editor = await createAndOpenTree(employeeSzenario);

  const CalculationBlock = await Editor.Editor.createNode({
    nodeName: "Block 1",
    type: "calculation",
  });

  await CalculationBlock.sidebar.RichNumberEditor.fill("0/0");

  const InfoNode = await CalculationBlock.canvasNode.createNewNodeFromPort({
    currentNodeName: "Block 1",
    newNodeName: "Block 2",
    type: "info",
    select: true,
  });

  await InfoNode.sidebar.RichTextEditor.fill("Berechnungsergebnis:");
  const VariableDropdown =
    await InfoNode.sidebar.RichTextEditor.openVariableSubMenu();
  await VariableDropdown.selectVariable("Berechnung");

  const Preview = await Editor.Editor.openPreview();

  await expect(
    Preview.environment.page.getByText("Ungültige Formel"),
  ).toBeVisible();
});
