"use client";

import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { twMerge } from "../tailwind/merge";

const sidebarClasses = "h-full overflow-y-hidden w-full";

export type SidebarProps = {
  open: boolean;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "left" | "right";
};

export const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ open, children, className, direction = "right", delay }, ref) => {
    const isRight = direction === "right";

    return (
      <AnimatePresence>
        {open && (
          <motion.aside
            ref={ref}
            key="content"
            initial={{ x: isRight ? "100%" : "-100%" }}
            transition={{ duration: 0.3, type: "tween" }}
            animate={{ x: 0 }}
            exit={{
              x: isRight ? "100%" : "-100%",
              transition: { delay, duration: 0.3, type: "tween" },
            }}
            className={
              className ? twMerge(sidebarClasses, className) : sidebarClasses
            }
          >
            {children}
          </motion.aside>
        )}
      </AnimatePresence>
    );
  },
);
