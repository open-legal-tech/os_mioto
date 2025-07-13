import { headingClasses as systemHeadingClasses } from "@mioto/design-system/Heading/classes";
import { stackClasses } from "@mioto/design-system/Stack";
import { textClasses } from "@mioto/design-system/Text/classes";

export const containerClasses = (className?: string) =>
  stackClasses({}, ["gap-6 bg-white", className]);

export const headerClasses = stackClasses({}, "gap-4");

export const headingClasses = systemHeadingClasses({ size: "large" });

export const descriptionClasses = textClasses({
  size: "large",
  className: "text-gray9",
});

export const footerClasses = textClasses({ className: "text-gray9" });
