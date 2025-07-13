import { z } from "zod";

export const emailVerificationTokenSchema = z.object({
  userUuid: z.string(),
  newsletter: z.boolean().optional(),
  previousEmail: z.string().email().optional(),
});

export type TEmailVerificationPayload = z.infer<
  typeof emailVerificationTokenSchema
>;
