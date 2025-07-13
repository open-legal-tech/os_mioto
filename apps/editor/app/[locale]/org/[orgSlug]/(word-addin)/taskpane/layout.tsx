import type { ReactNode } from "react";
import { Client } from "./Client";

export const dynamic = "force-dynamic";

interface TaskPaneLayoutProps {
  children: ReactNode;
}

export default function TaskPaneLayout({ children }: TaskPaneLayoutProps) {
  return (
    <>
      <Client>{children}</Client>
    </>
  );
}
