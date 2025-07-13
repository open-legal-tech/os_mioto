"use client";

import { Button } from "@mioto/design-system/Button";
import Heading from "@mioto/design-system/Heading";
import { Stack } from "@mioto/design-system/Stack";
import { useTranslations } from "@mioto/locale";
import * as Sentry from "@sentry/nextjs";
import React from "react";

export const metadata = {
  title: `Fehler | Mioto`,
};

export default function ClientNotFound({
  reset,
  error,
}: {
  error: Error;
  reset: () => void;
}) {
  React.useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  const t = useTranslations();

  return (
    <Stack center className="h-full">
      <Stack className="border border-gray5 p-5 rounded-md bg-white gap-4">
        <Heading>{t("client-portal.error.title")}</Heading>
        <Button onClick={() => reset()}>
          {t("client-portal.error.refreshButton")}
        </Button>
      </Stack>
    </Stack>
  );
}
