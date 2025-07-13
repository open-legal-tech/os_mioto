import type { TranslationFn } from "@mioto/locale";
import { z } from "zod";
import { ZCondition } from "./types";

export const selectOperatorKeys = ["=", "!=", "defined", "undefined"] as const;

export const selectOperators = (t: TranslationFn) =>
  ({
    "=": {
      label: t("plugins.edge.complex-logic.select.equal"),
      type: "long",
      comparator: true,
    },
    "!=": {
      label: t("plugins.edge.complex-logic.select.unequal"),
      type: "long",
      comparator: true,
    },
    defined: {
      label: t("plugins.edge.complex-logic.select.defined"),
      type: "short",
      comparator: false,
    },
    undefined: {
      label: t("plugins.edge.complex-logic.select.undefined"),
      type: "short",
      comparator: false,
    },
  }) as const satisfies Record<(typeof selectOperatorKeys)[number], any>;

export const ZSelectCondition = ZCondition("select").extend({
  operator: z.enum(selectOperatorKeys).optional(),
  comparator: z.array(z.string()).optional(),
});

export type SelectCondition = z.infer<typeof ZSelectCondition>;
