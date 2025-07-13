import * as Sentry from "@sentry/nextjs";
import { beforeSend } from "./sentryShared";

export function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init({
      dsn: process.env.APP_ENV === "production" ? process.env.SENTRY_DSN : "",
      tracesSampleRate: 1,
      integrations: [],
      profilesSampleRate: 1,
      beforeSend,
    });
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({
      dsn: process.env.APP_ENV === "production" ? process.env.SENTRY_DSN : "",
      tracesSampleRate: 1,
      beforeSend,
    });
  }
}

export const onRequestError = Sentry.captureRequestError;