"use client";

import { DropdownMenu } from "@mioto/design-system/DropdownMenu";
import {
  Header,
  type HeaderProps as SystemHeaderProps,
} from "@mioto/design-system/Header";
import { IconButton } from "@mioto/design-system/IconButton";
import { Row } from "@mioto/design-system/Row";
import { useTranslations } from "@mioto/locale";
import { changeTreeThemeAction } from "@mioto/server/actions/changeTreeTheme.action";
import { PaintRoller, PauseCircle } from "@phosphor-icons/react/dist/ssr";
import { TreeMenu, type TreeMenuProps } from "../exports/TreeMenu";
import { useIsPaused, useIsSynced } from "../exports/state";
import NodeSearch from "./NodeSearch";

export type HeaderProps = {
  treeId: string;
  tree: TreeMenuProps["tree"];
  themes: { uuid: string; name: string }[];
  selectedTheme?: string;
  CLIENT_ENDPOINT: string;
} & SystemHeaderProps;

export const EditorHeader = ({
  className,
  tree,
  isLoading,
  themes,
  userEmail,
  RightSlot,
  selectedTheme,
  CLIENT_ENDPOINT,
}: HeaderProps) => {
  const t = useTranslations();
  const isSynced = useIsSynced();
  const isPaused = useIsPaused();

  return (
    <Header
      isLoading={isLoading ?? !isSynced}
      className={className}
      userEmail={userEmail}
      RightSlot={RightSlot}
      LeftSlot={
        <TreeMenu
          CLIENT_ENDPOINT={CLIENT_ENDPOINT}
          tree={tree}
          Items={
            themes.length > 0 ? (
              <DropdownMenu.Sub>
                <DropdownMenu.SubTriggerItem Icon={<PaintRoller />}>
                  {t("app.editor.project-menu.select-theme.label")}
                </DropdownMenu.SubTriggerItem>
                <DropdownMenu.SubContent>
                  <DropdownMenu.RadioGroup
                    value={selectedTheme}
                    onAsyncValueChange={async (value) => {
                      await changeTreeThemeAction({
                        themeUuid: value,
                        treeUuid: tree.uuid,
                      });
                    }}
                    items={themes.map((theme) => ({
                      value: theme.uuid,
                      label: theme.name,
                    }))}
                  />
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>
            ) : (
              <DropdownMenu.Item
                disabled={{
                  reason: t(
                    "app.editor.project-menu.select-theme.disabled.tooltip",
                  ),
                }}
              >
                {t("app.editor.project-menu.select-theme.label")}
              </DropdownMenu.Item>
            )
          }
        />
      }
    >
      <Row className="mx-2 items-center flex-1 justify-between">
        <NodeSearch />
      </Row>
      {isPaused ? (
        <IconButton
          tooltip={{
            content: t("app.editor.error.connection-paused.icon.tooltip"),
          }}
          square
        >
          <PauseCircle />
        </IconButton>
      ) : null}
    </Header>
  );
};
