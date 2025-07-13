import {
  ComboboxGroup,
  type ComboboxGroupProps,
} from "@ariakit/react/combobox";
import * as React from "react";
import { menuGroupClasses } from "../shared/menuClasses";
import { twMerge } from "../tailwind/merge";

export type GroupProps = ComboboxGroupProps;

export const Group = React.forwardRef<HTMLDivElement, GroupProps>(
  function Group({ className, children }, ref) {
    return (
      <ComboboxGroup ref={ref} className={twMerge(menuGroupClasses, className)}>
        {children}
      </ComboboxGroup>
    );
  },
);
