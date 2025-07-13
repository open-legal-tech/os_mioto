"use client";

import { Button } from "@mioto/design-system/Button";
import { Row } from "@mioto/design-system/Row";
import SubmitButton from "@mioto/design-system/SubmitButton";
import Text from "@mioto/design-system/Text";
import { useTranslations } from "@mioto/locale";
import { ArrowLeft, ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { useQueryClient } from "@tanstack/react-query";
import type * as React from "react";
import { isEmpty } from "remeda";
import { useCurrentNode, useInterpreter, useRendererContext } from "../Context";
import { ResetButton } from "../ResetButton";
import RendererProgress from "./RendererProgress";

export type NavigationProps = {
  className?: string;
  successButtonLabel?: React.ReactNode;
  disabled?: boolean;
  isModule?: boolean;
  isLoading?: boolean;
} & Pick<BackButtonProps, "canGoBack"> &
  Pick<ForwardButtonProps, "canGoForward">;

export function Navigation({
  className,
  successButtonLabel,
  isModule,
  canGoForward: pluginCanGoForward,
  canGoBack: pluginCanGoBack,
  isLoading,
}: NavigationProps) {
  const node = useCurrentNode();
  const {
    config: { startNodeId, RestartButton },
  } = useRendererContext();
  const isError = useInterpreter((state) => state.matches("error"));
  const queryClient = useQueryClient();

  const canGoForward = useInterpreter(
    (state) => state.can({ type: "GO_FORWARD" }) && pluginCanGoForward,
  );

  const canGoBack = useInterpreter(
    (state) => state.can({ type: "GO_BACK" }) && pluginCanGoBack,
  );

  const canSubmit = useInterpreter((state) => state.matches("editing"));

  const isStartNode = node.id === startNodeId;
  const isFinalNode =
    node.final || (node.edges.length === 0 && !node.fallbackEdge);
  const t = useTranslations("renderer");

  return (
    <>
      <RendererProgress className="mb-2 lg:mb-4" />
      {isFinalNode ? (
        <Row center className="gap-1 justify-between">
          <Text emphasize="weak" className="self-center">
            {t("final.message")}
          </Text>
          {RestartButton}
        </Row>
      ) : (
        <div
          className={`grid grid-cols-[1fr_max-content_1fr] min-w-[80%] gap-2 pt-4 rounded items-center ${className}`}
        >
          {!isStartNode ? (
            <BackButton canGoBack={canGoBack && !isLoading} />
          ) : (
            <div />
          )}
          {!isFinalNode ? <ResetButton /> : null}
          {canGoForward ? (
            <ForwardButton canGoForward={canGoForward && !isLoading} />
          ) : (isFinalNode && !isModule) || isError ? (
            <div />
          ) : (
            <SubmitButton
              className="submit-button"
              form="form"
              isLoading={(!canSubmit || isLoading) && !isError}
              onClick={() => {
                queryClient.invalidateQueries({
                  queryKey: ["session"],
                });
                return queryClient.cancelQueries({ queryKey: ["progress"] });
              }}
            >
              {(successButtonLabel ?? !isEmpty(node.rendererButtonLabel))
                ? node.rendererButtonLabel
                : t("navigation.submit")}
            </SubmitButton>
          )}
        </div>
      )}
    </>
  );
}

type BackButtonProps = {
  className?: string;
  disabled?: boolean;
  canGoBack: boolean;
};

export function BackButton({
  className,
  disabled,
  canGoBack,
}: BackButtonProps) {
  const { send } = useRendererContext();
  const queryClient = useQueryClient();

  const t = useTranslations("renderer");

  return (
    <Button
      variant="secondary"
      onClick={() => {
        send({ type: "GO_BACK" });

        queryClient.invalidateQueries({ queryKey: ["progress"] });
      }}
      disabled={!canGoBack || disabled}
      className={`${className} colorScheme-gray back-button`}
    >
      <ArrowLeft />
      <span>{t("navigation.next")}</span>
    </Button>
  );
}

type ForwardButtonProps = {
  className?: string;
  disabled?: boolean;
  canGoForward: boolean;
  isLoading?: boolean;
};

export function ForwardButton({
  className,
  disabled,
  canGoForward,
  isLoading,
}: ForwardButtonProps) {
  const { send } = useRendererContext();
  const queryClient = useQueryClient();

  const t = useTranslations("renderer");

  return (
    <Button
      variant="secondary"
      onClick={() => {
        send({ type: "GO_FORWARD" });

        queryClient.invalidateQueries({ queryKey: ["progress"] });
      }}
      disabled={!canGoForward || disabled}
      className={`${className} colorScheme-primary forward-button`}
      isLoading={isLoading}
    >
      {t("navigation.back")}
      <ArrowRight />
    </Button>
  );
}
