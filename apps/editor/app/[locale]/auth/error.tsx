"use client";

import { InfoBox } from "@mioto/design-system/InfoBox";
import { Stack } from "@mioto/design-system/Stack";
import { useTranslations } from "@mioto/locale";
import * as Sentry from "@sentry/nextjs";
import React from "react";

export default function AuthError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  const t = useTranslations();

  return (
    <Stack className="max-w-[500px] flex-1 justify-center">
      <InfoBox
        role="alert"
        variant="danger"
        Title={t("auth.error.title")}
        Content={t("auth.error.content")}
      />
    </Stack>
  );
}
