import type { Icon, IconWeight } from "@phosphor-icons/react";
import SSRBase from "@phosphor-icons/react/dist/lib/SSRBase";
import { type ReactElement, forwardRef } from "react";

const paths = (
  <>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 8C12 10.2091 10.2091 12 8 12C5.79086 12 4 10.2091 4 8C4 5.79086 5.79086 4 8 4C10.2091 4 12 5.79086 12 8ZM11 8C11 9.65685 9.65685 11 8 11C6.34315 11 5 9.65685 5 8C5 6.34315 6.34315 5 8 5C9.65685 5 11 6.34315 11 8Z"
      fill="currentColor"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8ZM14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8Z"
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

export const SelectVariableIcon = forwardRef((props, ref) => (
  <SSRBase ref={ref} {...props} viewBox="0 0 16 16" weights={weights} />
)) as Icon;

SelectVariableIcon.displayName = "SelectVariableIcon";

export default SelectVariableIcon;
