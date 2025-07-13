import type { Icon, IconWeight } from "@phosphor-icons/react";
import SSRBase from "@phosphor-icons/react/dist/lib/SSRBase";
import { type ReactElement, forwardRef } from "react";

const paths = (
  <>
    <path
      d="M11.3455 6.36142L10.6545 5.63853L6.84834 9.27658L5.37715 7.58631L4.62285 8.24285L6.78191 10.7234L11.3455 6.36142Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1 3C1 1.89543 1.89543 1 3 1H13C14.1046 1 15 1.89543 15 3V13C15 14.1046 14.1046 15 13 15H3C1.89543 15 1 14.1046 1 13V3ZM3 2H13C13.5523 2 14 2.44772 14 3V13C14 13.5523 13.5523 14 13 14H3C2.44772 14 2 13.5523 2 13V3C2 2.44772 2.44772 2 3 2Z"
      fill="currentColor"
    />
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

export const MultiSelectVariableIcon = forwardRef((props, ref) => (
  <SSRBase ref={ref} {...props} viewBox="0 0 16 16" weights={weights} />
)) as Icon;

MultiSelectVariableIcon.displayName = "MultiSelectVariableIcon";

export default MultiSelectVariableIcon;
