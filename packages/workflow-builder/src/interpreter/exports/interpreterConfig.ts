import { complexLogicEdgeResolver } from "../../plugins/edge/complex-logic/exports/resolver";
import { aiNodeAction } from "../../plugins/node/ai/exports/action";
import { AINode } from "../../plugins/node/ai/exports/plugin";
import { authenticationNodeAction } from "../../plugins/node/authentication/exports/action";
import { AuthenticationNode } from "../../plugins/node/authentication/exports/plugin";
import { calculationNodeAction } from "../../plugins/node/calculation/action";
import { CalculationNode } from "../../plugins/node/calculation/plugin";
import { documentNodev2Action } from "../../plugins/node/documentv2/action";
import { DocumentNode } from "../../plugins/node/documentv2/plugin";
import { reportingNodeAction } from "../../plugins/node/reporting/action";
import { ReportingNode } from "../../plugins/node/reporting/plugin";
import { textInterpolationAction } from "../../plugins/node/text-interpolation/action";
import { TextInterpolationNode } from "../../plugins/node/text-interpolation/plugin";
import type { TTreeClientWithPlugins } from "../../tree/createTreeClientWithPlugins";
import type { TNodeId } from "../../tree/id";
import type { EdgePlugin } from "../../tree/type/plugin/EdgePlugin";
import type { NodePlugin } from "../../tree/type/plugin/NodePlugin";
import type { TTreeClient } from "../../tree/type/treeClient";
import type { EVALUATE, EdgeResolver, INVALID_EXECUTION } from "../resolver";
import type {
  ExtractErrorCodesFromPluginActions,
  InterpreterConfig,
  Session,
} from "./interpreter";
import type { createInterpreterMethods } from "./methods";

type InterpreterAction = (
  params: InterpreterActionParams,
) => Promise<InterpreterActionReturn<any>>;

type PluginsWithResolvers<T extends Record<string, EdgePlugin>> = {
  [K in keyof T]: T[K]["hasResolver"] extends true ? K : never;
}[keyof T];

export type TPluginsWithResolvers = PluginsWithResolvers<
  TTreeClientWithPlugins["edgePlugins"]
>;

export const resolverFns = {
  "complex-logic": complexLogicEdgeResolver,
} satisfies Record<TPluginsWithResolvers, EdgeResolver<any, any>> as Record<
  TPluginsWithResolvers,
  EdgeResolver<any, any>
> & { [x: string]: EdgeResolver<any, any> };

type PluginsWithWebhooks<T extends Record<string, NodePlugin>> = {
  [K in keyof T]: T[K]["hasWebhook"] extends true ? K : never;
}[keyof T];

export type TPluginsWithWebhooks = PluginsWithWebhooks<
  TTreeClientWithPlugins["nodePlugins"]
>;

type TWebhookHandler = (params: {
  nodeId: TNodeId;
}) => Promise<InterpreterActionReturn<any>>;

export const webhookHandlers = {} satisfies Record<
  TPluginsWithWebhooks,
  TWebhookHandler
> as Record<TPluginsWithWebhooks, TWebhookHandler> & {
  [x: string]: TWebhookHandler;
};

export type TWebhookHandlers = typeof webhookHandlers;

type PluginsWithActions<T extends Record<string, NodePlugin>> = {
  [K in keyof T]: T[K]["hasAction"] extends true ? K : never;
}[keyof T];

export type TPluginsWithAction = PluginsWithActions<
  TTreeClientWithPlugins["nodePlugins"]
>;

const strictActions = {
  [DocumentNode.type]: documentNodev2Action,
  [ReportingNode.type]: reportingNodeAction,
  [CalculationNode.type]: calculationNodeAction,
  [TextInterpolationNode.type]: textInterpolationAction,
  [AuthenticationNode.type]: authenticationNodeAction,
  [AINode.type]: aiNodeAction,
  // This gives a type error if a plugin is added with hasAction = true and is not added here.
} satisfies Record<TPluginsWithAction, InterpreterAction>;

export type TActionErrors = ExtractErrorCodesFromPluginActions<
  typeof strictActions
>;

// We export the actions with a more permissive key type to allow for dynamic access.
export const actions = strictActions as Record<
  TPluginsWithAction,
  InterpreterAction
> & {
  [x: string]: InterpreterAction;
};

export const renderPlugins = {
  form: true,
  info: true,
  "system-globalVariables": false,
  decision: false,
  placeholder: false,
  reporting: false,
  logic: false,
  documentv2: false,
  "text-interpolation": false,
  ai: false,
  authentication: false,
  calculation: false,
  document: false,
} satisfies Record<
  keyof TTreeClientWithPlugins["nodePlugins"],
  boolean
> as Record<keyof TTreeClientWithPlugins["nodePlugins"], boolean> & {
  [x: string]: boolean;
};

export type InterpreterActionParams = {
  environment: InterpreterConfig["environment"];
  isInteractive?: boolean;
  isModule: boolean;
  nodeId: TNodeId;
  treeUuid: string;
  treeClient: TTreeClient;
  session: Session;
  userUuid: string;
  locale: string;
} & ReturnType<typeof createInterpreterMethods>;

export type InterpreterActionReturn<TErrorCodes extends string> =
  | EVALUATE
  | INVALID_EXECUTION<TErrorCodes>;
