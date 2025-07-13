import { DropdownMenu } from "@mioto/design-system/DropdownMenu";
import { Notification } from "@mioto/design-system/Notification";
import { Stack } from "@mioto/design-system/Stack";
import { Word } from "@mioto/icons/Word";
import { useTranslations } from "@mioto/locale";

type Props = {
  copyKey: string;
};

export function CopyVariableKeyMenuItem({ copyKey }: Props) {
  const t = useTranslations();

  return (
    <DropdownMenu.Item
      onSelect={() => {
        navigator.clipboard.writeText(copyKey);
        Notification.add({
          Title: t(
            "packages.node-editor.node-menu.copy-variable.notification.copy.title",
          ),
          Content: () => (
            <Stack>
              {t.rich(
                "packages.node-editor.node-menu.copy-variable.notification.copy.content",
                {
                  key: () => (
                    <span className="overflow-auto border border-gray5 bg-gray1 rounded p-3 whitespace-nowrap text-smallText">
                      {copyKey}
                    </span>
                  ),
                },
              )}
            </Stack>
          ),
          variant: "success",
        });
      }}
      Icon={<Word />}
    >
      {t("packages.node-editor.node-menu.copy-variable.label")}
    </DropdownMenu.Item>
  );
}
