"use client";

import { motion } from "framer-motion";
import * as React from "react";
import { Link, type LinkProps } from "./Link";

const animationVariants = {
  rest: {
    x: 0,
  },
  hover: {
    x: "10px",
  },
};

const AnimatedArrowRight = () => {
  return (
    <motion.svg
      width="1.4em"
      height="1.4em"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="presentation"
    >
      <motion.path
        variants={animationVariants}
        d="M30 50 L70 50 M55 35 L70 50 L55 65"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        transition={{
          duration: 0.5,
          type: "spring",
        }}
      />
    </motion.svg>
  );
};

export const LinkWithAnimatedArrow = React.forwardRef<
  HTMLAnchorElement,
  LinkProps
>(({ children, ...props }, ref) => {
  return (
    <Link ref={ref} {...props}>
      <motion.span
        initial="rest"
        whileHover="hover"
        animate="rest"
        className="inline-flex items-center"
      >
        {children}
        <AnimatedArrowRight />
      </motion.span>
    </Link>
  );
});
