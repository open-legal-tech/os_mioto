
import { rowClasses } from "../Row/Row";
import { textClasses } from "../Text/classes";
import { twMerge } from "../tailwind/merge";

export const menuContainerClasses =
  "bg-white py-2 shadow-md rounded z-50 flex flex-col gap-1 border border-gray5 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 min-w-[250px] max-h-[--popover-available-height] overflow-y-auto outline-none";

export const menuGroupClasses =
  "border-t border-gray5 py-2 gap-1 flex flex-col";

export const menuItemClasses = (className?: string) =>
  rowClasses({}, [
    textClasses({}),
    "appearance-none colorScheme-gray flex mx-2 gap-3 px-3 py-1.5 rounded min-w-[250px] break-words cursor-pointer font-[500] border border-transparent no-underline items-center focus:bg-colorScheme3 hover:bg-colorScheme2 focus:border-colorScheme5 disabled:text-colorScheme8 disabled:colorScheme-gray outline-none text-start flex-1",
    className,
  ]);

export const dropdownItemStyles = ({ className }: { className?: string }) =>
  twMerge(
    "outline-none group flex items-center gap-2 cursor-pointer select-none mx-2 py-2.5 px-3 rounded text-mediumText leading-[1em] border border-transparent disabled:text-gray6 hover:bg-gray2 hover:border-gray4 focus:bg-gray2 focus:border-gray4",
    className,
  );

export const menuLabelClasses = (className?: string) =>
  rowClasses({}, [
    textClasses({ size: "small" }),
    "text-gray9 font-strong flex-1 gap-3 mx-4",
    className,
  ]);

export const menuGroupItemClasses = (className?: string) =>
  twMerge(menuItemClasses(className), "mx-4");
