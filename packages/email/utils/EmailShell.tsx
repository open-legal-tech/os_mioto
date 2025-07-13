import { Html, Font, Head, Body, Img } from "@react-email/components";
import React from "react";
import { emailEnv } from "../env";

export function EmailSheel({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <Html>
      <Font
        fontFamily="WorkSans"
        fallbackFontFamily="Verdana"
        webFont={{
          url: "https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,500;1,500&display=swap",
          format: "woff2",
        }}
        fontWeight={400}
        fontStyle="normal"
      />
      <Head>
        <title>{title}</title>
        <link
          rel="stylesheet"
          href={`${emailEnv.DOCS_ENDPOINT}/email-styles.css`}
        />
      </Head>
      <Body>
        <main>
          <Img
            src={`${emailEnv.DOCS_ENDPOINT}/icons/icon-64.png`}
            height={36}
            width={36}
          />
          {children}
        </main>
      </Body>
    </Html>
  );
}
