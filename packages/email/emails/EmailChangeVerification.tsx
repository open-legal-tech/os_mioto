import { Heading, Text, Link } from "@react-email/components";
import { emailEnv } from "../env";
import React from "react";
import { EmailSheel } from "../utils/EmailShell";

export default function RegisterVerfication({ token }: { token: string }) {
  const verifyLink = `${emailEnv.CLIENT_ENDPOINT}/api/verify-email?token=${token}`;

  return (
    <EmailSheel title="Email geändert">
      <Heading>Email geändert</Heading>
      <Text>Bitte bestätige deine geändert Email für Mioto.</Text>
      <Link href={verifyLink}>Bestätigen</Link>
    </EmailSheel>
  );
}
