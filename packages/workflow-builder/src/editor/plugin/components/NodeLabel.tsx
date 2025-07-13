import { rowClasses } from "@mioto/design-system/Row";
import type { WithClassNameArray } from "@mioto/design-system/utils/types";

export type NodeLabelProps = WithClassNameArray<
  React.HTMLAttributes<HTMLSpanElement>
>;

export const NodeLabel = ({ className, ...props }: NodeLabelProps) => {
  return (
    <span
      className={rowClasses({}, [
        "rounded bg-success2 smallText items-center gap-1 p-1 border border-success6 text-colorScheme10",
        className,
      ])}
      {...props}
    />
  );
};
