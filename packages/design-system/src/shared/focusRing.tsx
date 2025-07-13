import { tv } from "../tailwind/tv";

export const focusRing = tv({
  base: "ring-primary7 outline-none",
  variants: {
    isFocusVisible: {
      false: "ring-0",
      true: "ring-2",
    },
  },
});
