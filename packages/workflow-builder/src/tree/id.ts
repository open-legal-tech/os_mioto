import { z } from "zod";

export type TId<TEntity extends string = string> = `${TEntity}_${string}`;

export const ZEntityId = z.custom<TId>((value) => {
  if (!(typeof value === "string")) {
    return false;
  }

  const [entity, id] = value.split("_");

  return (entity?.length ?? 0) > 0 && z.string().safeParse(id).success;
}, "Invalid id");

export type TChildId = `${TNodeId}__${TId}`;

export type TMainChildId = `${TNodeId}__${TNodeId}`;

export const ZChildId = z.custom<TChildId>((value) => {
  if (!(typeof value === "string")) {
    return false;
  }

  const [parentId, childId] = value.split("__");
  return isNodeId(parentId) && isId(childId);
}, "Invalid child id");

export const ZMainChildId = z.custom<TMainChildId>((value) => {
  if (!(typeof value === "string")) {
    return false;
  }

  const [parentId, repeatedParentId] = value.split("__");
  return isNodeId(parentId) && isNodeId(repeatedParentId);
}, "Invalid main child id");

export const isChildId = (value: any): value is TChildId => {
  return ZChildId.safeParse(value).success;
};

export const isMainChildId = (value: any): value is TChildId => {
  return ZMainChildId.safeParse(value).success;
};

export const isId = (value: any): value is TId => {
  return (
    ZEntityId.safeParse(value).success || ZChildId.safeParse(value).success
  );
};

export type TNodeId = TId<"node">;

export const ZNodeId = z.custom<TNodeId>((value) => {
  if (!(typeof value === "string")) return false;

  const [entity, id] = value.split("_");

  return (
    (entity === "nodes" || entity === "node") &&
    z.string().safeParse(id).success
  );
}, "Invalid node id");

export const isNodeId = (value: any): value is TNodeId => {
  return ZNodeId.safeParse(value).success;
};

export type TEdgeId = TId<"edge">;

export const ZEdgeId = z.custom<TEdgeId>((value) => {
  if (!(typeof value === "string")) return false;

  const [entity, id] = value.split("_");

  return (
    (entity === "edges" || entity === "edge") &&
    z.string().uuid().safeParse(id).success
  );
}, "Invalid edge id");

export const isEdgeId = (value: any): value is TEdgeId => {
  return ZEdgeId.safeParse(value).success;
};

export const ZInputId = z.custom<TInputId>((value) => {
  if (!(typeof value === "string")) return false;

  const [entity, id] = value.split("_");

  return (
    (entity === "inputs" || entity === "input") &&
    z.string().uuid().safeParse(id).success
  );
}, "Invalid input id");

export type TInputId = TId<"input">;
