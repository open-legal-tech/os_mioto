"use client"
import type { AnalyticsPopupProps } from "@mioto/analytics/client";
import dynamic from "next/dynamic";

const AnalyticsPopupImport = dynamic(() => import("@mioto/analytics/client"), {
  ssr: false,
});

export function AnalyticsPopup(props: AnalyticsPopupProps) {
  return <AnalyticsPopupImport {...props} />
}