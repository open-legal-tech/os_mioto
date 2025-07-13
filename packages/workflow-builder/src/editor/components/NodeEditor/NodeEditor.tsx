"use client";

import { InfoBox } from "@mioto/design-system/InfoBox";
import { Stack } from "@mioto/design-system/Stack";
import { useTranslations } from "@mioto/locale";
import { Warning } from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence } from "framer-motion";
import { useIsError, useIsInvalid, useIsSynced } from "../../exports/state";
import { BrokenTreeSupportDialog } from "../BrokenTreeSupportDialog";
import { Canvas } from "./Canvas";

export type NodeEditorProps = {
  treeUuid: string;
  className?: string;
  userEmail?: string;
  children: React.ReactNode;
  Sidebar: React.ReactNode;
};

export function NodeEditor({
  treeUuid,
  className,
  userEmail,
  children,
  Sidebar,
}: NodeEditorProps) {
  const isError = useIsError();
  const isSynced = useIsSynced();
  const { isInvalid, validationError } = useIsInvalid();

  const t = useTranslations();

  if (isError) {
    return (
      <Stack center className={className}>
        <InfoBox
          className="max-w-[500px]"
          variant="danger"
          customIcon={Warning}
          Title={t("app.editor.error.unauthorized.title")}
        />
      </Stack>
    );
  }

  if (isInvalid) {
    console.log(validationError);
    return (
      <Stack center className={className}>
        <InfoBox
          className="max-w-[500px]"
          variant="danger"
          Title={t("app.editor.error.broken-file.title")}
          Content={t("app.editor.error.broken-file.content")}
          Actions={() => (
            <BrokenTreeSupportDialog
              validationError={validationError}
              userEmail={userEmail}
            />
          )}
        />
      </Stack>
    );
  }

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <Canvas treeUuid={treeUuid} className={className} isLoading={!isSynced}>
          {Sidebar}
        </Canvas>
      </AnimatePresence>
      {children}
    </>
  );
}
