import type { TranslationFn } from "@mioto/locale";
import Fuse from "fuse.js";
import { z } from "zod";
import type { EdgeResolver } from "../../../../interpreter/resolver";
import type { ITextVariable } from "../../../../variables/exports/types";
import type { Chain, IComplexLogicEdge } from "../exports/plugin";
import { ZCondition } from "./types";

const fuzzySearch = (pattern: string, text: string) => {
  const fuse = new Fuse([text], {
    includeScore: true,
    distance: Number.POSITIVE_INFINITY,
  });
  const result = fuse.search(pattern);

  return result.some((r) => (r.score ?? 1) <= 0.5);
};

const textOperatorKeys = [
  "=",
  "!=",
  "contains",
  "not_contains",
  "defined",
  "undefined",
] as const;

export const textOperators = (t: TranslationFn) =>
  ({
    "=": {
      label: t("plugins.edge.complex-logic.text.equal"),
      type: "long",
      comparator: true,
    },
    "!=": {
      label: t("plugins.edge.complex-logic.text.unequal"),
      type: "long",
      comparator: true,
    },
    contains: {
      label: t("plugins.edge.complex-logic.text.contains"),
      type: "short",
      comparator: true,
    },
    not_contains: {
      label: t("plugins.edge.complex-logic.text.not-contain"),
      type: "short",
      comparator: true,
    },
    defined: {
      label: t("plugins.edge.complex-logic.text.defined"),
      type: "short",
      comparator: false,
    },
    undefined: {
      label: t("plugins.edge.complex-logic.text.undefined"),
      type: "short",
      comparator: false,
    },
  }) as const satisfies Record<(typeof textOperatorKeys)[number], any>;

export const ZTextCondition = ZCondition("text").extend({
  operator: z.enum(textOperatorKeys).optional(),
  comparator: z.string().optional(),
});

export type TextCondition = z.infer<typeof ZTextCondition>;

const checkTextCondition = (
  variable: ITextVariable,
  condition: TextCondition,
) => {
  console.log(variable.value, condition.comparator);
  if (condition.operator === "defined" && variable.value != null) return true;
  if (condition.operator === "undefined" && variable.value == null) return true;

  // From this point we expect a value to be set
  if (!variable?.value) return false;

  if (condition.operator === "contains" && condition.comparator) {
    return fuzzySearch(condition.comparator, variable.value);
  }

  if (condition.operator === "not_contains" && condition.comparator) {
    return !fuzzySearch(condition.comparator, variable.value);
  }

  if (
    condition.operator === "=" &&
    condition.comparator &&
    variable.value === condition.comparator
  ) {
    return true;
  }

  if (
    condition.operator === "!=" &&
    condition.comparator &&
    variable.value !== condition.comparator
  ) {
    return true;
  }

  return false;
};

export const evaluateText =
  (condition: TextCondition, chain: Chain, edge: IComplexLogicEdge) =>
  (
    variable: ITextVariable,
  ): ReturnType<ReturnType<EdgeResolver>> | { readonly state: "next" } => {
    if (checkTextCondition(variable, condition)) {
      if (chain === "and") return { state: "next" } as const;
      if (!edge.target) return { state: "failure" } as const;

      return { state: "success", target: edge.target } as const;
    }

    return { state: "failure" } as const;
  };
