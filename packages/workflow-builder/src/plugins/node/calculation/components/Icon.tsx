import type { Icon, IconWeight } from "@phosphor-icons/react";
import SSRBase from "@phosphor-icons/react/dist/lib/SSRBase";
import { type ReactElement, forwardRef } from "react";

const paths = (
  <>
    <g clipPath="url(#clip0_7122_15287)">
      <circle cx="8" cy="5.5" r="1" fill="#141515" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 8C3 7.72386 3.2132 7.5 3.47619 7.5H12.5238C12.7868 7.5 13 7.72386 13 8C13 8.27614 12.7868 8.5 12.5238 8.5H3.47619C3.2132 8.5 3 8.27614 3 8Z"
        fill="#141515"
      />
      <circle cx="8" cy="10.5" r="1" fill="#141515" />
    </g>
    <defs>
      <clipPath id="clip0_7122_15287">
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

// @ts-expect-error - library type error
export const CalculationNodeIcon: Icon = forwardRef((props, ref) => (
  <SSRBase ref={ref} {...props} viewBox="0 0 16 16" weights={weights} />
));

CalculationNodeIcon.displayName = "CalculationNodeIcon";

export default CalculationNodeIcon;
