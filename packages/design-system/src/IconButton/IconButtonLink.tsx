"use client";

import React from "react";
import { ButtonLink, type ButtonLinkProps } from "../Button/ButtonLink";

export type IconButtonLinkProps = Omit<ButtonLinkProps, "tooltip"> &
  Required<Pick<ButtonLinkProps, "tooltip">>;

export const IconButtonLink = React.forwardRef<
  HTMLAnchorElement,
  IconButtonLinkProps
>(({ size, children, ...props }: any, ref) => {
  return (
    <ButtonLink size={size} square variant="tertiary" ref={ref} {...props}>
      {children}
    </ButtonLink>
  );
});
