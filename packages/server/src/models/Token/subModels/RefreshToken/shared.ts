import { z } from "zod";

export const refreshTokenSchema = z.object({
  userUuid: z.string(),
  orgSlug: z.string().optional(),
});

export type TRefreshTokenPayload = z.infer<typeof refreshTokenSchema>;
