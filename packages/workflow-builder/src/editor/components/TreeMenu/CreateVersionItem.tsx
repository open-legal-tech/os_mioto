import { DropdownMenu } from "@mioto/design-system/DropdownMenu";

import { Notification } from "@mioto/design-system/Notification";
import { useTranslations } from "@mioto/locale";
import { Archive } from "@phosphor-icons/react/dist/ssr";
import { createSnapshotAction } from "./createSnapshot.action";

export type CreateVersionItemProps = {
  treeUuid: string;
  treeName: string;
  snapshotUuids: string[];
  onBeforeCreateVersion?: () => Promise<void> | void;
  onCreateVersion?: () => Promise<void> | void;
  disabled?: DropdownMenu.ItemProps["disabled"];
};

export function CreateVersionMenu({
  snapshotUuids,
  ...props
}: CreateVersionItemProps) {
  const t = useTranslations();
  const hasSnapshot = snapshotUuids.length > 0;

  return hasSnapshot ? (
    <DropdownMenu.Sub>
      <DropdownMenu.SubTriggerItem Icon={<Archive className="mt-[2px]" />}>
        {t("components.project-menu.create-version.sub-menu.label")}
      </DropdownMenu.SubTriggerItem>
      <DropdownMenu.SubContent sideOffset={10}>
        <CreateVersionItem {...props} />
      </DropdownMenu.SubContent>
    </DropdownMenu.Sub>
  ) : (
    <CreateVersionItem {...props} />
  );
}

const CreateVersionItem = ({
  treeUuid,
  onBeforeCreateVersion,
  onCreateVersion,
  disabled,
}: Pick<
  CreateVersionItemProps,
  "treeUuid" | "onBeforeCreateVersion" | "onCreateVersion" | "disabled"
>) => {
  const t = useTranslations();

  return (
    <DropdownMenu.Item
      onAsyncSelect={async () => {
        onBeforeCreateVersion?.();

        const result = await createSnapshotAction({ treeUuid });
        if (!result.success) {
          return Notification.add({
            Title: t(
              `components.project-menu.create-version.errors.${result.failure.code}.title`,
            ),
            Content: t(
              `components.project-menu.create-version.errors.${result.failure.code}.content`,
            ),
            variant: "danger",
            key: "create-version-error",
            type: "foreground",
          });
        }

        Notification.add({
          Title: t("components.project-menu.create-version.success.title"),
          Content: t("components.project-menu.create-version.success.content"),
          variant: "success",
          key: "create-version-success",
        });

        onCreateVersion?.();
      }}
      disabled={disabled}
      Icon={<Archive className="mt-[2px]" />}
    >
      {t("components.project-menu.create-version.button")}
    </DropdownMenu.Item>
  );
};
