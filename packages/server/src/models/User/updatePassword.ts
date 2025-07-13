import {
  type ExcludeFailures,
  type ExtractFailures,
  Failure,
} from "@mioto/errors";
import { omit } from "remeda";
import { z } from "zod";
import { isStrongPassword } from "../Auth/validatePasswordStrength";
import { hashPassword } from "../Auth/hasPassword";
import type { DB } from "../../db/types";

export const updateUserPassword =
  (db: DB) =>
  async ({ newPassword, uuid }: TInput) => {
    const validatedPassword = await isStrongPassword(newPassword);

    if (validatedPassword.score < 3)
      return new Failure({
        code: "weak_password",
      });

    const password = await hashPassword(newPassword);

    const updatedUser = await db.account.update({
      where: { userUuid: uuid },
      data: { password },
    });

    return omit(updatedUser, ["password"]);
  };

export const updateUserPasswordInput = z.object({
  uuid: z.string().uuid(),
  newPassword: z.string(),
});

export type TInput = z.infer<typeof updateUserPasswordInput>;

export type TFailures = ExtractFailures<typeof updateUserPassword>;

export type TData = ExcludeFailures<typeof updateUserPassword>;

export type TOutput = Awaited<ReturnType<typeof updateUserPassword>>;
