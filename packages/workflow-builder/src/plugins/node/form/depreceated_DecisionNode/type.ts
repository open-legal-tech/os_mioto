import { ZInputId } from "../../../../tree/id";
import {
  ZNodePlugin,
  type ZNodePluginParams,
} from "../../../../tree/type/plugin/NodePlugin";
import { DecisionNode } from "./plugin";

export const ZDecisionNode = (treeClient: ZNodePluginParams) =>
  ZNodePlugin(DecisionNode.type)(treeClient).extend({
    input: ZInputId,
  });
