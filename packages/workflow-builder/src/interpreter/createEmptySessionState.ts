import type { TNodeId } from "../tree/id";
import type { TModuleVariableValue } from "../variables/exports/types";

type CreateEmptySessionStateParams = {
  startNodeId: TNodeId;
  initialContext?: Partial<TModuleVariableValue>;
};

export const createEmptySessionState = ({
  startNodeId,
  initialContext,
}: CreateEmptySessionStateParams) => {
  return {
    history: {
      nodes: [{ id: startNodeId }, ...(initialContext?.history?.nodes ?? [])],
      position: initialContext?.history?.position ?? 0,
    },
    variables: initialContext?.variables ?? {},
  };
};

export const emptySession = {
  history: {
    nodes: [],
    position: 0,
  },
  variables: {},
};
