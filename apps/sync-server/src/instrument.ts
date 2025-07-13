import * as Sentry from "@sentry/node";
import { syncServerEnv } from "../env";

Sentry.init({
  dsn: syncServerEnv.SENTRY_DSN,
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
});