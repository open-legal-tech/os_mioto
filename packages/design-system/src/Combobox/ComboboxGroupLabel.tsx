import {
  ComboboxGroupLabel,
  type ComboboxGroupLabelProps,
} from "@ariakit/react/combobox";
import { menuLabelClasses } from "../shared/menuClasses";

export type GroupLabelProps = ComboboxGroupLabelProps;

export const GroupLabel = ({ className, ...props }: GroupLabelProps) => {
  return (
    <ComboboxGroupLabel className={menuLabelClasses(className)} {...props} />
  );
};
