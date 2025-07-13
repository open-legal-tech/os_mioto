import type { TranslationFn } from "@mioto/locale";
import { z } from "zod";
import { ZCondition } from "./types";

export const booleanOperators = (
  t: TranslationFn,
  type: "block" | "variable",
) =>
  (({
    true: {
      label:
        type === "block"
          ? t("plugins.edge.complex-logic.boolean.true")
          : t("plugins.edge.complex-logic.boolean.variable.true"),
      type: "short",
    },

    false: {
      label:
        type === "block"
          ? t("plugins.edge.complex-logic.boolean.false")
          : t("plugins.edge.complex-logic.boolean.variable.false"),
      type: "short",
    }
  }) as const);

export const ZBooleanCondition = ZCondition("boolean").extend({
  operator: z.union([z.literal("true"), z.literal("false")]),
});

export type BooleanCondition = z.infer<typeof ZBooleanCondition>;
