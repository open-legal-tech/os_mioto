import { Heading, Text, Link } from "@react-email/components";
import { emailEnv } from "../env";
import React from "react";
import { EmailSheel } from "../utils/EmailShell";

export default function RegisterVerfication({ token }: { token: string }) {
  const resetPasswordLink = `${emailEnv.CLIENT_ENDPOINT}/auth/reset-password/${token}`;

  return (
    <EmailSheel title="Passwort zurücksetzen">
      <Heading>Passwort zurücksetzen</Heading>
      <Text>
        Du hast das Zurücksetzen deines Passworts angefordert. Bitte folge dem
        Link um fortzufahren.
      </Text>
      <Link href={resetPasswordLink}>Zurücksetzen</Link>
    </EmailSheel>
  );
}
