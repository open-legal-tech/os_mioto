import type { Failure } from "@mioto/errors";
import { z } from "zod";
import { type TEdgeId, type TNodeId, ZEdgeId, ZNodeId } from "../../id";
import { edgeMigrations } from "../migrations/edgeMigrations";
import type { TReadOnlyTreeClient, TTreeClient } from "../treeClient";
import type { EdgeCreationRules } from "../validators/isValidEdge";
import {
  type EntityConstructorParams,
  EntityPlugin,
  type IEntityBase,
  ZEntityPluginBase,
} from "./EntityPlugin";

export type addEdgeFn = (edge: IEdge<any>) => (treeClient: TTreeClient) => void;

export type transformEdgeFn<TType extends IEdge> = (
  edge: IEdge,
  data: Omit<TType, "id" | "source" | "target">,
) => (
  treeClient: TTreeClient,
) => Extract<ReturnType<TTreeClient["edges"]["transform"]>, Failure> | TType;

export type createEdgeFn<TType extends IEdge> = (
  data: Pick<TType, "source" | "target"> & Partial<Omit<TType, "id">>,
  rules?: EdgeCreationRules,
) => (
  treeClient: TTreeClient,
) => Extract<ReturnType<TTreeClient["edges"]["create"]>, Failure> | TType;

export type ZEdgePluginParams = TTreeClient | TReadOnlyTreeClient;

export const ZEdgePlugin =
  <TType extends string>(type: TType) =>
  <TZodType extends z.ZodRawShape>(
    treeClient: ZEdgePluginParams,
    extension: TZodType,
  ) =>
    ZEntityPluginBase(z.literal(type))
      .extend({
        id: ZEdgeId,
        source: ZNodeId.refine(treeClient.nodes.has),
        target: ZNodeId.optional().refine((nodeId) =>
          nodeId ? treeClient.nodes.has(nodeId) : true,
        ),
        version: z.number(),
        pluginVersion: z.number(),
        direct: z.boolean().optional(),
      })
      .extend(extension)
      .superRefine((edge, ctx) => {
        if (edge.source && edge.id && !treeClient.nodes.has(edge.source)) {
          return ctx.addIssue({
            code: z.ZodIssueCode.unrecognized_keys,
            keys: [edge.id],
            message: "Edges source node does not exist.",
          });
        }

        if (edge.target && edge.id && !treeClient.nodes.has(edge.target)) {
          return ctx.addIssue({
            code: z.ZodIssueCode.unrecognized_keys,
            keys: [edge.id],
            message: "Edges target node does not exist.",
          });
        }

        if (!edge.source) {
          return ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Edge has no source node.",
          });
        }

        const sourceNode = treeClient.nodes.get.single(edge.source);

        if (
          edge.id &&
          !sourceNode.isRemoved &&
          !sourceNode.edges?.includes(edge.id) &&
          sourceNode.fallbackEdge !== edge.id
        ) {
          return ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Edge is not assigned to source nodes edges property.",
          });
        }
      });

export interface IEdge<TType extends string = string>
  extends IEntityBase<TType> {
  id: TEdgeId;
  source: TNodeId;
  target?: TNodeId;
  version: number;
  pluginVersion: number;
}

export abstract class EdgePlugin<
  TType extends IEdge = IEdge,
> extends EntityPlugin<TType> {
  pluginType = "edges" as const;
  abstract readonly hasResolver: boolean;

  constructor(params: Omit<EntityConstructorParams<TType>, "treeMigrations">) {
    super({ ...params, treeMigrations: edgeMigrations });
  }

  abstract create: (data: any) => (treeClient: TTreeClient) => TType | Failure;

  delete = (ids: TEdgeId[]) => (treeClient: TTreeClient) => {
    treeClient.edges.delete(ids);
  };

  getSingle =
    (edgeId: TType["id"]) => (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.edges.get.single<TType>(edgeId);
  getCollection =
    (edgeIds: TType["id"][]) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.edges.get.collection<TType>(edgeIds);

  getAll = (treeClient: TTreeClient | TReadOnlyTreeClient) =>
    treeClient.edges.get.allOfType<TType>(this.type);

  getByNode =
    (nodeId: TNodeId) => (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.edges.get.byNode<TType>(nodeId, this.type);

  subscribeSingle =
    (edgeId: TType["id"]) => (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.edges.get.single<TType>(edgeId);

  subscribeCollection =
    (edgeIds: TType["id"][]) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.edges.get.collection<TType>(edgeIds);

  subscribeAll = (treeClient: TTreeClient | TReadOnlyTreeClient) =>
    treeClient.edges.get.allOfType<TType>(this.type);

  subscribeByNode =
    (nodeId: TNodeId) => (treeClient: TTreeClient | TReadOnlyTreeClient) =>
      treeClient.edges.get.byNode<TType>(nodeId, this.type);
}

export type TEdgePluginGroup = Record<string, EdgePlugin>;
