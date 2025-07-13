import {
  ZNodePlugin,
  type ZNodePluginParams,
} from "../../../tree/type/plugin/NodePlugin";
import { PlaceholderNode } from "./plugin";

export const ZPlaceholderNode = (treeClient: ZNodePluginParams) =>
  ZNodePlugin(PlaceholderNode.type)(treeClient);
