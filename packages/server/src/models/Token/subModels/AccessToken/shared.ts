import { z } from "zod";

export const accessTokenSchema = z.object({
  userUuid: z.string(),
  orgSlug: z.string().optional(),
});

export type TAccessTokenPayload = z.infer<typeof accessTokenSchema>;
