import { Heading, Link, Text } from "@react-email/components";
import React from "react";
import { EmailSheel } from "../utils/EmailShell";
import { emailEnv } from "../env";

export default function CustomerEmailUpdate({
  newEmail,
  token,
  orgName,
}: {
  newEmail: string;
  token: string;
  orgName: string;
}) {
  const verifyLink = `${emailEnv.CLIENT_ENDPOINT}/api/verify-email?token=${token}`;

  return (
    <EmailSheel title="Email Änderung">
      <Heading>Email Änderung</Heading>
      <Text>
        Ein Admin von {orgName} hat deine Email Adresse zu {newEmail} geändert.
      </Text>
      <Link href={verifyLink}>Bestätigen</Link>
    </EmailSheel>
  );
}
