import Heading from "@mioto/design-system/Heading";
import Link from "@mioto/design-system/Link";
import Text from "@mioto/design-system/Text";
import { textClasses } from "@mioto/design-system/Text/classes";

export function useMDXComponents(components) {
  return {
    ...components,
    h1: ({ children }) => (
      <Heading size="large" className="mt-4 mb-2 break-all" level={1}>
        {children}
      </Heading>
    ),
    h2: ({ children }) => (
      <Heading size="medium" className="mt-4 mb-2 break-all" level={2}>
        {children}
      </Heading>
    ),
    h3: ({ children }) => (
      <Heading size="small" className="mt-4 mb-2 break-all" level={3}>
        {children}
      </Heading>
    ),
    h4: ({ children }) => (
      <Heading size="extra-small" className="mt-4 mb-2 break-all" level={4}>
        {children}
      </Heading>
    ),
    p: ({ children }) => <Text size="medium">{children}</Text>,
    ul: ({ children }) => (
      <ul className={textClasses({ size: "medium" }, "list-disc ml-4 my-2")}>
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className={textClasses({ size: "medium" }, "list-decimal ml-4")}>
        {children}
      </ol>
    ),
    li: ({ children }) => (
      <li className={textClasses({ size: "medium" })}>{children}</li>
    ),
    a: ({ children, href }) => (
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline text-info8"
      >
        {children}
      </Link>
    ),
  };
}
