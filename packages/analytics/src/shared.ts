export const featureFlags = [] as const;

export type FeatureFlags = (typeof featureFlags)[number];
