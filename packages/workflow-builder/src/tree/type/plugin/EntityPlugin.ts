import { z } from "zod";
import { type TId, ZEntityId } from "../../id";
import type { entityMigrationFunction } from "../migrations/createMigrationFn";
import {
  createPluginMigrationFn,
  type pluginMigrationFn,
} from "../migrations/createPluginMigration";
import type { TReadOnlyTreeClient, TTreeClient } from "../treeClient";

export const ZEntityPluginBase = <TType extends z.ZodTypeAny>(type: TType) =>
  z.object({
    id: ZEntityId,
    type,
  });

export interface IEntityBase<TType extends string = string> {
  id: TId;
  type: TType;
}

export type EntityConstructorParams<TType extends IEntityBase = IEntityBase> = {
  type: TType["type"];
  pluginMigrations: pluginMigrationFn<any>[];
  treeMigrations: entityMigrationFunction[];
};

export abstract class EntityPlugin<TType extends IEntityBase = IEntityBase> {
  type: TType["type"];
  abstract pluginType: "edges" | "nodes" | "system-nodes";
  pluginMigrations: pluginMigrationFn<any>[] = [];
  treeMigrations: entityMigrationFunction[] = [];
  version: number;
  pluginVersion: number;

  constructor({
    type,
    pluginMigrations,
    treeMigrations,
  }: EntityConstructorParams) {
    this.type = type;

    this.pluginVersion = pluginMigrations.length + 1;
    this.version = treeMigrations.length + 1;

    this.pluginMigrations = pluginMigrations;
    this.treeMigrations = treeMigrations;
  }

  abstract delete: (ids: TType["id"][]) => (treeClient: TTreeClient) => void;

  abstract getSingle: (
    id: TType["id"],
  ) => (treeClient: TTreeClient | TReadOnlyTreeClient) => TType | undefined;

  abstract getCollection: (
    ids: TType["id"][],
  ) => (
    treeClient: TTreeClient | TReadOnlyTreeClient,
  ) => Record<string, TType> | undefined;

  abstract getAll: (
    treeClient: TTreeClient | TReadOnlyTreeClient,
  ) => Record<string, TType> | undefined;

  get migrate() {
    return createPluginMigrationFn(this.pluginMigrations);
  }
}
