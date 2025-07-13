"use client";

import { IconButton } from "@mioto/design-system/IconButton";
import { Skeleton } from "@mioto/design-system/Skeleton";
import { Stack, stackClasses } from "@mioto/design-system/Stack";
import { Tabs } from "@mioto/design-system/Tabs";
import { twMerge } from "@mioto/design-system/tailwind/merge";
import { useTranslations } from "@mioto/locale";
import { Globe, Play } from "@phosphor-icons/react/dist/ssr";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { useIsSynced, useTree } from "../exports/state";
import { CreateNodeButton } from "./CreateNodeButton";
import { GlobalVariablesSidebar } from "./GlobalVariablesSidebar";

export type SideMenuProps = {
  BottomSlot?: React.ReactNode;
  onCreateSession: () => Promise<void>;
  className?: string;
  PreviewSlot?: React.ReactNode;
  hasSession: boolean;
};

export function SideMenu({
  className,
  hasSession,
  onCreateSession,
  BottomSlot,
  PreviewSlot,
}: SideMenuProps) {
  const isSynced = useIsSynced();
  const [tab, setTab] = React.useState<
    "preview" | "globalVariables" | undefined
  >(undefined);

  const startNodeId = useTree((treeClient) => treeClient.get.startNodeId());

  const [isLoading, startTransition] = React.useTransition();

  const t = useTranslations();

  return (
    <Tabs.Root
      value={tab}
      className={twMerge(
        "isolate grid grid-cols-[56px_max-content] h-full overflow-hidden",
        className,
        "col-end-[3]",
      )}
    >
      <AnimatePresence>
        <Stack
          className="bg-white border-r border-gray5 justify-between py-2 z-10 h-full"
          key="side-menu"
        >
          {isSynced ? (
            <>
              <Stack center className="gap-2 w-[55px]">
                <CreateNodeButton />
                <Tabs.List className={stackClasses({}, "gap-2")}>
                  <IconButton
                    disabled={!startNodeId || isLoading}
                    tooltip={
                      startNodeId
                        ? {
                            children: t(
                              "app.editor.preview.menu-button.enabled",
                            ),
                            side: "right",
                            sideOffset: 20,
                            delay: 0,
                          }
                        : {
                            children: t(
                              "app.editor.preview.menu-button.disabled",
                            ),
                            side: "right",
                            sideOffset: 20,
                            delay: 0,
                          }
                    }
                    square
                    variant="tertiary"
                    isLoading={isLoading}
                    onClick={() => {
                      if (!hasSession) {
                        startTransition(async () => {
                          if (!startNodeId) {
                            return;
                          }

                          await onCreateSession();

                          if (tab === "preview") return setTab(undefined);
                          return setTab("preview");
                        });
                      }

                      if (tab === "preview") {
                        return setTab(undefined);
                      }

                      setTab("preview");
                    }}
                  >
                    <Play />
                  </IconButton>

                  <IconButton
                    square
                    variant="tertiary"
                    tooltip={{
                      children: t("app.editor.global-variables.menu-button"),
                      side: "right",
                      sideOffset: 20,
                      delay: 0,
                    }}
                    onClick={() => {
                      if (tab === "globalVariables") return setTab(undefined);
                      setTab("globalVariables");
                    }}
                  >
                    <Globe />
                  </IconButton>
                </Tabs.List>
              </Stack>
              <Stack center>{BottomSlot}</Stack>
            </>
          ) : (
            <Stack center className="gap-2 w-[55px]">
              <Skeleton className="h-[35px] w-[35px] rounded" />
              <Skeleton className="h-[35px] w-[35px] rounded" />
            </Stack>
          )}
        </Stack>
        {!!tab && (
          <motion.aside
            key="content"
            initial={{ x: "-100%" }}
            transition={{ duration: 0.3, type: "tween" }}
            animate={{ x: 0 }}
            exit={{
              x: "-100%",
              transition: { duration: 0.3, type: "tween" },
            }}
            className={stackClasses(
              {},
              "overflow-hidden w-[550px] border-gray5 border-r h-full bg-white justify-between",
            )}
          >
            {hasSession ? (
              <Tabs.Content value="preview" asChild>
                {PreviewSlot}
              </Tabs.Content>
            ) : null}
            <Tabs.Content value="globalVariables" className="overflow-hidden">
              <div className="grid p-6 pt-8 h-full relative outline-none overflow-y-auto">
                <GlobalVariablesSidebar />
              </div>
            </Tabs.Content>
          </motion.aside>
        )}
      </AnimatePresence>
    </Tabs.Root>
  );
}
