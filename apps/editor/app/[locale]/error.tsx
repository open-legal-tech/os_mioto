"use client";

import * as Sentry from "@sentry/nextjs";
import * as React from "react";
import { ErrorPage } from "../shared/error/Error/Error";
import { generateMiotoMetadata } from "../shared/generateMiotoMetadata";

export const metadata = generateMiotoMetadata((t) => {
  return {
    title: t("error.pageTitle"),
  };
});

export default function Page({
  reset,
  error,
}: {
  error: Error;
  reset: () => void;
}) {
  React.useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return <ErrorPage className="h-[100dvh]" reset={reset} />;
}
