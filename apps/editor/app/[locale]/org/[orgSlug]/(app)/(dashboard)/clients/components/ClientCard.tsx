import { ButtonLink } from "@mioto/design-system/Button";
import { cardClasses } from "@mioto/design-system/Card";
import { Heading } from "@mioto/design-system/Heading";
import { IconButtonLink } from "@mioto/design-system/IconButton";
import { Row } from "@mioto/design-system/Row";
import { Stack } from "@mioto/design-system/Stack";
import Text from "@mioto/design-system/Text";
import { useTranslations } from "@mioto/locale";
import { ArrowRight, ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { BlockClientDialogServer } from "./BlockClientDialog/BlockClientDialog.server";
import { ClientMenu } from "./ClientMenu";
import { ClientStatusBadge } from "./ClientStatusBadge";
import type { Client } from "./ClientType";
import { DeleteClientDialogServer } from "./DeleteClientDialog/DeleteClientDialog.server";
import { EditClientDialogServer } from "./EditClientDialog/EditClientDialog.server";
import { ShareSessionDialogServer } from "./ShareSessionDialog/ShareSessionDialog.server";
import { ShareTreeDialogServer } from "./ShareTreeDialog/ShareTreeDialog.server";

export type ClientCardProps = {
  client: Client;
  className?: string;
  orgSlug: string;
  isDemo?: boolean;
};

export function ClientCard({
  client,
  className,
  isDemo = false,
  orgSlug,
}: ClientCardProps) {
  const t = useTranslations();

  return (
    <div
      className={cardClasses([
        "gap-4 grid grid-cols-[1fr_max-content_max-content]",
        className,
      ])}
    >
      <Stack className="gap-1 justify-center">
        <Row className="gap-2 items-center">
          <Heading size="extra-small">{client.name ?? client.email}</Heading>
          {isDemo && (
            <ButtonLink
              orgLink
              size="small"
              variant="secondary"
              colorScheme="gray"
              href={`/client`}
              target="_blank"
            >
              Demo
              <ArrowSquareOut />
            </ButtonLink>
          )}
        </Row>
        {client.name ? (
          <Text className="text-gray9">{client.email}</Text>
        ) : null}
      </Stack>
      <ClientStatusBadge status={client.status} className="self-center" />
      <Row className="gap-1 items-center">
        <ClientMenu
          client={client}
          EditClientDialogContent={
            <EditClientDialogServer clientUuid={client.uuid} />
          }
          DeleteClientDialogContent={
            <DeleteClientDialogServer clientUuid={client.uuid} />
          }
          BlockClientDialogContent={
            <BlockClientDialogServer clientUuid={client.uuid} />
          }
          ShareAppWithPortalClientDialogContent={
            <ShareTreeDialogServer clientUuid={client.uuid} />
          }
          ShareSessionDialogContent={
            <ShareSessionDialogServer
              clientUuid={client.uuid}
              orgSlug={orgSlug}
            />
          }
        />
        <IconButtonLink
          tooltip={{ children: t("app.client.card.open.tooltip"), delay: 400 }}
          href={`/clients/${client.uuid}`}
        >
          <ArrowRight />
        </IconButtonLink>
      </Row>
    </div>
  );
}
