import { EmailClient } from "@azure/communication-email";
import { emailEnv } from "../env";

export const emailClient = new EmailClient(
  emailEnv.AZURE_EMAIL_CONNECTION_STRING,
);
