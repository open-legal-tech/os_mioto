import { SelectArrow, type SelectArrowProps } from "@ariakit/react/select";
import { CaretDown } from "@phosphor-icons/react/dist/ssr";

export type ArrowProps = SelectArrowProps;

export const Arrow = (props: ArrowProps) => (
  <SelectArrow {...props}>
    <CaretDown />
  </SelectArrow>
);
