"use client";
import { buttonClasses } from "@mioto/design-system/Button";
import { Notification } from "@mioto/design-system/Notification";
import Link from "next/link";
import {
  type LegalPages,
  latestLegalVersions,
  readableLegalNames,
} from "../../../../content/legal";
import { LegalConfirmationButton } from "./LegalConfirmationButton";

type Props = {
  dismiss: () => void;
  legalPage: LegalPages;
};

function LegalPageLink({ dismiss, legalPage }: Props) {
  return (
    <Link
      href={`/confirm/${legalPage}`}
      onClick={dismiss}
      className={buttonClasses({ variant: "tertiary" })}
      target="_blank"
    >
      {readableLegalNames[legalPage]} öffnen
    </Link>
  );
}

type LegalNotificationProps = {
  userPrivacyVersion: number;
  userTermsVersion: number;
};

export function LegalNotification({
  userPrivacyVersion,
  userTermsVersion,
}: LegalNotificationProps) {
  if (userPrivacyVersion < latestLegalVersions.privacyVersion) {
    Notification.add({
      Title: "Unsere Datenschutzerklärung hat sich geändert",
      Content:
        "Bitte besuche die neue Datenschutzerklärung und akzeptiere diese.",
      variant: "warning",
      duration: 99999,
      actions: ({ dismiss }) => (
        <>
          <LegalPageLink dismiss={dismiss} legalPage="privacy" />
          <LegalConfirmationButton
            name="privacy"
            version={latestLegalVersions.privacyVersion}
            onConfirm={dismiss}
          />
        </>
      ),
      key: "new-privacy",
    });
  }

  if (userTermsVersion < latestLegalVersions.termsVersion) {
    Notification.add({
      Title: "Unsere AGB haben sich geändert",
      Content: "Bitte besuche die neuen AGB und akzeptiere diese.",
      variant: "warning",
      duration: 99999,
      actions: ({ dismiss }) => (
        <>
          <LegalPageLink dismiss={dismiss} legalPage="terms" />
          <LegalConfirmationButton
            name="terms"
            version={latestLegalVersions.termsVersion}
            onConfirm={dismiss}
          />
        </>
      ),
      key: "new-terms",
    });
  }

  return null;
}
