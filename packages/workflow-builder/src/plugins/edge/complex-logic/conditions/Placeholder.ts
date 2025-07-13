import { z } from "zod";
import { ZCondition } from "./types";

export const ZPlaceholderCondition = ZCondition("placeholder").extend({
  variablePath: z.never().optional(),
});

export type PlaceholderCondition = z.infer<typeof ZPlaceholderCondition>;
