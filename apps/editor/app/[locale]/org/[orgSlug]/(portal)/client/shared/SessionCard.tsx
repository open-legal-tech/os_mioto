"use client";

import Badge from "@mioto/design-system/Badge";
import { ButtonLink } from "@mioto/design-system/Button";
import { sidebarCardClasses } from "@mioto/design-system/Card";
import Input from "@mioto/design-system/Input";
import { useOrg } from "@mioto/design-system/Org";
import { Row } from "@mioto/design-system/Row";
import { useFormatter, useTranslations } from "@mioto/locale";
import { Clock } from "@phosphor-icons/react";
import { Check } from "@phosphor-icons/react/dist/ssr";
import React from "react";
import { useDebounce } from "react-use";
import { updateSessionClientLabelAction } from "./updateSessionName.action";

export function SessionCard({
  sessionName,
  sessionUpdateDate,
  sessionUuid,
  inProgress = true,
  className,
}: {
  sessionName: string;
  sessionUpdateDate: string;
  sessionUuid: string;
  inProgress?: boolean;
  className?: string;
}) {
  const [internalSessionName, setSessionName] = React.useState<string | null>();
  const [isPending, startTransition] = React.useTransition();
  const orgSlug = useOrg();

  useDebounce(
    () => {
      if (!internalSessionName) return;

      startTransition(() => {
        updateSessionClientLabelAction({
          orgSlug,
          sessionUuid: sessionUuid,
          newSessionName: internalSessionName,
        });
      });
    },

    200,
    [internalSessionName],
  );

  const format = useFormatter();
  const t = useTranslations();

  return (
    <Row
      className={sidebarCardClasses([
        "justify-between items-center bg-gray1 rounded-t-none p-4 py-2 flex-wrap gap-2",
        className,
      ])}
    >
      <Input
        className="bg-transparent border-none -translate-x-2 rounded flex-1 min-w-[300px] md:min-w-0"
        inputClassNames="text-extraSmallHeading"
        defaultValue={sessionName}
        onChange={(event) => {
          setSessionName(event.target.value);
        }}
        isLoading={isPending}
      />
      <Row className="gap-2 justify-between flex-0 lg:max-w-max items-center">
        <Badge className="colorScheme-gray max-w-max gap-2 font-weak">
          <Clock />
          {format.dateTime(new Date(sessionUpdateDate), {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </Badge>
        {inProgress ? (
          <ButtonLink
            orgLink
            size="small"
            variant="secondary"
            href={`/client/render/${sessionUuid}` as const}
          >
            {t("client-portal.dashboard.app-card.continue")}
          </ButtonLink>
        ) : (
          <Badge colorScheme="gray" square>
            <Check />
          </Badge>
        )}
      </Row>
    </Row>
  );
}
