import { Failure } from "@mioto/errors";
import type { TEdgeId } from "../../../../../tree/id";
import {
  EdgePlugin,
  type IEdge,
} from "../../../../../tree/type/plugin/EdgePlugin";
import type { TTreeClient } from "../../../../../tree/type/treeClient";

export const typeName = "compare" as const;

export interface ICompareEdge extends IEdge<typeof typeName> {
  condition: {
    variableId: string;
    valueIds: string[];
  };
}

export class CompareEdgePlugin extends EdgePlugin<ICompareEdge> {
  override readonly hasResolver = false;

  constructor() {
    super({ type: typeName, pluginMigrations: [] });
  }

  create =
    (
      data: Partial<Omit<ICompareEdge, "id" | "type" | "version">> &
        Pick<ICompareEdge, "source" | "target">,
    ) =>
    (treeClient: TTreeClient) => {
      const newEdge = treeClient.edges.create<ICompareEdge>({
        type: this.type,
        condition: {
          variableId: "",
          valueIds: [],
        },
        version: this.version,
        pluginVersion: this.pluginVersion,
        ...data,
      });

      if (newEdge instanceof Failure) {
        return newEdge;
      }

      return newEdge satisfies ICompareEdge;
    };

  addValue =
    (edgeId: TEdgeId, newValue: string) => (treeClient: TTreeClient) => {
      const edge = this.getSingle(edgeId)(treeClient);

      if (!edge) return;

      edge.condition?.valueIds.push(newValue);
    };

  updateValue =
    (edgeId: TEdgeId, index: number, newValue: string) =>
    (treeClient: TTreeClient) => {
      const edge = this.getSingle(edgeId)(treeClient);

      if (!edge) return;

      edge.condition.valueIds[index] = newValue;
    };

  removeValue =
    (edgeId: TEdgeId, index: number) => (treeClient: TTreeClient) => {
      const edge = this.getSingle(edgeId)(treeClient);

      if (!edge) return;

      edge.condition.valueIds.splice(index, 1);
    };
}

export const CompareEdge = new CompareEdgePlugin();
