"use client";

import { DropdownMenu } from "@mioto/design-system/DropdownMenu";
import { useTranslations } from "@mioto/locale";
import { TreeImport } from "@mioto/workflow-builder/editor/components/TreeImport";
import { CloudArrowUp, Plus, Rocket } from "@phosphor-icons/react/dist/ssr";
import * as React from "react";
import { CreateTreeDialog } from "./CreateTreeDialog";

export function NewProjectDropdown(props: DropdownMenu.ButtonProps) {
  const t = useTranslations();

  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [isLoading, startTransition] = React.useTransition();

  return (
    <>
      <CreateTreeDialog
        open={createDialogOpen}
        onOpenChange={() => setCreateDialogOpen(false)}
      />
      <DropdownMenu.Root open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenu.Trigger asChild>
          <DropdownMenu.Button className="gap-2" {...props}>
            <Rocket />
            {t("app.dashboard.new-project.label")}
          </DropdownMenu.Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" sideOffset={5}>
          <DropdownMenu.Item
            onSelect={() => {
              setCreateDialogOpen(true);
              setDropdownOpen(false);
            }}
            Icon={<Plus />}
          >
            {t("app.dashboard.new-project.create-new.title")}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onSelect={(event) => {
              event.preventDefault();
            }}
            Icon={<CloudArrowUp />}
            isLoading={isLoading}
            asChild
          >
            <TreeImport startTransition={startTransition}>
              {t("app.dashboard.new-project.import.label")}
            </TreeImport>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
}
