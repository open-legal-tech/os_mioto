"use client";

import * as Sentry from "@sentry/nextjs";
import { Roboto_Slab, Work_Sans } from "next/font/google";
import * as React from "react";
import { ErrorPage } from "./shared/error/Error/Error";
import "../tailwind.css";
import { TooltipProvider } from "@mioto/design-system/Tooltip";
import de from "@mioto/locale/de";
import { SystemProvider } from "./shared/SystemProvider";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--fontFamily-sans",
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--fontFamily-serif",
  display: "swap",
});

export const metadata = {
  title: `Fehler | Mioto`,
};

// The reset function is not working here: https://github.com/vercel/next.js/issues/55462
export default function Page({ error }: { error: Error; reset: () => void }) {
  React.useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html
      lang="de"
      className={`min-h-[100dvh] overflow-hidden h-full ${workSans.variable} ${robotoSlab.variable}`}
    >
      <body className={`h-full app-theme w-full bg-gray1`}>
        <SystemProvider locale="de" messages={de}>
          <TooltipProvider>
            <ErrorPage
              reset={() => {
                if (typeof window !== "undefined") {
                  window.location.reload();
                }
              }}
            />
          </TooltipProvider>
        </SystemProvider>
      </body>
    </html>
  );
}
