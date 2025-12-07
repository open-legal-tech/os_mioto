"use client";

import { InfoBox } from "@mioto/design-system/InfoBox";
import { LoadingSpinner } from "@mioto/design-system/LoadingSpinner";
import { Stack } from "@mioto/design-system/Stack";
import { useTranslations } from "@mioto/locale";
import {
  type ProviderProps,
  RendererProvider,
  useCurrentNode,
  useInterpreter,
  useRendererContext,
} from "../Context";
import { RendererPrimitives } from "../RendererPrimitives";
import { renderers } from "../rendererPlugins";

export type RendererProps = Pick<
  ProviderProps,
  | "session"
  | "environment"
  | "onError"
  | "withResetConfirmation"
  | "userUuid"
  | "RestartButton"
>;

export function Renderer({ environment, ...props }: RendererProps) {
  return (
    //@ts-expect-error - It errors because the types allow either a treeString or a treeBuffer. Here they are both optional, because typescript is not inferring them as either or.
    <RendererProvider {...props} environment={environment}>
      <RendererImpl />
    </RendererProvider>
  );
}

function RendererImpl() {
  const {
    config: { environment },
  } = useRendererContext();
  const node = useCurrentNode();

  const isError = useInterpreter((state) => state.matches("error"));
  const PluginRenderer = renderers[node.type];

  const isLoading = useInterpreter((state) => state.matches("execute_action"));
  const isResetting = useInterpreter((state) => state.matches("reset"));

  const error = useInterpreter((state) => state.context.error);

  const t = useTranslations("renderer");

  if (isError && error) {
    if (environment === "private") {
      return (
        <RendererPrimitives.Container
          canGoForward={false}
          isInteractive={false}
        >
          <Stack className="h-full justify-center">
            <InfoBox
              Title={t(`error.${error}.title`)}
              Content={t(`error.${error}.content`, { blockName: node.name })}
              variant="danger"
              layout="stack"
            />
          </Stack>
        </RendererPrimitives.Container>
      );
    }

    return (
      <RendererPrimitives.Container
        canGoForward={false}
        canGoBack={false}
        isInteractive={false}
      >
        <Stack className="h-full justify-center">
          <InfoBox
            Title={t("error.title")}
            Content={t("error.content")}
            variant="danger"
          />
        </Stack>
      </RendererPrimitives.Container>
    );
  }

  return !PluginRenderer || isLoading || isResetting ? (
    <RendererPrimitives.Container
      canGoForward={false}
      canGoBack={false}
      isInteractive={false}
    >
      <Stack center className="h-full">
        <LoadingSpinner size="3em" />
        {isResetting ? t("reset.loading-text") : null}
      </Stack>
    </RendererPrimitives.Container>
  ) : (
    <PluginRenderer nodeId={node.id} key={node.id} withNavigation />
  );
}
