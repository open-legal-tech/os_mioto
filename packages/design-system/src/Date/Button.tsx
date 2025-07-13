import {
  Button as RACButton,
  type ButtonProps as RACButtonProps,
  composeRenderProps,
} from "react-aria-components";
import { type ButtonVariants, buttonClasses } from "../Button";

export type ButtonProps = RACButtonProps & ButtonVariants;

export function Button(props: ButtonProps) {
  return (
    <RACButton
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        buttonClasses({
          ...renderProps,
          ...props,
          className,
        }),
      )}
    />
  );
}
