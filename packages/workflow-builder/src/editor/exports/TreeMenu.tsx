"use client";

import { DropdownMenu } from "@mioto/design-system/DropdownMenu";

import Separator from "@mioto/design-system/Separator";
import { useTranslations } from "@mioto/locale";
import { FilePlus, Pen, Share, Trash } from "@phosphor-icons/react/dist/ssr";
import * as React from "react";
import {
  type CreateVersionItemProps,
  CreateVersionMenu,
} from "../components/TreeMenu/CreateVersionItem";
import { DeleteTreeDialog } from "../components/TreeMenu/DeleteTreeDialog";
import { DuplicateTreeDialog } from "../components/TreeMenu/DuplicateTreeDialog";
import {
  ExportItem,
  type ExportItemProps,
} from "../components/TreeMenu/ExportItem";
import { SharePublicItem } from "../components/TreeMenu/SharePublicItem";
import { UpdateTreeDialog } from "../components/TreeMenu/UpdateTreeDialog";

export type TreeMenuProps = {
  className?: string;
  children?: React.ReactNode;
  Items?: React.ReactNode;
  tree: {
    uuid: string;
    name: string;
    Snapshots: string[];
    description: string | null;
    isPublic: boolean | null;
  };
  createVersionDisabled?: DropdownMenu.ItemProps["disabled"];
  CLIENT_ENDPOINT: string;
} & Pick<CreateVersionItemProps, "onBeforeCreateVersion"> &
  Pick<ExportItemProps, "onBeforeExport">;

export function TreeMenu({
  className,
  children,
  Items,
  tree,
  onBeforeCreateVersion,
  onBeforeExport,
  createVersionDisabled,
  CLIENT_ENDPOINT,
}: TreeMenuProps) {
  const t = useTranslations();
  const [openDialog, setOpenDialog] = React.useState<
    undefined | "update" | "delete" | "duplicate"
  >();

  const [dropdownOpen, setDropdownOpen] = React.useState(false);

  return (
    <>
      <UpdateTreeDialog
        treeId={tree.uuid}
        treeName={tree.name}
        description={tree.description}
        open={openDialog === "update"}
        onOpenChange={() => setOpenDialog(undefined)}
      />
      <DuplicateTreeDialog
        treeId={tree.uuid}
        treeName={tree.name}
        description={tree.description}
        open={openDialog === "duplicate"}
        onOpenChange={() => setOpenDialog(undefined)}
      />
      <DeleteTreeDialog
        tree={tree}
        open={openDialog === "delete"}
        onOpenChange={() => setOpenDialog(undefined)}
      />
      <DropdownMenu.Root open={dropdownOpen} onOpenChange={setDropdownOpen}>
        {React.isValidElement(children) ? (
          <DropdownMenu.Trigger asChild>{children}</DropdownMenu.Trigger>
        ) : (
          <DropdownMenu.Button
            variant="tertiary"
            className={className}
            aria-label={t("components.project-menu.label", {
              treeName: tree.name,
            })}
          >
            {tree.name}
          </DropdownMenu.Button>
        )}
        <DropdownMenu.Content sideOffset={12} align="start">
          <DropdownMenu.Item
            onSelect={() => {
              setOpenDialog("update");
              setDropdownOpen(false);
            }}
            Icon={<Pen />}
          >
            {t("components.project-menu.changeTreeData.button")}
          </DropdownMenu.Item>
          <ExportItem treeUuid={tree.uuid} onBeforeExport={onBeforeExport} />
          <CreateVersionMenu
            treeName={tree.name}
            treeUuid={tree.uuid}
            onBeforeCreateVersion={onBeforeCreateVersion}
            snapshotUuids={tree.Snapshots ?? []}
            onCreateVersion={() => {
              setDropdownOpen(false);
            }}
            disabled={createVersionDisabled}
          />
          {tree.Snapshots.length === 0 ? (
            <DropdownMenu.Item
              disabled={{
                reason: t(
                  "components.project-menu.sharePublic.disabled.reason.tooltip",
                ),
              }}
              Icon={<Share className="mt-[2px]" />}
            >
              {t(
                "components.project-menu.sharePublic.configure.share-button.label",
              )}
            </DropdownMenu.Item>
          ) : (
            <SharePublicItem
              CLIENT_ENDPOINT={CLIENT_ENDPOINT}
              treeUuid={tree.uuid}
              isPublic={tree.isPublic ?? false}
            />
          )}
          <DropdownMenu.Item
            onSelect={() => {
              setOpenDialog("duplicate");
              setDropdownOpen(false);
            }}
            Icon={<FilePlus className="mt-[2px]" />}
          >
            {"Duplicate application"}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={() => {
              setOpenDialog("delete");
              setDropdownOpen(false);
            }}
            Icon={<Trash className="mt-[2px]" />}
          >
            {t("components.project-menu.deleteTree.button")}
          </DropdownMenu.Item>
          {Items ? (
            <>
              <Separator />
              {Items}
            </>
          ) : null}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
}
