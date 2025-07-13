import type { TranslationFn } from "@mioto/locale";
import { z } from "zod";
import { ZCondition } from "./types";

const numberOperatorKeys = [
  "=",
  "!=",
  ">",
  "<",
  ">=",
  "<=",
  "defined",
  "undefined",
] as const;

export const numberOperators = (t: TranslationFn) =>
  ({
    "=": {
      label: t("plugins.edge.complex-logic.number.equal"),
      type: "long",
      comparator: true,
    },
    "!=": {
      label: t("plugins.edge.complex-logic.number.unequal"),
      type: "long",
      comparator: true,
    },
    ">": {
      label: t("plugins.edge.complex-logic.number.larger"),
      type: "long",
      comparator: true,
    },
    "<": {
      label: t("plugins.edge.complex-logic.number.smaller"),
      type: "long",
      comparator: true,
    },
    ">=": {
      label: t("plugins.edge.complex-logic.number.larger-equal"),
      type: "long",
      comparator: true,
    },
    "<=": {
      label: t("plugins.edge.complex-logic.number.smaller-equal"),
      type: "long",
      comparator: true,
    },
    defined: {
      label: t("plugins.edge.complex-logic.number.defined"),
      type: "short",
      comparator: false,
    },
    undefined: {
      label: t("plugins.edge.complex-logic.number.undefined"),
      type: "short",
      comparator: false,
    },
  }) as const satisfies Record<(typeof numberOperatorKeys)[number], any>;

export const ZNumberCondition = ZCondition("number").extend({
  operator: z.enum(numberOperatorKeys).optional(),
  comparator: z.number().optional(),
});

export type NumberCondition = z.infer<typeof ZNumberCondition>;
