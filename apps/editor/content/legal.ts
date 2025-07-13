import { LegalDocumentVersions } from "@mioto/server/User/shared";

export type LegalPages = "privacy" | "terms" | "imprint";

export const readableLegalNames: Record<LegalPages, string> = {
  privacy: "Datenschutzerklärung",
  terms: "AGB",
  imprint: "Impressum",
};

export const latestLegalVersions = LegalDocumentVersions.parse({
  privacyVersion: 2,
  termsVersion: 2,
});
