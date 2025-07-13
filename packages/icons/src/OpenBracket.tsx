import type { Icon, IconWeight } from "@phosphor-icons/react";
import SSRBase from "@phosphor-icons/react/dist/lib/SSRBase";
import { type ReactElement, forwardRef } from "react";

const paths = (
  <path
    d="M6 8C6 6.81875 6.16667 5.73281 6.5 4.74219C6.81436 3.81447 7.25322 2.95621 7.81658 2.16739C7.89238 2.06126 8.0156 2 8.14602 2C8.49146 2 8.69905 2.41075 8.53156 2.71287C8.4564 2.84845 8.38295 2.99207 8.31122 3.14375C8.10034 3.59375 7.91497 4.08906 7.7551 4.62969C7.59524 5.16719 7.46939 5.72344 7.37755 6.29844C7.28912 6.87344 7.2449 7.44063 7.2449 8C7.2449 8.74375 7.32313 9.49844 7.47959 10.2641C7.63605 11.0297 7.84694 11.7406 8.11225 12.3969C8.24444 12.7239 8.38423 13.0206 8.53163 13.2871C8.69883 13.5894 8.49146 14 8.14602 14C8.0156 14 7.89238 13.9387 7.81657 13.8326C7.25321 13.044 6.81436 12.1873 6.5 11.2625C6.16667 10.2688 6 9.18125 6 8Z"
    fill="currentColor"
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

export const OpenBracket = forwardRef((props, ref) => (
  <SSRBase ref={ref} {...props} viewBox="0 0 16 16" weights={weights} />
)) as Icon;

OpenBracket.displayName = "OpenBracket";

export default OpenBracket;
