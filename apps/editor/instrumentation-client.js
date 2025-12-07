import * as Sentry from "@sentry/nextjs";
import { beforeSend } from "./sentryShared";

Sentry.init({
  dsn: process.env.APP_ENV === "production" ? process.env.SENTRY_DSN : "",
  tracesSampleRate: 1,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
      networkDetailAllowUrls: [window.location.origin],
    }),
    Sentry.browserTracingIntegration(),
  ],
  replaysOnErrorSampleRate: 1.0,
  replaysSessionSampleRate: 0,
  normalizeDepth: 10,
  profilesSampleRate: 1.0,
  beforeSend,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
