import { Failure } from "@mioto/errors";
import { emailClient } from "./shared";
import { emailEnv } from "../env";

export type SendEmailParams = {
  email: string;
  message: string;
  subject: string;
  attachments?: {
    name: string;
    contentType: string;
    contentInBase64: string;
  }[];
};

export const sendEmail = async ({
  email,
  message,
  subject,
  attachments,
}: SendEmailParams) => {
  if (!emailEnv.WITH_EMAIL_SERVICE) return { success: true };

  try {
    const poller = await emailClient.beginSend({
      recipients: { to: [{ address: email }] },
      senderAddress: emailEnv.SENDER_EMAIL,
      content: { subject, html: message, plainText: "" },
      attachments: attachments,
      disableUserEngagementTracking: true,
    });

    await poller.pollUntilDone();

    return { success: true };
  } catch (error: any) {
    console.log(error);
    return {
      success: false,
      error: new Failure({
        code: "email_sending_failed",
      }),
    };
  }
};
