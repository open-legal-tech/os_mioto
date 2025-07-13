"use client";

import { createCssFromThemeObject } from "../utils/createCssFromThemeObject";

export type ApplyThemeProps = {
  themes: {
    mobile?: any;
    desktop: any;
  };
  name: string;
  transformFn?: (theme: any, name: string) => string;
  customCss?: string;
};

export function ApplyTheme({
  themes,
  name,
  transformFn = createCssFromThemeObject,
  customCss,
}: ApplyThemeProps) {
  return (
    <>
      <style jsx>{`
        ${transformFn(themes.desktop, name)}
      `}</style>
      <style jsx>
        {`
          @media (max-width: 640px) {
            ${themes.mobile ? transformFn(themes.mobile, name) : ""}
          }
        `}
      </style>
      <style jsx>{`
        ${customCss ?? ""}
      `}</style>
    </>
  );
}
