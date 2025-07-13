"use client";

import { DialogRoot } from "@mioto/design-system/Dialog";
import { DropdownMenu } from "@mioto/design-system/DropdownMenu";
import { IconButton } from "@mioto/design-system/IconButton";
import { Notification } from "@mioto/design-system/Notification";
import { useOrg } from "@mioto/design-system/Org";
import { useTranslations } from "@mioto/locale";
import { createCustomerInviteLink } from "@mioto/server/utils/createCustomerInviteLink";
import {
  Copy,
  DotsThree,
  Envelope,
  LockOpen,
  Share,
} from "@phosphor-icons/react";
import { Fingerprint, Lock, Pen, Trash } from "@phosphor-icons/react/dist/ssr";
import React from "react";
import type { Client } from "./ClientType";
import { updatePortalAccess } from "./updatePortalAccess.action";
import { sendEmail } from "@mioto/email/sendEmail";
import { render } from "@mioto/email/render";
import CustomerInvite from "@mioto/email/CustomerInvite";

export function ClientMenu({
  client,
  EditClientDialogContent,
  DeleteClientDialogContent,
  BlockClientDialogContent,
  ShareAppWithPortalClientDialogContent,
  ShareSessionDialogContent,
}: {
  client: Client;
  EditClientDialogContent: React.ReactNode;
  DeleteClientDialogContent: React.ReactNode;
  BlockClientDialogContent: React.ReactNode;
  ShareAppWithPortalClientDialogContent: React.ReactNode;
  ShareSessionDialogContent: React.ReactNode;
}) {
  const t = useTranslations();
  const [openDialog, setOpenDialog] = React.useState<
    "edit" | "share-session" | "delete" | "portal-share" | "block" | undefined
  >(undefined);

  return (
    <>
      <DialogRoot
        open={openDialog === "edit"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setOpenDialog(undefined);
          }
        }}
      >
        {EditClientDialogContent}
      </DialogRoot>
      <DialogRoot
        destructive
        open={openDialog === "delete"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setOpenDialog(undefined);
          }
        }}
      >
        {DeleteClientDialogContent}
      </DialogRoot>
      <DialogRoot
        open={openDialog === "block"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setOpenDialog(undefined);
          }
        }}
        destructive
      >
        {BlockClientDialogContent}
      </DialogRoot>
      <DialogRoot
        open={openDialog === "portal-share"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setOpenDialog(undefined);
          }
        }}
      >
        {ShareAppWithPortalClientDialogContent}
      </DialogRoot>
      <DialogRoot
        open={openDialog === "share-session"}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setOpenDialog(undefined);
          }
        }}
      >
        {ShareSessionDialogContent}
      </DialogRoot>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <IconButton
            tooltip={{
              children: t("app.client.card.menu.tooltip", {
                name: client.name ?? client.email,
              }),
            }}
          >
            <DotsThree weight="bold" />
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Item
            Icon={<Share />}
            onSelect={() => setOpenDialog("share-session")}
          >
            {t("app.client.card.menu.share-session.label")}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            Icon={<Pen />}
            onSelect={() => setOpenDialog("edit")}
          >
            {t("app.client.card.menu.edit-client.label")}
          </DropdownMenu.Item>
          <DropdownMenu.Sub>
            <DropdownMenu.SubTriggerItem Icon={<Fingerprint />}>
              {t("app.client.card.menu.portal-access.label")}
            </DropdownMenu.SubTriggerItem>
            <DropdownMenu.SubContent>
              <PortalClientMenu
                client={client}
                onSelect={(dialog) => setOpenDialog(dialog)}
              />
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Item
            Icon={<Trash />}
            onSelect={() => setOpenDialog("delete")}
          >
            {t("app.client.card.menu.remove-client.label")}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
}

function PortalClientMenu({
  client,
  onSelect,
}: {
  client: Client;
  onSelect: (dialog: "portal-share" | "block" | undefined) => void;
}) {
  const t = useTranslations();
  const orgSlug = useOrg();

  if (!client.hasPortalAccess) {
    return (
      <DropdownMenu.Item
        onAsyncSelect={async () =>
          await updatePortalAccess({
            clientUuid: client.uuid,
            newPortalAccess: true,
          })
        }
      >
        {t("app.client.card.menu.portal-access.give-access")}
      </DropdownMenu.Item>
    );
  }

  return (
    <>
      {client.status === "INVITED" ? (
        <DropdownMenu.Sub>
          <DropdownMenu.SubTriggerItem>
            {t("app.client.card.menu.invite.label")}
          </DropdownMenu.SubTriggerItem>
          <DropdownMenu.SubContent>
            <DropdownMenu.Item
              onSelect={() => {
                navigator.clipboard.writeText(
                  createCustomerInviteLink(orgSlug, client.uuid),
                );
                Notification.add({
                  Title: t(
                    "app.client.card.menu.invite.copy-link.notification.title",
                  ),
                  variant: "success",
                });
              }}
              Icon={<Copy />}
            >
              {t("app.client.card.menu.invite.copy-link.label")}
            </DropdownMenu.Item>
            {client.email ? (
              <DropdownMenu.Item
                onAsyncSelect={async () => {
                  if (!client.email) return;

                  const result = await sendEmail({
                    email: client.email,
                    message: await render(
                      <CustomerInvite
                        inviteLink={createCustomerInviteLink(
                          orgSlug,
                          client.uuid,
                        )}
                        orgName=""
                      />,
                    ),
                    subject: "Einlaudung zu Mioto",
                  });

                  if (!result.success) {
                    Notification.add({
                      Title: t(
                        "app.client.card.menu.invite.send-mail.notification.success.title",
                      ),
                      Content: t(
                        "app.client.card.menu.invite.send-mail.notification.success.content",
                      ),
                      variant: "danger",
                    });
                  }
                }}
                Icon={<Envelope />}
              >
                {t("app.client.card.menu.invite.send-mail.label")}
              </DropdownMenu.Item>
            ) : null}
          </DropdownMenu.SubContent>
        </DropdownMenu.Sub>
      ) : null}
      <DropdownMenu.Item
        Icon={<Share />}
        onSelect={() => {
          onSelect("portal-share");
        }}
      >
        {t("app.client.card.menu.share-app.label")}
      </DropdownMenu.Item>
      {client.isBlocked ? (
        <DropdownMenu.Item
          Icon={<LockOpen />}
          onSelect={() => {
            onSelect("block");
          }}
        >
          {t("app.client.card.menu.block-client.unblock.label")}
        </DropdownMenu.Item>
      ) : (
        <DropdownMenu.Item
          Icon={<Lock />}
          onSelect={() => {
            onSelect("block");
          }}
        >
          {t("app.client.card.menu.block-client.block.label")}
        </DropdownMenu.Item>
      )}
    </>
  );
}
