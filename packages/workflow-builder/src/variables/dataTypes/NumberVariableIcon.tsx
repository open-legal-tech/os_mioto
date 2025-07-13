import type { Icon, IconWeight } from "@phosphor-icons/react";
import SSRBase from "@phosphor-icons/react/dist/lib/SSRBase";
import { type ReactElement, forwardRef } from "react";

const paths = (
  <path
    d="M5.24512 12.9766L5.79199 10.1738H4.18555V9.2168H5.9834L6.44824 6.83789H4.70508V5.86719H6.63965L7.2002 3.02344H8.23242L7.67188 5.86719H9.41504L9.97559 3.02344H11.0078L10.4473 5.86719H11.8145V6.83789H10.2627L9.79785 9.2168H11.3018V10.1738H9.60645L9.05957 12.9766H8.02734L8.57422 10.1738H6.82422L6.27734 12.9766H5.24512ZM7.01562 9.2168H8.76562L9.23047 6.83789H7.48047L7.01562 9.2168Z"
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


export const NumberVariableIcon = forwardRef((props, ref) => (
  <SSRBase ref={ref} {...props} viewBox="0 0 16 16" weights={weights} />
)) as Icon;

NumberVariableIcon.displayName = "NumberVariableIcon";

export default NumberVariableIcon;
