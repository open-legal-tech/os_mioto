"use client";

import { useTranslations } from "@mioto/locale";
import { useSuspenseQuery } from "@tanstack/react-query";
import * as React from "react";
import {
  type TNodeType,
  assertNode,
  createTreeClientPlugins,
} from "../../createTreeClientWithPlugins";
import type { TNodeId } from "../../id";
import { TreeEvent } from "../../type/TreeEventEmitter";
import type { NodePlugin } from "../../type/plugin/NodePlugin";
import { type TTreeClient, TreeClient } from "../../type/treeClient";
import type { TTree } from "../../type/type-classes/Tree";
import { createTreeStore } from "./treeStore";
import { useTree } from "./useTree";

export function subscribePlugins({
  nodePlugins,
  treeClient,
}: {
  nodePlugins: Record<string, NodePlugin>;
  treeClient: TTreeClient;
}) {
  const groupIds = [] as string[];

  let key: keyof typeof nodePlugins;
  for (key in nodePlugins) {
    const subscribe = nodePlugins[key]?.subscribeToTreeEvents;
    if (!subscribe) continue;
    const id = subscribe(treeClient);

    if (id) {
      groupIds.push(id);
    }
  }

  return () => {
    groupIds.forEach((groupId) => {
      TreeEvent.offGroup(groupId);
    });
  };
}

export type TTreeContext = ReturnType<typeof createTreeStore> & {
  treeClient: TTreeClient;
  plugins: ReturnType<typeof createTreeClientPlugins>;
};

export const TreeContext = React.createContext<TTreeContext | null>(null);

type Props = {
  children: React.ReactNode;
  id: string;
  initialTree?: TTree | string;
  withFix?: boolean;
};

export const TreeProvider = ({ id, children, initialTree }: Props) => {
  const t = useTranslations();
  const { data } = useSuspenseQuery({
    queryKey: ["tree", id, initialTree] as const,
    queryFn: async ({ queryKey: [, id, initialTree] }) => {
      const treeStore = createTreeStore(id, initialTree);

      const treeClient = new TreeClient(treeStore.tree, treeStore.treeMap);
      const plugins = createTreeClientPlugins(treeClient);

      return { ...treeStore, treeClient, plugins };
    },
  });

  React.useEffect(() => {
    const unsubscribe = subscribePlugins({
      treeClient: data.treeClient,
      nodePlugins: data.plugins.nodePlugins,
    });

    return () => unsubscribe();
  }, [data.plugins.nodePlugins, data.treeClient]);

  return (
    <TreeContext.Provider value={{ ...data }}>{children}</TreeContext.Provider>
  );
};

export const useTreeContext = () => {
  const context = React.useContext(TreeContext);

  if (!context)
    throw new Error(
      `useTreeContext can only be used when nested inside of a TreeProvider`,
    );

  return context;
};

export const useTreeClient = () => {
  const context = useTreeContext();

  return { treeClient: context.treeClient, ...context.plugins };
};

export const useNodePlugin = (nodeId: TNodeId) => {
  const node = useTree((treeClient) => treeClient.nodes.get.single(nodeId));
  const { nodePlugins } = useTreeClient();

  assertNode(node);

  return nodePlugins[node.type];
};

export const useNodePluginByType = <TType extends TNodeType["type"]>(
  nodeId: TNodeId,
  type: TType,
) => {
  const { nodePlugins } = useTreeClient();
  const plugin = useNodePlugin(nodeId);

  if (plugin.type !== type) {
    throw new Error(`Expected node plugin type ${type} but got ${plugin.type}`);
  }

  return plugin as (typeof nodePlugins)[typeof type];
};
