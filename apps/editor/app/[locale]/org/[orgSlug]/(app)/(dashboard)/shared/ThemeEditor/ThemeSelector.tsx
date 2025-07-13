"use client";

import { DualButton } from "@mioto/design-system/Button";
import { IconButton } from "@mioto/design-system/IconButton";
import { Select } from "@mioto/design-system/Select";
import type { Options } from "@mioto/design-system/SelectWithCombobox";
import { useTranslations } from "@mioto/locale";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import React from "react";
import { changeOrgSettingsAction } from "../../settings/changeOrgSettings.action";
import { ThemeDialog } from "./ThemeDialog";

export function ThemeSelector({
  options,
  selectedTheme,
  className,
  id,
}: {
  options: Options;
  selectedTheme?: string;
  className?: string;
  id?: string;
}) {
  const [isLoading, startTransition] = React.useTransition();
  const t = useTranslations();
  const [selectedItem, setSelectedItem] = React.useState(selectedTheme);

  const select = Select.useSelectStore({
    value: selectedTheme,
    setValue: (value) => {
      if (typeof value !== "string") {
        console.error("The selected theme key is not a string.");
        return;
      }

      setSelectedItem(value);
      startTransition(async () => {
        await changeOrgSettingsAction({ theme: value });
        select.toggle();
      });
    },
  });

  return (
    <DualButton
      LeftButton={() => (
        <Select.Root options={options} store={select}>
          <Select.Input
            disabled={options.length === 0}
            variant="tertiary"
            className={`border-none rounded-none h-full min-w-max ${className}`}
            id={id}
            placeholder={
              options.length === 0
                ? t("app.settings.theme-management.no-themes.label")
                : t("app.settings.theme-management.empty-label")
            }
            renderValue={(values) =>
              values.map((value) => value.name).join(", ")
            }
          />
          <Select.Popover sameWidth gutter={4}>
            {options.map((option) => (
              <Select.Item
                key={option.id}
                value={option.id}
                hideOnClick={false}
                isLoading={selectedItem === option.id && isLoading}
              >
                {option.name}
              </Select.Item>
            ))}
          </Select.Popover>
        </Select.Root>
      )}
      RightButton={() => (
        <ThemeDialog>
          <IconButton
            className="border-none rounded-none h-full"
            tooltip={{
              children: t("app.settings.theme-management.add.tooltip"),
              delay: 1000,
            }}
          >
            <Plus />
          </IconButton>
        </ThemeDialog>
      )}
    />
  );
}
