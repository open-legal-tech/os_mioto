import { twMerge } from "../tailwind/merge";

export type DualButtonProps = {
  LeftButton: () => React.ReactNode;
  RightButton: () => React.ReactNode;
  className?: string;
};

export function DualButton({
  LeftButton,
  RightButton,
  className,
}: DualButtonProps) {
  return (
    <div
      className={twMerge(
        "border border-gray5 bg-white rounded flex items-center",
        className,
      )}
    >
      {LeftButton()}
      {RightButton()}
    </div>
  );
}
