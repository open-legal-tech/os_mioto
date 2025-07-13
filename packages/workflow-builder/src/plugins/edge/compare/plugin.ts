import { EdgePlugin, type IEdge } from "../../../tree/type/plugin/EdgePlugin";
import type {
  TReadOnlyTreeClient,
  TTreeClient,
} from "../../../tree/type/treeClient";
import { convertToComplexLogicEdge } from "./migrations/convertToComplexLogicEdge";

export const typeName = "compare" as const;

export type IDirectEdge = IEdge<typeof typeName>;

export class CompareEdgePlugin extends EdgePlugin<IDirectEdge> {
  readonly hasResolver = false;

  constructor() {
    super({
      type: typeName,
      pluginMigrations: [
        () => async () => undefined,
        () => async () => undefined,
        convertToComplexLogicEdge,
      ],
    });
  }

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

export const CompareEdge = new CompareEdgePlugin();
