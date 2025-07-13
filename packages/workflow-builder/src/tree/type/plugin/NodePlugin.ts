import type { FeatureFlags } from "@mioto/analytics/types";
import type { Failure } from "@mioto/errors";
import { mapValues, omit } from "remeda";
import { ref } from "valtio/vanilla";
import { z } from "zod";
import type {
  IFileVariable,
  IRecordVariable,
  IRichTextVariable,
  PrimitiveVariable,
  VariableExecutionStatus,
} from "../../../variables/exports/types";
import { type TEdgeId, type TNodeId, ZEdgeId, ZNodeId } from "../../id";
import { nodeMigrations } from "../migrations/nodeMigrations";
import type { TReadOnlyTreeClient, TTreeClient } from "../treeClient";
import {
  EntityPlugin,
  type IEntityBase,
  ZEntityPluginBase,
} from "./EntityPlugin";
import type { EntityConstructorParams } from "./EntityPlugin";

export const duplicateNode =
  <TType extends INode>(nodeId: TNodeId) =>
  (treeClient: TTreeClient): TType => {
    const node = treeClient.nodes.get.single(nodeId);
    const yNode = treeClient.nodes.get.yNode(nodeId);

    const clonedNode = mapValues(node, (value, key) => {
      if (key.startsWith("y")) {
        const yValue = yNode.get(key);
        return ref(yValue.clone());
      }

      return value;
    });

    return treeClient.nodes.create.node({
      ...omit(clonedNode, [
        "edges",
        "fallbackEdge",
        "id",
        "isRemoved",
        "position",
        "name",
      ]),
      name: `${
        typeof clonedNode.name === "string"
          ? clonedNode.name.trimEnd()
          : clonedNode.name
      } Kopie`,
      position: {
        x: clonedNode.position.x + 260,
        y: clonedNode.position.y,
      },
    }) as TType;
  };

export type NodeGroupType =
  | "action"
  | "data"
  | "structure"
  | "placeholder"
  | "system";

export type createFn<TType extends INode> = (
  data?: Partial<Omit<TType, "id" | "type" | "version">> &
    Partial<{ [x: string]: any }>,
) => (treeClient: TTreeClient) => TType;

export type isAddableFn = (params: {
  getFeatureFlag: (flag: FeatureFlags) => boolean;
}) => boolean;

export type transformFn<TType extends INode> = <TNewType extends INode>(
  node: TType,
  data: TNewType,
) => (treeClient: TTreeClient) => TNewType;

export type canHaveTargetFn = (
  nodeId: TNodeId,
) => (treeClient: TTreeClient | TReadOnlyTreeClient) => boolean;

export type hasTargetFn = (
  nodeId: TNodeId,
) => (treeClient: TTreeClient | TReadOnlyTreeClient) => boolean;

export type transformNodeFn<TType extends INode> = (
  node: INode,
  data: any,
) => (
  treeClient: TTreeClient,
) => Extract<ReturnType<TTreeClient["nodes"]["transform"]>, Failure> | TType;

export type duplicateFn<TType extends INode> = (
  nodeId: TNodeId,
) => (treeClient: TTreeClient) => TType;

export type createVariableFn<
  TValues extends PrimitiveVariable | IFileVariable | IRichTextVariable,
  TValue = any,
> = (data: {
  nodeId: TNodeId;
  execution?: VariableExecutionStatus;
  value?: TValue;
}) => (treeClient: TTreeClient | TReadOnlyTreeClient) => {
  variable: IRecordVariable<TValues>;
  globalVariable?: Record<string, PrimitiveVariable>;
};

export type onInterpreterInitFn = (
  treeClient: TTreeClient,
) => { variable?: IRecordVariable } | undefined;

export type parseJSONFn<TType> = <TData extends INode>(json: TData) => TType;

export type ZNodePluginParams = TTreeClient | TReadOnlyTreeClient;

