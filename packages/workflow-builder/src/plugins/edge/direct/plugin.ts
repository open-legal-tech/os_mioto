import { EdgePlugin, type IEdge } from "../../../tree/type/plugin/EdgePlugin";
import type {
  TReadOnlyTreeClient,
  TTreeClient,
} from "../../../tree/type/treeClient";
import { convertToComplexLogicEdge } from "./migrations/convertToComplexLogicEdge";

export const typeName = "direct" as const;

export type IDirectEdge = IEdge<typeof typeName>;

export class DirectEdgePlugin extends EdgePlugin<IDirectEdge> {
  readonly hasResolver = false;

  constructor() {
    super({
      type: typeName,
      pluginMigrations: [
        () => async () => undefined,
        convertToComplexLogicEdge,
      ],
    });
  }

  transform =
    (
      edge: IEdge,
      data: Omit<
        IDirectEdge,
        "source" | "target" | "type" | "version" | "id" | "pluginVersion"
      >,
    ) =>
    (treeClient: TTreeClient) => {
      return treeClient.edges.transform<IDirectEdge>(edge, {
        ...data,
        type: this.type,
        version: this.version,
        pluginVersion: this.pluginVersion,
      });
    };

  create =
    (data: Omit<IDirectEdge, "id" | "type" | "version" | "pluginVersion">) =>
    (treeClient: TTreeClient | TReadOnlyTreeClient) => {
      return treeClient.edges.create<IDirectEdge>({
        type: this.type,
        version: this.version,
        pluginVersion: this.pluginVersion,
        ...data,
      });
    };
}

export const DirectEdge = new DirectEdgePlugin();
