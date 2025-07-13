"use client";

import { LoadingSpinner } from "@mioto/design-system/LoadingSpinner";
import { Stack } from "@mioto/design-system/Stack";
import Script from "next/script";
import type React from "react";
import { useState } from "react";
import { useBeforeUnload } from "./hooks";
import { restoreStore } from "./store";
import { SetupEventListeners } from "./utils/setup-event-listeners";

// DO NOT REMOVE THIS
// https://github.com/OfficeDev/office-js/issues/429#issuecomment-475011957
const { replaceState: REPLACE_STATE_CACHED, pushState: PUSH_STATE_CACHED } =
  globalThis.window.history;

export function Client({ children }: { children: React.ReactNode }) {
  const [isOfficeJsInitialized, setIsOfficeJsInitialized] = useState(false);
  const [officeScriptError, setOfficeScriptError] = useState<string | null>(
    null,
  );

  useBeforeUnload((e) => {
    e.preventDefault();

    if (isOfficeJsInitialized) {
      Office.context.document.settings.saveAsync();
    }
  });

  return (
    <>
      <Script
        src="https://appsforoffice.microsoft.com/lib/1.1/hosted/office"
        onReady={() => {
          Office.onReady()
            .then(() => {
              // https://github.com/OfficeDev/office-js/issues/429#issuecomment-475011957
              globalThis.window.history.replaceState = REPLACE_STATE_CACHED;
              globalThis.window.history.pushState = PUSH_STATE_CACHED;
            })
            .then(() => {
              restoreStore();
            })
            .then(() => {
              setIsOfficeJsInitialized(true);
            });
        }}
        onError={(error) => {
          setOfficeScriptError(JSON.stringify(error));
          setIsOfficeJsInitialized(false);
        }}
      />
      {officeScriptError && JSON.stringify(officeScriptError)}
      {isOfficeJsInitialized && !officeScriptError ? (
        <>
          {children}
          <SetupEventListeners />
        </>
      ) : (
        <Stack className="h-full" center>
          <LoadingSpinner />
        </Stack>
      )}
    </>
  );
}
