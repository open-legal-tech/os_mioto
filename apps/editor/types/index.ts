export type LocationState = {
  from: { pathname: string };
};

export const badgeColors = {
  red: "text-red-900 bg-red-200",
  blue: "text-blue-900 bg-blue-200",
  green: "text-primary-900 bg-primary-200",
  yellow: "text-yellow-900 bg-yellow-200",
  indigo: "text-indigo-900 bg-indigo-200",
  purple: "text-purple-900 bg-purple-200",
  pink: "text-pink-900 bg-pink-200",
} as const;