export const ZNodePlugin =
  <TType extends string>(type: TType) =>
  (treeClient: ZNodePluginParams) =>
    ZEntityPluginBase(z.literal(type)).extend({
      id: ZNodeId,
      position: z.object({
        x: z.number({}),
        y: z.number(),
      }),
      name: z.string(),
      parent: z.string().optional(),
      final: z.boolean(),
      rendererButtonLabel: z.string().optional(),
      isAddable: z.boolean().optional(),
      isRemoved: z.boolean().optional(),
      version: z.number(),
      pluginVersion: z.number(),
      edges: z.array(
        ZEdgeId.refine((edgeId) => treeClient.edges.has(edgeId), {
          message: "Edge does not exist on the tree.",
        }),
      ),
      fallbackEdge: ZEdgeId.optional().refine(
        (edgeId) => (edgeId ? treeClient.edges.has(edgeId) : true),
        {
          message: "Edge does not exist on the tree.",
        },
      ),
    });

export interface INode<TType extends string = string>
  extends IEntityBase<TType> {
  id: TNodeId;
  position: { x: number; y: number };
  name: string;
  parent?: string;
  final: boolean;
  isRemoved?: boolean;
  edges: TEdgeId[];
  fallbackEdge?: TEdgeId;
  version: number;
  pluginVersion: number;
  rendererButtonLabel?: string;
}

export abstract class NodePlugin<
  TType extends INode = INode,
> extends EntityPlugin<TType> {
  pluginType = "nodes" as const;
  isVisible = true;
  includeInSearch = true;
  blockGroup: NodeGroupType;
  abstract readonly hasAction: boolean;
  abstract readonly hasWebhook: boolean;
  abstract readonly hasRenderer: boolean;
  abstract readonly hasSidebar: boolean;
  abstract readonly hasCanvasNode: boolean;
  readonly isAlpha: boolean = false;

  isAddable: isAddableFn = () => true;

  shouldIncludeInNavigation(_: {
    node: TType;
    variables: Record<string, IRecordVariable>;
  }) {
    return true;
  }

  abstract create: createFn<TType>;

  constructor({
    blockGroup,
    ...params
  }: Omit<EntityConstructorParams<TType>, "treeMigrations"> & {
    blockGroup: NodeGroupType;
  }) {
    super({ ...params, treeMigrations: nodeMigrations });
    this.blockGroup = blockGroup;
  }

  subscribeToTreeEvents: (treeClient: TTreeClient) => string | undefined = () =>
    undefined;

  getSingle =
    (nodeId: TType["id"]) => (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.nodes.get.single<TType>(nodeId, this.type);

  getCollection =
    (nodeIds: TType["id"][]) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.nodes.get.collection<TType>(nodeIds, this.type);

  getAll = (treeClient: TTreeClient | TReadOnlyTreeClient) =>
    treeClient.nodes.get.allOfType<TType>(this.type);

  subscribeSingle =
    (nodeId: TType["id"]) => (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.nodes.get.single<TType>(nodeId, this.type);

  subscribeCollection =
    (nodeIds: TType["id"][]) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.nodes.get.collection<TType>(nodeIds, this.type);

  subscribeAll = (treeClient: TTreeClient | TReadOnlyTreeClient) =>
    treeClient.nodes.get.allOfType<TType>(this.type);

  delete = (nodeIds: TNodeId[]) => (treeClient: TTreeClient) => {
    treeClient.nodes.delete(nodeIds);
  };

  has =
    (nodeId: TNodeId) => (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      return treeClient.nodes.has(nodeId, this.type);
    };

  abstract createVariable: createVariableFn<
    PrimitiveVariable | IFileVariable | IRichTextVariable
  >;

  duplicate: duplicateFn<INode> = duplicateNode;

  onInterpreterInit?: onInterpreterInitFn;
}

export type TNodePluginGroup = Record<string, NodePlugin<any>>;

export const nodeGroupColorSchemes = {
  data: "colorScheme-primary",
  action: "colorScheme-secondary",
  structure: "colorScheme-tertiary",
  system: "colorScheme-gray",
  placeholder: "colorScheme-gray",
};
