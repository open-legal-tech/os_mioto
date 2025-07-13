import type { getVariables as getInterpreterVariables } from "../../interpreter/exports/methods";
import { acceptedVariableTypes } from "../../rich-text-editor/exports/types";
import type {
  IFileVariable,
  IRichTextVariable,
  PrimitiveVariable,
} from "../../variables/exports/types";

export function getRichTextVariables(
  getVariables: ReturnType<typeof getInterpreterVariables>,
) {
  const variables = getVariables({
    filterPrimitives: (variable): variable is PrimitiveVariable =>
      acceptedVariableTypes.includes(variable.type),
  });

  const fileVariables = getVariables({
    filterPrimitives: (variable): variable is IFileVariable =>
      variable.type === "file",
  });

  const richTextVariables = getVariables({
    filterPrimitives: (variable): variable is IRichTextVariable =>
      variable.type === "rich-text",
  });

  return {
    variables,
    fileVariables,
    richTextVariables,
  };
}
