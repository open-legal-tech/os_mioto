import { Question } from "@phosphor-icons/react/dist/ssr";
import { IconButton } from "../IconButton";
import { twMerge } from "../tailwind/merge";

export type HelpTooltipProps = {
  children: React.ReactNode;
  className?: string;
};

export function HelpTooltip({
  children,
  className,
  ...props
}: HelpTooltipProps) {
  return (
    <IconButton
      variant="ghost"
      className={twMerge("p-0 items-center flex", className)}
      tooltip={{
        children,
        delay: 800,
      }}
      {...props}
    >
      <Question />
    </IconButton>
  );
}
