import { DropdownMenu } from "@mioto/design-system/DropdownMenu";
import { Notification } from "@mioto/design-system/Notification";
import { useOrg } from "@mioto/design-system/Org";
import { useTranslations } from "@mioto/locale";
import { shareTreeAction } from "@mioto/server/actions/shareTree.action";
import { Copy, Share } from "@phosphor-icons/react/dist/ssr";

export function SharePublicItem({
  isPublic,
  treeUuid,
  CLIENT_ENDPOINT,
}: {
  isPublic: boolean;
  treeUuid: string;
  CLIENT_ENDPOINT: string;
}) {
  const t = useTranslations();
  const orgSlug = useOrg();

  const link = `${CLIENT_ENDPOINT}/org/${orgSlug}/render/${treeUuid}`;

  return isPublic ? (
    <DropdownMenu.Sub>
      <DropdownMenu.SubTriggerItem Icon={<Share className="mt-[2px]" />}>
        {t("components.project-menu.sharePublic.configure.button")}
      </DropdownMenu.SubTriggerItem>
      <DropdownMenu.SubContent>
        <DropdownMenu.Item
          onSelect={() => {
            navigator.clipboard.writeText(link);
            Notification.add({
              Title: t(
                "components.project-menu.sharePublic.configure.copy-link.notification.success.title",
              ),
              variant: "success",
            });
          }}
          Icon={<Copy className="mt-[2px]" />}
        >
          {t("components.project-menu.sharePublic.configure.copy-link.label")}
        </DropdownMenu.Item>
        <DropdownMenu.Item
          onAsyncSelect={async () => {
            await shareTreeAction({ isPublic: false, treeUuid });
          }}
          Icon={<Share className="mt-[2px]" />}
        >
          {t("components.project-menu.sharePublic.configure.end-sharing")}
        </DropdownMenu.Item>
      </DropdownMenu.SubContent>
    </DropdownMenu.Sub>
  ) : (
    <DropdownMenu.Item
      onAsyncSelect={async () => {
        await shareTreeAction({ isPublic: true, treeUuid });
        navigator.clipboard.writeText(link);
        Notification.add({
          Title: t(
            "components.project-menu.sharePublic.configure.share-button.notification.success.title",
          ),
          Content: t(
            "components.project-menu.sharePublic.configure.share-button.notification.success.content",
          ),
          variant: "success",
        });
      }}
      Icon={<Share className="mt-[2px]" />}
    >
      {t("components.project-menu.sharePublic.configure.share-button.label")}
    </DropdownMenu.Item>
  );
}
