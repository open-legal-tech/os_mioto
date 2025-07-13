import React from "react";

export type LayoutProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export const DashboardLayout = React.forwardRef<HTMLDivElement, LayoutProps>(
  function DashboardLayout({ children, className, style }, ref) {
    return (
      <div
        className={`h-full w-full grid overflow-hidden grid-rows-[max-content_1fr] grid-cols-[56px_10px_1fr_10px] lg:grid-cols-[56px_56px_1fr_56px] ${className}`}
        ref={ref}
        style={style}
      >
        {children}
      </div>
    );
  },
);
