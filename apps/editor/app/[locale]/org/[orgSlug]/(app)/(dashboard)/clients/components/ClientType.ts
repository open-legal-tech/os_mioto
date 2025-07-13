import type { UserStatus } from "@mioto/prisma";

export type Client = {
  email?: string;
  referenceNumber?: string | null;
  uuid: string;
  name?: string;
  status: UserStatus | "BLOCKED" | "NO_ACCESS";
  isBlocked: boolean;
  hasPortalAccess: boolean;
  updatedAt: string;
  createdAt: string;
};
