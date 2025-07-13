import type { Icon, IconWeight } from "@phosphor-icons/react";
import SSRBase from "@phosphor-icons/react/dist/lib/SSRBase";
import { type ReactElement, forwardRef } from "react";

const paths = (
  <>
    <g clipPath="url(#clip0_7122_15291)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.5676 4.30044C12.8071 4.06092 12.8071 3.67258 12.5676 3.43306C12.3281 3.19354 11.9397 3.19354 11.7003 3.43306L8.00058 7.13271L4.30094 3.43306C4.06141 3.19354 3.67307 3.19354 3.43355 3.43306C3.19403 3.67258 3.19403 4.06092 3.43355 4.30044L7.13319 8.00009L3.43355 11.6997C3.19403 11.9393 3.19403 12.3276 3.43355 12.5671C3.67307 12.8066 4.06141 12.8066 4.30094 12.5671L8.00058 8.86747L11.7003 12.5671C11.9397 12.8066 12.3281 12.8066 12.5676 12.5671C12.8071 12.3276 12.8071 11.9393 12.5676 11.6997L8.86796 8.00009L12.5676 4.30044Z"
        fill="currentColor"
      />
    </g>
    <defs>
      <clipPath id="clip0_7122_15291">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </>
);

const weights = new Map<IconWeight, ReactElement>([
  ["thin", paths],
  ["light", paths],
  ["regular", paths],
  ["bold", paths],
  ["fill", paths],
  ["duotone", paths],
]);

export const Multiplication = forwardRef((props, ref) => (
  <SSRBase ref={ref} {...props} viewBox="0 0 16 16" weights={weights} />
)) as Icon;

Multiplication.displayName = "Multiplication";

export default Multiplication;
