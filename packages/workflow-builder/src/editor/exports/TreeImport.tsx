import type { FileInputProps } from "@mioto/design-system/FileInput";
import { FileReaderInput } from "@mioto/design-system/FileReaderInput";
import { Notification } from "@mioto/design-system/Notification";
import { useTranslations } from "@mioto/locale";
import * as React from "react";
import { importTreeAction } from "../../db/exports/importTree.action";
import { ZTreeImport } from "../../db/utils/utils";

export const TreeImport = React.forwardRef<
  HTMLInputElement,
  FileInputProps & {
    onDone?: () => void;
    startTransition: React.TransitionStartFunction;
  }
>(function TreeImport({ children, onDone, startTransition, ...props }, ref) {
  const t = useTranslations();

  return (
    <FileReaderInput
      accept="application/json"
      ref={ref}
      onFileLoad={(event) => {
        const result = event.target?.result;

        if (!result || !(typeof result === "string")) {
          return Notification.add({
            Title: t(
              "app.dashboard.new-project.import.notification.invalid-file.title",
            ),
            Content: t(
              "app.dashboard.new-project.import.notification.invalid-file.content",
            ),
          });
        }

        const parsedResult = JSON.parse(result);

        const validatedResult = ZTreeImport.safeParse(parsedResult);

        if (!validatedResult.success) {
          console.log(validatedResult.error);
          return Notification.add({
            Title: t(
              "app.dashboard.new-project.import.notification.invalid-file.title",
            ),
            Content: t(
              "app.dashboard.new-project.import.notification.invalid-file.content",
            ),
          });
        }

        startTransition(async () => {
          const result = await importTreeAction({
            name: validatedResult.data.name,
            fileData: validatedResult.data.treeDocument?.data,
            treeData: validatedResult.data.treeData
              ? JSON.stringify(validatedResult.data.treeData)
              : undefined,
          });

          if (result && !result.success) {
            console.error(parsedResult);
            console.error({
              ...result.failure,
              parentError: JSON.parse(result.failure.parentError ?? ""),
            });

            return Notification.add({
              Title: t(
                "app.dashboard.new-project.import.notification.invalid-file.title",
              ),
              Content: t(
                "app.dashboard.new-project.import.notification.invalid-file.content",
              ),
            });
          }

          onDone?.();
        });
      }}
      {...props}
    >
      {children}
    </FileReaderInput>
  );
});
