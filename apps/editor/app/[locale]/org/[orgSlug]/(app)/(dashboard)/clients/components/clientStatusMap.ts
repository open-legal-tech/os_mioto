export const statusMap = {
  INVITED: {
    label: "app.client.client-status.invited",
    colorScheme: "warning",
    type: "invite",
  },
  BLOCKED: {
    label: "app.client.client-status.blocked",
    colorScheme: "danger",
    type: "customer",
  },
  ACTIVE: {
    label: "app.client.client-status.active",
    colorScheme: "success",
    type: "customer",
  },
  NO_ACCESS: {
    label: "app.client.client-status.no-portal",
    colorScheme: "gray",
    type: "customer",
  },
} as const;
