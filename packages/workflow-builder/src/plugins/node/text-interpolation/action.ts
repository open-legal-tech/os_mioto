"use server";

import type { InterpreterActionParams } from "../../../interpreter/exports/interpreterConfig";
import { generateHtml } from "../../../rich-text-editor/exports/RichText/transformers/html";
import { getText } from "../../../rich-text-editor/exports/RichText/transformers/text";
import { convertToRichTextJson } from "../../../rich-text-editor/exports/RichText/transformers/yFragment";
import type {
  IFileVariable,
  PrimitiveVariable,
} from "../../../variables/exports/types";
import { TextInterpolationNode } from "./plugin";

export const textInterpolationAction = async ({
  nodeId,
  treeClient,
  getVariables,
  locale,
}: InterpreterActionParams) => {
  const variables = getVariables({
    filterPrimitives: (variable): variable is PrimitiveVariable =>
      variable.type === "number" ||
      variable.type === "text" ||
      variable.type === "select",
  });

  const fileVariables = getVariables({
    filterPrimitives: (variable): variable is IFileVariable =>
      variable.type === "file",
  });

  const yContent = treeClient.nodes.get.yNode(nodeId).get("yContent");
  const json = convertToRichTextJson(yContent);

  const html = generateHtml({
    json,
    variables,
    locale,
  });

  const text = getText({
    json,
    variables,
    fileVariables,
    locale,
  });

  const node = TextInterpolationNode.getSingle(nodeId)(treeClient);

  const variable = TextInterpolationNode.createVariable({
    nodeId,
    execution: "success",
    value: node.isFormatted ? { value: json, readableValue: html } : text,
  })(treeClient).variable;

  return { type: "EVALUATE", variable, nodeId } as const;
};
