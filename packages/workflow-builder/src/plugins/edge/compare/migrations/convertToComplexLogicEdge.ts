import { Failure } from "@mioto/errors";
import type { pluginMigrationFn } from "../../../../tree/type/migrations/createPluginMigration";
import { ComplexLogicEdge } from "../../complex-logic/exports/plugin";
import type { IDirectEdge } from "../plugin";

export const convertToComplexLogicEdge: pluginMigrationFn<IDirectEdge> =
  (treeClient) => async (edge) => {
    console.log(
      `Migrating ${edge.id} by converting the direct edge into a complex logic edge.`,
    );

    const newEdge = ComplexLogicEdge.create(
      {
        source: edge.source,
        target: edge.target,
      },
      { duplicate: false },
    )(treeClient);

    if (newEdge instanceof Failure) {
      return;
    }

    if (!edge.target) {
      return treeClient.edges.delete([edge.id]);
    }

    treeClient.edges.replace(edge.id, newEdge);
  };
