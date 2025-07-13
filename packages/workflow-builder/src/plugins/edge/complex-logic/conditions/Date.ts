import type { TranslationFn } from "@mioto/locale";
import { z } from "zod";
import { ZCondition } from "./types";

export const dateOperators = (t: TranslationFn) =>
  (({
    before: {
      label: t("plugins.edge.complex-logic.date.before"),
      type: "short",
      comparator: true,
    },

    after: {
      label: t("plugins.edge.complex-logic.date.after"),
      type: "short",
      comparator: true,
    },

    at: {
      label: t("plugins.edge.complex-logic.date.at"),
      type: "short",
      comparator: true,
    }
  }) as const);

export const ZDateCondition = ZCondition("date").extend({
  operator: z.union([z.literal("before"), z.literal("after"), z.literal("at")]),
  comparator: z.string().optional(),
});

export type DateCondition = z.infer<typeof ZDateCondition>;
