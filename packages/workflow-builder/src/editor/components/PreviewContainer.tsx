"use client";

import { Button, ButtonLink } from "@mioto/design-system/Button";
import { HelpTooltip } from "@mioto/design-system/HelpTooltip";
import { InfoBox } from "@mioto/design-system/InfoBox";
import Input from "@mioto/design-system/Input";
import { useOrg } from "@mioto/design-system/Org";
import { Row } from "@mioto/design-system/Row";
import { Stack } from "@mioto/design-system/Stack";
import { useTranslations } from "@mioto/locale";
import { ErrorBoundary } from "@sentry/nextjs";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import type { RendererProps } from "../../renderer/exports/Renderer.server";
import { resetSessionAction } from "../../renderer/exports/resetSessionAction";
import { getSessionAction } from "../actions/getSession.action";
import { updateSessionNameAction } from "../actions/updateSessionName.action";
import { debounce } from "../../utils/debounce";

export type PreviewProps = {
  children: React.ReactNode;
  session: RendererProps["session"];
};

export const PreviewContainer = React.forwardRef<HTMLDivElement, PreviewProps>(
  function Preview({ session, children }, ref) {
    const [isLoading, startTransition] = React.useTransition();
    const queryClient = useQueryClient();
    const orgSlug = useOrg();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedUpdateSessionName = React.useCallback(
      debounce(async (sessionUuid: string, sessionName: string) => {
        await updateSessionNameAction({
          sessionUuid,
          sessionName,
          orgSlug,
        });
      }, 200),
      [],
    );

    const { data, isLoading: isSessionDownloadLinkLoading } = useQuery({
      queryKey: ["session"],
      queryFn: async () => {
        const result = await getSessionAction({
          sessionUuid: session.uuid,
        });

        if (!result.success) {
          throw new Error(result.message);
        }

        const blob = new Blob([JSON.stringify(result.data.session.state)], {
          type: "application/json",
        });

        return URL.createObjectURL(blob);
      },
    });

    const t = useTranslations();

    return (
      <div
        className="grid grid-rows-[max-content_1fr] h-full relative outline-none overflow-y-auto gap-4"
        ref={ref}
      >
        <Row className="items-center bg-gray2 p-4 border-b border-gray5 justify-between gap-2">
          <Input
            className="flex-1 bg-transparent border-none"
            inputClassNames="text-extraSmallHeading"
            defaultValue={session.name ?? "Kein Name"}
            onChange={(event) => {
              debouncedUpdateSessionName(session.uuid, event.target.value);
            }}
          />
          <Row>
            <ButtonLink
              variant="tertiary"
              size="small"
              download={`${session.name}.json`}
              href={data ? data : ""}
            >
              {t("app.editor.preview.save-session.text")}
            </ButtonLink>
            <HelpTooltip>
              {t("app.editor.preview.save-session.help-tooltip.content")}
            </HelpTooltip>
          </Row>
        </Row>
        <Stack className="p-6 h-full">
          <ErrorBoundary
            fallback={(error) => {
              console.error(error);
              return (
                <Stack className="justify-center h-full">
                  <InfoBox
                    Title={t("app.editor.preview.unknown-error.title")}
                    Content={t("app.editor.preview.unknown-error.content")}
                    variant="danger"
                    layout="stack"
                    Actions={() => (
                      <Button
                        isLoading={isLoading}
                        onClick={() => {
                          startTransition(async () => {
                            // TODO why is it possible to have a session without ownerUuid?
                            if (!session.ownerUuid) return;

                            await resetSessionAction({
                              sessionUuid: session.uuid,
                              userUuid: session.ownerUuid,
                            });

                            queryClient.invalidateQueries({
                              queryKey: ["session"],
                            });
                          });
                        }}
                      >
                        {t(
                          "app.editor.preview.unknown-error.reset-action.label",
                        )}
                      </Button>
                    )}
                  />
                </Stack>
              );
            }}
          >
            {children}
          </ErrorBoundary>
        </Stack>
      </div>
    );
  },
);
