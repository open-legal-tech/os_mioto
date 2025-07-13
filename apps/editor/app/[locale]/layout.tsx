import { getMessages, setRequestLocale } from "@mioto/locale/server";
import React from "react";
import "@xyflow/react/dist/style.css";
import "../../tailwind.css";
import { TooltipProvider } from "@mioto/design-system/Tooltip";
import { Roboto_Slab, Work_Sans } from "next/font/google";
import Script from "next/script";
import { QueryClientProvider } from "../shared/QueryClientProvider";
import { SystemProvider } from "../shared/SystemProvider";
import { NotificationProvider } from "./shared/Notification";
import StyledJsxRegistry from "./shared/registry";
import NextTopLoader from "nextjs-toploader";
import { routing } from "../../i18n/routing";
import { notFound } from "next/navigation";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

export default async function LocalizationLayout(props: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;

  const { children } = props;
  setRequestLocale(locale);

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`min-h-[100dvh] overflow-hidden h-full ${workSans.variable} ${robotoSlab.variable}`}
    >
      <body className={`h-full app-theme w-full bg-gray1`}>
        <SystemProvider locale={locale} messages={messages}>
          <Script async src="https://js.stripe.com/v3/buy-button.js" />
          <TooltipProvider>
            <StyledJsxRegistry>
              <QueryClientProvider>
                <React.Suspense>
                  <NotificationProvider />
                </React.Suspense>
                <NextTopLoader color="#10a39c" showSpinner={false} />
                <main className="h-full">{children}</main>
              </QueryClientProvider>
            </StyledJsxRegistry>
          </TooltipProvider>
        </SystemProvider>
      </body>
    </html>
  );
}
