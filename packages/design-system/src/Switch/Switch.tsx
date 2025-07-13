import * as SwitchPrimitive from "@radix-ui/react-switch";
import { type VariantProps, tv } from "../tailwind/tv";

const switchClasses = tv({
  variants: {
    size: {
      small: { container: "w-[32px] h-[15px]", thumb: "w-[11px] h-[11px]" },
      medium: { container: "w-[42px] h-[25px]", thumb: "w-[21px] h-[21px]" },
    },
    isLoading: {
      true: "opacity-50 pointer-events-none",
    },
  },
  slots: {
    container:
      "bg-gray6 rounded-full relative focus:outer-focus data-[state=checked]:bg-primary7 cursor-pointer",
    thumb:
      "block bg-white rounded-full shadow-[0_2px_2px] shadow-gray7 data-[state=checked]:shadow-primary7 transition-transform duration-100 translate-x-[2px] will-change-transform data-[state=checked]:translate-x-[19px] cursor-pointer",
  },
  defaultVariants: {
    size: "medium",
  },
});

export type RootProps = SwitchPrimitive.SwitchProps & {
  isLoading?: boolean;
} & VariantProps<typeof switchClasses>;

export const Root = ({ className, isLoading, size, ...props }: RootProps) => (
  <SwitchPrimitive.Root
    {...props}
    className={switchClasses().container({ size, className, isLoading })}
    disabled={isLoading}
    style={{ WebkitTapHighlightColor: "rgba(0, 0, 0, 0)" } as any}
  />
);

export type ThumbProps = SwitchPrimitive.SwitchThumbProps &
  VariantProps<typeof switchClasses>;

export const Thumb = ({ className, size, ...props }: ThumbProps) => (
  <SwitchPrimitive.Thumb
    {...props}
    className={switchClasses().thumb({ size, className })}
  />
);
