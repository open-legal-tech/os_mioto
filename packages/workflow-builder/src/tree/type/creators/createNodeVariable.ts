import type { ValuesType } from "utility-types";
import {
  type IRecordVariable,
  RecordVariable,
  type createRecordVariableData,
} from "../../../variables/exports/types";
import type { INode } from "../plugin/NodePlugin";

export const createNodeVariable = <
  TValues extends ValuesType<IRecordVariable["value"]>,
>(
  node: INode,
  data: Omit<createRecordVariableData<TValues>, "name" | "id" | "status">,
) => {
  return RecordVariable.create({
    id: node.id,
    name: node.name,
    status: node.isRemoved ? "missing" : "ok",
    ...data,
  });
};
