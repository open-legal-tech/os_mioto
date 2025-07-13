import { z } from "zod";

export const anonymusUserTokenSchema = z.object({
  userUuid: z.string(),
});

export type TAnonymusUserTokenPayload = z.infer<typeof anonymusUserTokenSchema>;
