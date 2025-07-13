import withNextIntl from "@mioto/locale/plugin";
import withMDX from "@next/mdx";
import { withSentryConfig } from "@sentry/nextjs";

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,

  async headers() {
    return [
      {
        source: "/ingest/:path*",
        headers: [
          {
            key: "Host",
            value: "eu.posthog.com",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://eu-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://eu.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://eu.i.posthog.com/decide",
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/auroa",
        destination: "https://auroa.mioto.app/auroa",
        permanent: false,
      },
      {
        source: "/public/:path*",
        destination: "/render/:path*",
        permanent: true,
      },
    ];
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  compress: !process.env.DISABLE_OPTIMIZE ?? true,
  serverExternalPackages: [
    "chromiumly",
    "@zenstackhq/runtime",
    "langchain",
    "@langchain/openai",
    "@langchain/core",
  ],
  turbopack: {
    resolveExtensions: [".tsx", ".ts", ".jsx", ".js", ".mjs", ".json"],
  },
  experimental: {
    webpackBuildWorker: true,
    optimizePackageImports: ["remeda", "react-use", "ramda"],
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  productionBrowserSourceMaps: true,
  modularizeImports: {
    "@phosphor-icons/react/dist/ssr": {
      transform: "@phosphor-icons/react/dist/ssr/{{member}}",
      skipDefaultConversion: true,
    },
    "@phosphor-icons/react": {
      transform: "@phosphor-icons/react/{{member}}",
      skipDefaultConversion: true,
    },
  },
  images: {
    remotePatterns: [
      // These are for presignedDownloadUrls
      {
        protocol: "https",
        hostname: "mioto-v3-public.s3.fr-par.scw.cloud",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "mioto-dev-public.s3.fr-par.scw.cloud",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "cdn.builder.io",
        port: "",
        pathname: "**",
      },
      // These are for the returned urls of public files
      {
        protocol: "https",
        hostname: "s3.fr-par.scw.cloud",
        port: "",
        pathname: "/mioto-v3-public/**",
      },
      {
        protocol: "https",
        hostname: "s3.fr-par.scw.cloud",
        port: "",
        pathname: "/mioto-dev-public/**",
      },
    ],
  },
  pageExtensions: ["js", "jsx", "mdx", "ts", "tsx"],
  transpilePackages: ["@mioto/*"],
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.optimization.minimize = !process.env.DISABLE_OPTIMIZE ?? true;
    return config;
  },
};

// import withBundleAnalyzer from "@next/bundle-analyzer";

// export default withBundleAnalyzer({
//   enabled: process.env.ANALYZE === "true",
// })(
//   withSentryConfig(
//     nextConfig,
//     { silent: true, dryRun: process.env.VERCEL_ENV !== "production" },
//     { hideSourceMaps: true, tunnelRoute: "/api/error" }
//   )
// );

export default withSentryConfig(withMDX()(withNextIntl()(nextConfig)), {
  dryRun: process.env.APP_ENV !== "production",
  hideSourceMaps: true,
  tunnelRoute: "/api/error",
  widenClientFileUpload: true,
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
  disableLogger: process.env.APP_ENV === "production",
});
