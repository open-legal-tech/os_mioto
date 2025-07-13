"use server";

import { sendEmail, type SendEmailParams } from "@mioto/email/sendEmail";

export async function sendEmailAction(params: SendEmailParams) {
  return await sendEmail(params);
}
