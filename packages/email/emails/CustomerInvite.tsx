import { Heading, Link, Text } from "@react-email/components";
import React from "react";
import { EmailSheel } from "../utils/EmailShell";

export default function CustomerInvite({
  inviteLink,
  orgName,
}: {
  inviteLink: string;
  orgName: string | null;
}) {
  return (
    <EmailSheel title="Einladung zu Mioto">
      <Heading>Einladung zu Mioto</Heading>
      <Text>Du wurdest zur Organisation {orgName} in Mioto eingeladen.</Text>
      <Link href={inviteLink}>Annehmen</Link>
    </EmailSheel>
  );
}
