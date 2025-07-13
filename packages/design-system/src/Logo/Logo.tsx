import { LogoIcon } from "./LogoIcon";
import { LogoLarge } from "./LogoLarge";

export type Props = {
  className?: string;
  monochrome?: boolean;
  large?: boolean;
};

export const Logo = ({ className, monochrome, large }: Props) => {
  return large ? (
    <LogoLarge className={className} monochrome={monochrome} />
  ) : (
    <LogoIcon className={className} monochrome={monochrome} />
  );
};
