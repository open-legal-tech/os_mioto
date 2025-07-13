import type { Icon, IconWeight } from "@phosphor-icons/react";
import SSRBase from "@phosphor-icons/react/dist/lib/SSRBase";
import { type ReactElement, forwardRef } from "react";

const path = (
  <path
    d="M9 8C9 6.81875 8.83333 5.73281 8.5 4.74219C8.18564 3.81447 7.74678 2.95621 7.18342 2.16739C7.10762 2.06126 6.9844 2 6.85398 2C6.50854 2 6.30095 2.41075 6.46844 2.71287C6.5436 2.84845 6.61705 2.99207 6.68878 3.14375C6.89966 3.59375 7.08503 4.08906 7.2449 4.62969C7.40476 5.16719 7.53061 5.72344 7.62245 6.29844C7.71088 6.87344 7.7551 7.44063 7.7551 8C7.7551 8.74375 7.67687 9.49844 7.52041 10.2641C7.36395 11.0297 7.15306 11.7406 6.88775 12.3969C6.75556 12.7239 6.61577 13.0206 6.46837 13.2871C6.30117 13.5894 6.50854 14 6.85398 14C6.9844 14 7.10762 13.9387 7.18343 13.8326C7.74679 13.044 8.18564 12.1873 8.5 11.2625C8.83333 10.2688 9 9.18125 9 8Z"
    fill="currentColor"
  />
);

const weights = new Map<IconWeight, ReactElement>([
  ["thin", path],
  ["light", path],
  ["regular", path],
  ["bold", path],
  ["fill", path],
  ["duotone", path],
]);

export const ClosedBracket = forwardRef((props, ref) => (
  <SSRBase ref={ref} {...props} viewBox="0 0 16 16" weights={weights} />
)) as Icon;

ClosedBracket.displayName = "ClosedBracket";

export default ClosedBracket;
