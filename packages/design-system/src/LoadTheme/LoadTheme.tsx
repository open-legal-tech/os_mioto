"use client";

import { ApplyTheme } from "./ApplyTheme";

export function LoadTheme({
  name,
  theme,
}: {
  name: string;
  theme: { content: any; customCss?: string | null };
}) {
  return (
    <ApplyTheme
      themes={
        "desktop" in theme.content ? theme.content : { desktop: theme.content }
      }
      name={name}
      transformFn={(theme, name) => {
        let tokenVariableStrings = `.${name} {\n`;

        tokenVariableStrings += Object.entries(theme)
          .filter(([_, value]) => typeof value === "string" && value.length > 0)
          .map(([key, value]) => `--${key}: ${value};`)
          .join("\n");

        tokenVariableStrings.concat(`}`);

        return tokenVariableStrings;
      }}
      customCss={theme.customCss ?? undefined}
    />
  );
}
