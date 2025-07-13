import { Check } from "@phosphor-icons/react/dist/ssr";
import {
  Collection,
  Header,
  type ListBoxItemProps,
  ListBox as RACListBox,
  ListBoxItem as RACListBoxItem,
  type ListBoxProps as RACListBoxProps,
  Section,
  type SectionProps,
  composeRenderProps,
} from "react-aria-components";
import { focusRing } from "../shared/focusRing";
import { tv } from "../tailwind/tv";

interface ListBoxProps<T>
  extends Omit<RACListBoxProps<T>, "layout" | "orientation"> {}

export function ListBox<T extends object>({
  children,
  ...props
}: ListBoxProps<T>) {
  return (
    <RACListBox
      {...props}
      className={composeRenderProps(
        props.className,
        () =>
          "outline-0 p-1 border border-gray-300 dark:border-zinc-600 rounded-lg",
      )}
    >
      {children}
    </RACListBox>
  );
}

export const itemStyles = tv({
  extend: focusRing,
  base: "group relative flex items-center gap-8 cursor-default select-none py-1.5 px-2.5 rounded-md will-change-transform text-sm forced-color-adjust-none",
  variants: {
    isSelected: {
      false:
        "text-slate-700 dark:text-zinc-300 hover:bg-slate-200 dark:hover:bg-zinc-700 -outline-offset-2",
      true: "bg-blue-600 text-white forced-colors:bg-[Highlight] forced-colors:text-[HighlightText] [&:has(+[data-selected])]:rounded-b-none [&+[data-selected]]:rounded-t-none -outline-offset-4 outline-white dark:outline-white forced-colors:outline-[HighlightText]",
    },
    isDisabled: {
      true: "text-slate-300 dark:text-zinc-600 forced-colors:text-[GrayText]",
    },
  },
});

export function ListBoxItem(props: ListBoxItemProps) {
  const textValue =
    props.textValue ||
    (typeof props.children === "string" ? props.children : undefined);
  return (
    <RACListBoxItem {...props} textValue={textValue} className={itemStyles}>
      {composeRenderProps(props.children, (children) => (
        <>
          {children}
          <div className="absolute left-4 right-4 bottom-0 h-px bg-white/20 forced-colors:bg-[HighlightText] hidden [.group[data-selected]:has(+[data-selected])_&]:block" />
        </>
      ))}
    </RACListBoxItem>
  );
}

export const dropdownItemStyles = tv({
  base: "outline-none group flex items-center gap-2 cursor-pointer select-none py-2 px-3 rounded text-mediumText border border-transparent",
  variants: {
    isDisabled: {
      false: "text-gray10 ",
      true: "text-gray6",
    },
    isFocused: {
      true: "bg-gray2 border-gray4",
    },
  },
});

export function DropdownItem(props: ListBoxItemProps) {
  const textValue =
    props.textValue ||
    (typeof props.children === "string" ? props.children : undefined);
  return (
    <RACListBoxItem
      {...props}
      textValue={textValue}
      className={dropdownItemStyles}
    >
      {composeRenderProps(props.children, (children, { isSelected }) => (
        <>
          <span className="flex-1 flex items-center gap-2 truncate font-normal group-selected:font-semibold">
            {children}
          </span>
          <span className="w-5 flex items-center">
            {isSelected && <Check className="w-4 h-4" />}
          </span>
        </>
      ))}
    </RACListBoxItem>
  );
}

export interface DropdownSectionProps<T> extends SectionProps<T> {
  title?: string;
}

export function DropdownSection<T extends object>(
  props: DropdownSectionProps<T>,
) {
  return (
    <Section className="first:-mt-[5px] after:content-[''] after:block after:h-[5px]">
      <Header className="text-sm font-semibold text-gray7 px-4 py-1 truncate sticky -top-[5px] -mt-px -mx-1 z-10 backdrop-blur-md border-y [&+*]:mt-1">
        {props.title}
      </Header>
      <Collection items={props.items}>{props.children}</Collection>
    </Section>
  );
}
