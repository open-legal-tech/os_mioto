import type { TTree } from "../type-classes/Tree";

export type entityMigrationFunction = (
  tree: TTree,
) => (entity: any) => Promise<void>;

export const createEntityMigrationFn =
  (migrations: entityMigrationFunction[]): entityMigrationFunction =>
  (tree) =>
  async (entity) => {
    const migrationsToApply = migrations.slice(Math.max(entity.version - 1, 0));

    migrationsToApply.forEach(async (fn) => {
      await new Promise((resolve) => {
        fn(tree)(entity);

        setTimeout(resolve, 0);
      });
    });

    entity.version = migrations.length + 1;
  };
