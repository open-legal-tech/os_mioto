import { SelectPopover, type SelectPopoverProps } from "@ariakit/react/select";
import { menuContainerClasses } from "../shared/menuClasses";
import { twMerge } from "../tailwind/merge";

export type PopoverProps = SelectPopoverProps;

export function Popover({ className, ...props }: PopoverProps) {
  return (
    <SelectPopover
      className={
        className
          ? twMerge(menuContainerClasses, [
              "gap-2 overflow-hidden max-h-[--popover-available-height]",
              className,
            ])
          : menuContainerClasses
      }
      {...props}
    />
  );
}
