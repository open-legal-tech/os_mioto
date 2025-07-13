"use client";

import { Notification } from "@mioto/design-system/Notification";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { useSearchParams } from "next/navigation";
import * as React from "react";

const notifications: Record<string, Notification.TNotification> = {
  "email-verified": {
    id: "email-verified",
    Title: "E-Mail Adresse bestätigt",
    variant: "success",
    type: "background",
    key: "email-verified",
  },
  "email-verify-invalid-token": {
    Title: "Ungültiger Bestätigungslink",
    variant: "danger",
    id: "email-verify-invalid-token",
    type: "background",
    key: "email-verify-invalid-token",
  },
};

export const NotificationProvider = () => {
  const notificationState = Notification.useState();

  const searchParams = useSearchParams();
  const notify = searchParams?.get("notify");
  const [hasNotified, setHasNotified] = React.useState(false);

  React.useEffect(() => {
    if (notify && !hasNotified && typeof window !== "undefined") {
      const notificationTemplate = notifications[notify];

      if (!notificationTemplate) return;

      Notification.add(notificationTemplate);
      setHasNotified(true);
    }
  }, [hasNotified, notify]);

  return (
    <ToastPrimitive.Provider swipeDirection="left">
      {Object.entries(notificationState.notifications).map(
        ([id, notification]) => (
          <Notification.Notification key={id} notification={notification} />
        ),
      )}
      <ToastPrimitive.Viewport className="[--viewport-padding:_30px] fixed bottom-0 left-0 flex flex-col p-[var(--viewport-padding)] gap-2.5 w-[500px] max-w-[100vw] m-0 list-none z-[2147483647] outline-none" />
    </ToastPrimitive.Provider>
  );
};
