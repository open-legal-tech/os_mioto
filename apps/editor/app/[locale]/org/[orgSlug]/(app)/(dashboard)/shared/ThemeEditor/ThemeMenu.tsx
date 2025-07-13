"use client";

import { Button } from "@mioto/design-system/Button";
import {
  DialogButtonRow,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@mioto/design-system/Dialog";
import { DropdownMenu } from "@mioto/design-system/DropdownMenu";
import { Notification } from "@mioto/design-system/Notification";
import { Row } from "@mioto/design-system/Row";
import { useTranslations } from "@mioto/locale";
import { Download, List, Pencil, Trash } from "@phosphor-icons/react/dist/ssr";
import React from "react";
import { type Theme, ThemeDialog } from "./ThemeDialog";
import { removeThemeAction } from "./removeTheme.action";

export function ThemeMenu({ options }: { options: Theme[] }) {
  const t = useTranslations();
  const [selectedTheme, setSelectedTheme] = React.useState<
    string | undefined
  >();
  const [selectedThemeToDelete, setThemeToDelete] = React.useState<
    string | undefined
  >();
  const theme = options.find((option) => option.id === selectedTheme);

  const themeToDelete = options.find(
    (option) => option.id === selectedThemeToDelete,
  );

  return (
    <Row className="gap-1">
      {selectedTheme && theme ? (
        <ThemeDialog
          selectedTheme={theme}
          onClose={() => setSelectedTheme(undefined)}
        />
      ) : null}
      {selectedThemeToDelete && themeToDelete ? (
        <DeleteThemeDialog
          themeToDelete={themeToDelete}
          onDone={() => setThemeToDelete(undefined)}
        />
      ) : null}
      <DropdownMenu.Root>
        <DropdownMenu.Button withCaret={false} square variant="tertiary">
          <List />
        </DropdownMenu.Button>
        <DropdownMenu.Content>
          {options.map((option) => (
            <DropdownMenu.Sub key={option.id}>
              <DropdownMenu.SubTriggerItem>
                {option.name}
              </DropdownMenu.SubTriggerItem>
              <DropdownMenu.SubContent>
                <DropdownMenu.Item
                  Icon={<Pencil />}
                  onSelect={() => setSelectedTheme(option.id)}
                >
                  {t("app.settings.theme-management.edit.label")}
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  Icon={<Download />}
                  href={`/api/theme/${option.id}`}
                  download={`${option.name}.zip`}
                >
                  {t("app.settings.theme-management.download.label")}
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  Icon={<Trash />}
                  onSelect={() => setThemeToDelete(option.id)}
                >
                  {t("app.settings.theme-management.delete.label")}
                </DropdownMenu.Item>
              </DropdownMenu.SubContent>
            </DropdownMenu.Sub>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Row>
  );
}

function DeleteThemeDialog({
  themeToDelete,
  onDone,
}: {
  themeToDelete: Theme;
  onDone: () => void;
}) {
  const t = useTranslations();

  return (
    <DialogRoot
      open={!!themeToDelete}
      onOpenChange={(open) => {
        if (!open) {
          onDone();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("app.settings.theme-management.delete-theme.dialog.heading")}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {t.rich("app.settings.theme-management.delete-theme.dialog.content", {
            themeName: themeToDelete.name,
          })}
        </DialogDescription>
        <DialogButtonRow asChild>
          <Button
            colorScheme="danger"
            onAsyncClick={async () => {
              await removeThemeAction({
                themeUuid: themeToDelete.id,
              });

              Notification.add({
                variant: "success",
                Title: t(
                  "app.settings.theme-management.delete-theme.dialog.notification.success.title",
                ),
              });

              onDone();
            }}
          >
            {t("app.settings.theme-management.delete-theme.dialog.submit")}
          </Button>
        </DialogButtonRow>
      </DialogContent>
    </DialogRoot>
  );
}
