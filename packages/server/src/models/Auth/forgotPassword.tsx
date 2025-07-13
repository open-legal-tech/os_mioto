import {
  type ExcludeFailures,
  type ExtractFailures,
  Failure,
} from "@mioto/errors";
import { z } from "zod";
import { createPasswordResetToken } from "../Token/subModels/ResetPasswordToken/create";
import { sendEmail } from "@mioto/email/sendEmail";
import { render } from "@mioto/email/render";
import PasswordReset from "@mioto/email/PasswordReset";
import type { DB } from "../../db/types";

export const forgotPassword =
  (db: DB) => async (input: TForgotPasswordInput) => {
    const resetPasswordToken = await createPasswordResetToken(db)({
      email: input.email,
    });

    if (resetPasswordToken instanceof Failure) return resetPasswordToken;

    await sendEmail({
      message: await render(<PasswordReset token={resetPasswordToken} />),
      email: input.email,
      subject: "Passwort zurücksetzen",
    }).catch(console.error);

    return { success: true };
  };

export const forgotPasswordInput = z.object({
  email: z.string(),
  type: z.enum(["customer", "employee"]),
});

export type TForgotPasswordInput = z.infer<typeof forgotPasswordInput>;

export type TForgotPasswordFailures = ExtractFailures<typeof forgotPassword>;

export type TForgotPasswordData = ExcludeFailures<typeof forgotPassword>;

export type TForgotPasswordOutput = Awaited<ReturnType<typeof forgotPassword>>;
