// NOT YET READY

// import de from "@mioto/locale/de" with { type: "json" }; ;
// import { TreeDashboardPageModel } from "@mioto/test-utils/pages/TreeDashboardPage";
// import { EmployeeSzenario } from "@mioto/test-utils/szenarios/EmployeeSzenario";
// import { pwTest } from "@mioto/test-utils/utils/pwTest";
// import { expect } from "@playwright/test";
// import fs from "fs";
// import path from "path";
// import { EditorPageModel } from "@mioto/test-utils/pages/EditorPage";

// const createAndOpenTree = async (employeeSzenario: EmployeeSzenario) => {
//   const Dashboard = new TreeDashboardPageModel(employeeSzenario);

//   await Dashboard.goto();

//   return await Dashboard.createProject("Form Test");
// };

// pwTest(
//   "should be able to create a form block",
//   async ({ employeeSzenario }) => {
//     const Editor = await createAndOpenTree(employeeSzenario);
//     const FormBlock = await Editor.Editor.createNode({
//       nodeName: "Block 1",
//       type: "form",
//     });

//     const FileInput = await FormBlock.sidebar.addInput("file", "Dateiupload");
//     await FileInput.selectAcceptedFileTypes(["pdf"]);

//     const InfoNode = await FormBlock.canvasNode.createNewNodeFromPort({
//       currentNodeName: "Block 1",
//       newNodeName: "Block 2",
//       type: "info",
//       select: true,
//     });

//     const VariableDropdown =
//       await InfoNode.sidebar.RichTextEditor.openPdfPreviewSubMenu();
//     await VariableDropdown.selectVariable("Dateiupload");

//     const Preview = await Editor.Editor.openPreview();

//     await Preview.Nodes.form.File.addFile(
//       "Datei hochladen",
//       "./Kaufvertrag.pdf",
//     );

//     await Preview.next();

//     await expect(
//       Preview.environment.page.getByText("Berechnungsergebnis: 2"),
//     ).toBeVisible();

//     await Editor.Header.projectMenuDropdown.export({ id: "1" });
//   },
// );

// pwTest("should import all previous versions", async ({ employeeSzenario }) => {
//   const Dashboard = new TreeDashboardPageModel(employeeSzenario);
//   await Dashboard.goto();

//   const snapshotDir = pwTest.info().snapshotDir;
//   const files = fs.readdirSync(snapshotDir);

//   for (const file of files) {
//     const filePath = path.join(snapshotDir, file);

//     await Dashboard.importProject(filePath);
//     const Editor = new EditorPageModel(employeeSzenario, {
//       tree: {},
//     } as any);

//     await expect(Editor.Editor.createNodeButton).toBeVisible();
//   }
// });
