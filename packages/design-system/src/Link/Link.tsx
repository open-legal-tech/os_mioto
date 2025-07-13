"use client";

import NextLink, { type LinkProps as NextLinkProps } from "next/link";
import * as React from "react";
import { useMaybeOrg } from "../Org";
import { type LinkVariants, linkClasses } from "./classes";

export type BaseLinkProps = Omit<
  React.AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "download"
> &
  LinkVariants & { ghost?: boolean; orgLink?: boolean };

export type LinkTypes =
  | {
      download?: string | boolean;
      href: Blob | string;
    }
  | ({ href: `/${string}`; download?: never } & Omit<NextLinkProps, "href">);

export type LinkProps = BaseLinkProps & LinkTypes;

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  (
    {
      className,
      children,
      size,
      emphasize,
      underline,
      orgLink,
      href,
      square,
      ghost,
      ...props
    },
    ref,
  ) => {
    const orgSlug = useMaybeOrg();

    if (orgLink && !orgSlug) {
      throw new Error("orgLink is true but this is not an org route.");
    }

    let resultingHref: string;

    if (href instanceof Blob) {
      resultingHref = URL.createObjectURL(href);
    } else if (orgLink) {
      resultingHref = `/org/${orgSlug}${href}`;
    } else if (href != null) {
      resultingHref = href;
    } else {
      console.log({
        children,
        className,
        size,
        emphasize,
        orgLink,
        href,
        ...props,
      });
      throw new Error("Link has no href.");
    }

    const Comp = resultingHref?.includes("http") ? "a" : NextLink;

    return (
      <Comp
        className={
          ghost
            ? className
            : linkClasses({
                underline,
                size,
                emphasize,
                square,
                className,
              })
        }
        href={resultingHref}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  },
);
