import { z } from "zod";
import { ZEdgeId } from "../../../tree/id";
import {
  ZNodePlugin,
  type ZNodePluginParams,
} from "../../../tree/type/plugin/NodePlugin";
import { logicNodeType } from "./plugin";

export const ZLogicNode = (treeClient: ZNodePluginParams) =>
  ZNodePlugin(logicNodeType)(treeClient).extend({
    edges: z.array(ZEdgeId),
  });
