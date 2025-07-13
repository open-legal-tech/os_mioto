"use client";

import * as React from "react";
import {
  Heading as RACHeading,
  type HeadingProps as RACHeadingProps,
} from "react-aria-components";
import { type HeadingVariants, headingClasses } from "./classes";

export type HeadingProps = HeadingVariants & RACHeadingProps;

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, children, size, ...props }, ref) => {
    return (
      <RACHeading
        ref={ref}
        className={headingClasses({ size, className })}
        {...props}
      >
        {children}
      </RACHeading>
    );
  },
);
