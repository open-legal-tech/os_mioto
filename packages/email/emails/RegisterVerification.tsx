import { Heading, Text, Link } from "@react-email/components";
import { emailEnv } from "../env";
import React from "react";
import { EmailSheel } from "../utils/EmailShell";

export default function RegisterVerfication({ token }: { token: string }) {
  const verifyLink = `${emailEnv.CLIENT_ENDPOINT}/api/verify-email?token=${token}`;

  return (
    <EmailSheel title="Email bestätigen">
      <Heading>Willkommen</Heading>
      <Text>Bitte bestätige deine Registrierung bei Mioto.</Text>
      <Link href={verifyLink}>Verifizieren</Link>
    </EmailSheel>
  );
}
