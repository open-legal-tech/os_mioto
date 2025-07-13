// import { ReactPlugin } from "@microsoft/applicationinsights-react-js";
// import { ApplicationInsights } from "@microsoft/applicationinsights-web";
// import builderEnv from "../../env";

// const reactPlugin = new ReactPlugin();
// const appInsights = new ApplicationInsights({
//   config: {
//     connectionString: builderEnv.APPLICATIONINSIGHTS_CONNECTION_STRING,
//     extensions: [reactPlugin],
//     enableAutoRouteTracking: true,
//     disableAjaxTracking: false,
//     autoTrackPageVisitTime: true,
//     enableCorsCorrelation: true,
//     enableRequestHeaderTracking: true,
//     enableResponseHeaderTracking: true,
//   },
// });
// appInsights.loadAppInsights();

// appInsights.addTelemetryInitializer((env) => {
//   env.tags = env.tags || [];
//   env.tags["ai.cloud.role"] = "testTag";
// });

// export { reactPlugin, appInsights };
