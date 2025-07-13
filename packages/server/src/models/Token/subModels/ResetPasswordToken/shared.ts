import { z } from "zod";

export const resetPasswordSchema = z.object({
  userUuid: z.string(),
});

export type TResetPasswordPayload = z.infer<typeof resetPasswordSchema>;
