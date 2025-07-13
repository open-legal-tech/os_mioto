import type { TranslationFn } from "@mioto/locale";
import type { Map as YMap } from "yjs";
import type { IEdge } from "../plugin/EdgePlugin";
import type { INode } from "../plugin/NodePlugin";
import type { TTreeClient } from "../treeClient";

export type pluginMigrationFn<TOldType extends INode | IEdge = INode | IEdge> =
  (
    treeClient: TTreeClient,
    yMap: YMap<any>,
    t: TranslationFn,
  ) => (entity: TOldType, yEntity: YMap<any>) => Promise<void>;

export const createPluginMigrationFn =
  <TOldType extends INode | IEdge = INode | IEdge>(
    migrations: pluginMigrationFn<TOldType>[],
  ): pluginMigrationFn<TOldType> =>
  (treeClient, yMap, t) =>
  async (entity, yEntity) => {
    const migrationsToApply = migrations.slice(
      Math.max(entity.pluginVersion - 1, 0),
    );

    for (const migration of migrationsToApply) {
      await new Promise((resolve) => {
        migration(treeClient, yMap, t)(entity, yEntity);
        entity.pluginVersion = (entity.pluginVersion ?? 0) + 1;

        setTimeout(resolve, 0);
      });
    }
  };
