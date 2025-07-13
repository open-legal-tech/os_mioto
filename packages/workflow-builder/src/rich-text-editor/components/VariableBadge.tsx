import { tv } from "@mioto/design-system/tailwind/tv";
import { colorScheme } from "@mioto/design-system/utils/sharedVariants";
import type { ColorKeys } from "@mioto/design-system/utils/types";
import { NodeViewWrapper } from "@tiptap/react";

type VariableBadeProps = {
  children: React.ReactNode;
  className?: string;
  colorScheme?: ColorKeys;
};

const classes = tv({
  base: "inline-flex text-inherit items-baseline gap-1 font-weak text-colorScheme8",
  variants: {
    colorScheme,
  },
});

export const VariableBadge = ({
  children,
  className,
  colorScheme,
}: VariableBadeProps) => (
  <NodeViewWrapper className={classes({ className, colorScheme })} as="span">
    {children}
  </NodeViewWrapper>
);
