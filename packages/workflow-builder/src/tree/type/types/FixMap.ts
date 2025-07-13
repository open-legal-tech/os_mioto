import type { z } from "zod";

export type Unfixable = {
  type: "unfixable";
  issue: z.ZodIssue;
};

export type Fix = {
  type: "fix";
  issue: z.ZodIssue;
  userMessage?: string;
};
export type FixMap = Map<z.ZodIssue, Fix | Unfixable | undefined>;
