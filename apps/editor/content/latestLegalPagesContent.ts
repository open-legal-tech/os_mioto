import ImprintContent from "./imprint/imprint-latest.mdx";
import type { LegalPages } from "./legal";
import PrivacyContent from "./privacy/privacy-latest.mdx";
import TermsContent from "./terms/terms-latest.mdx";

import type { JSX } from "react";

export const latestLegalPagesContent: Record<
  LegalPages,
  (props: any) => JSX.Element
> = {
  privacy: PrivacyContent,
  terms: TermsContent,
  imprint: ImprintContent,
};
