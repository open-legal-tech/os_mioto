import { ZNodePlugin } from "../../../../tree/type/plugin/NodePlugin";
import type { TTreeClient } from "../../../../tree/type/treeClient";
import { AuthenticationNode } from "./plugin";

export const ZAuthenticationNode = (treeClient: TTreeClient) =>
  ZNodePlugin(AuthenticationNode.type)(treeClient).extend({});
