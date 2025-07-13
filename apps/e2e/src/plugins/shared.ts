import path from "path";
import { fileURLToPath } from "url";
import fs from "fs-extra";
import { EditorPageModel } from "../utils/pages/EditorPage";
import { TreeDashboardPageModel } from "../utils/pages/TreeDashboardPage";
import type { EmployeeSzenario } from "../utils/szenarios/EmployeeSzenario";
import { test } from "../utils/pwTest";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const importProjects = (
  versionDir: string,
  snapshotId: string,
  pluginVersion: number,
) => {
  const resolvedVersionDir = path.resolve(
    __dirname,
    `${versionDir}/${snapshotId}`,
  );

  try {
    const files = fs.readdirSync(resolvedVersionDir);

    return files
      .filter((value) => value !== `${pluginVersion}.json`)
      .map(
        (file) =>
          [
            `Version ${file.split(".json")[0] as string} of ${snapshotId}`,
            async (szenario: EmployeeSzenario) => {
              const filePath = path.join(resolvedVersionDir, file);

              const Dashboard = new TreeDashboardPageModel(szenario);

              await Dashboard.importProject(filePath);
              const Editor = new EditorPageModel(Dashboard.szenario, {
                tree: {},
              } as any);

              return Editor;
            },
          ] as const,
      );
  } catch (e) {
    return [];
  }
};

export function createPluginTest({
  versionsDir,
  pluginVersion,
}: {
  versionsDir: string;
  pluginVersion: number;
}) {
  return ({
    snapshotId,
    interact,
    name,
    create,
  }: {
    snapshotId: string;
    interact: (Editor: EditorPageModel, isImport: boolean) => Promise<void>;
    create: (employeeSzenario: EmployeeSzenario) => Promise<EditorPageModel>;
    name: string;
  }) => {
    test.describe(name, () => {
      test("current version", async ({ employeeSzenario }) => {
        const Editor = await create(employeeSzenario);

        await interact(Editor, false);

        const filePath = path.resolve(
          __dirname,
          `${versionsDir}/${snapshotId}/${pluginVersion}.json`,
        );

        await Editor.Header.projectMenuDropdown.export(filePath);
      });
      const imported = importProjects(versionsDir, snapshotId, pluginVersion);

      for (const [file, createEditorFn] of imported) {
        test(file, async ({ employeeSzenario }) => {
          const Editor = await createEditorFn(employeeSzenario);
          await interact(Editor, true);
        });
      }
    });
  };
}
