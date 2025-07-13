import type { Icon, IconWeight } from "@phosphor-icons/react";
import SSRBase from "@phosphor-icons/react/dist/lib/SSRBase";
import { type ReactElement, forwardRef } from "react";

const paths = (
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M5 2C4.17157 2 3.5 2.67157 3.5 3.5V4.5H2.83333C2.3731 4.5 2 4.8731 2 5.33333V13.6667C2 14.1269 2.3731 14.5 2.83333 14.5H11.1667C11.6269 14.5 12 14.1269 12 13.6667V13H13C13.8284 13 14.5 12.3284 14.5 11.5V3.5C14.5 2.67157 13.8284 2 13 2H5ZM12 12H13C13.2761 12 13.5 11.7761 13.5 11.5V3.5C13.5 3.22386 13.2761 3 13 3H5C4.72386 3 4.5 3.22386 4.5 3.5V4.5H11.1667C11.6269 4.5 12 4.8731 12 5.33333V12ZM4.78626 12.5L3 6.5H3.94656L5.21374 11.0938H5.27481L6.52672 6.5H7.48855L8.72519 11.0781H8.78626L10.0534 6.5H11L9.21374 12.5H8.32824L7.0458 7.89062H6.9542L5.67176 12.5H4.78626Z"
    fill="currentcolor"
  />
);

const weights = new Map<IconWeight, ReactElement>([
  ["thin", paths],
  ["light", paths],
  ["regular", paths],
  ["bold", paths],
  ["fill", paths],
  ["duotone", paths],
]);

export const Word = forwardRef((props, ref) => (
  <SSRBase ref={ref} {...props} viewBox="0 0 16 16" weights={weights} />
)) as Icon;

Word.displayName = "WordIcon";

export default Word;
