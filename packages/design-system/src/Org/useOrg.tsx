"use client";

import { FatalError } from "@mioto/errors";
import React from "react";

const OrgContext = React.createContext<undefined | string>(undefined);

export const OrgProvider = ({
  children,
  orgSlug,
}: {
  children: React.ReactNode;
  orgSlug: string;
}) => {
  return <OrgContext.Provider value={orgSlug}>{children}</OrgContext.Provider>;
};

export const useMaybeOrg = () => {
  return React.useContext(OrgContext);
};

export const useOrg = () => {
  const context = React.useContext(OrgContext);

  if (!context) {
    throw new FatalError({
      code: "missing_context",
      debugMessage:
        "The OrgProvider is not wrapped around the current react tree.",
    });
  }

  return context;
};
