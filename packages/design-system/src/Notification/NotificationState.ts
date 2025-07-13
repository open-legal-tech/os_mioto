import { v4 as uuidV4 } from "uuid";
import { proxy, useSnapshot } from "valtio";
import type { TNotification } from "./types";

const state = proxy({
  notifications: {} as Record<string, TNotification>,
});

export const add = (notification: Omit<TNotification, "id">) => {
  if (
    !Object.values(state.notifications).find(
      (n) => n.key && n.key === notification.key,
    )
  ) {
    const id = uuidV4();
    state.notifications[id] = {
      id,
      variant: "info",
      type: "background",
      ...notification,
    };
  }
};

export const clear = () => {
  state.notifications = {};
};

export const remove = (id: string) => {
  delete state.notifications[id];
};

export type NotificationState = typeof state;

export const useState = () => {
  return useSnapshot(state) as NotificationState;
};

export * from "./types";
