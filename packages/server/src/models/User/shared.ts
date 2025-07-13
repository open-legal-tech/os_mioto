import { z } from "zod";

export const LegalDocumentVersions = z.object({
  termsVersion: z.number(),
  privacyVersion: z.number(),
});

export type LegalDocumentVersions = z.infer<typeof LegalDocumentVersions>;
