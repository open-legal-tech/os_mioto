"use client";

import { Button } from "@mioto/design-system/Button";
import { Combobox } from "@mioto/design-system/Combobox";
import { DialogDefault, useDialogContext } from "@mioto/design-system/Dialog";
import { Form } from "@mioto/design-system/Form";
import { Notification } from "@mioto/design-system/Notification";
import { SelectWithCombobox } from "@mioto/design-system/SelectWithCombobox";
import { stackClasses } from "@mioto/design-system/Stack";
import Text from "@mioto/design-system/Text";
import { useTranslations } from "@mioto/locale";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import React from "react";

export type SellTreeDialogProps = {
  shareableTrees: {
    id: string;
    name: string;
  }[];
  shareSessionAction: ({ treeUuid }: { treeUuid: string }) => Promise<{
    readonly success: true;
    readonly link: `${string}/org/${string}/render/${string}/${string}`;
  }>;
};

export function ShareSessionDialogClient({
  shareableTrees,
  shareSessionAction,
}: SellTreeDialogProps) {
  const methods = Form.useForm<{ tree: string }>();

  const t = useTranslations();

  const [link, setLink] = React.useState<string | null>();
  const { close } = useDialogContext();

  return (
    <Form.Provider methods={methods}>
      <DialogDefault
        title={t("app.client.share-tree.dialog.title")}
        ConfirmationButton={
          !link ? (
            <Form.SubmitButton>
              {t("app.client.share-session.dialog.submit")}
            </Form.SubmitButton>
          ) : (
            <Button onClick={close}>Dialog schließen</Button>
          )
        }
        withCancelButton={!link}
      >
        <Form.Root
          className="gap-4"
          onSubmit={methods.handleAsyncSubmit(async (values) => {
            const result = await shareSessionAction({ treeUuid: values.tree });

            setLink(result.link);
            methods.reset();
          })}
        >
          <Form.Field
            Label={t("app.client.share-tree.dialog.form.app.label")}
            name="tree"
          >
            <SelectWithCombobox
              options={shareableTrees.map((shareableTree) => {
                return {
                  type: "option",
                  id: shareableTree.id,
                  name: shareableTree.name,
                  data: {},
                };
              })}
              onSelect={(value) => {
                if (typeof value !== "string") {
                  console.error(
                    "The ShareSession Tree select should only return a string",
                  );
                  return;
                }

                methods.setValue("tree", value);
              }}
              {...methods.register("tree", { required: true })}
              id="tree"
              ComboboxInput={(props) => (
                <Combobox.Input
                  aria-label={t(
                    "app.client.share-tree.dialog.form.app.aria-label",
                  )}
                  placeholder={t(
                    "app.client.share-tree.dialog.form.app.placeholder",
                  )}
                  Icon={(props) => <MagnifyingGlass {...props} />}
                  {...props}
                />
              )}
              comboboxListProps={{
                "aria-label": t(
                  "app.client.share-tree.dialog.form.app.list.aria-label",
                ),
              }}
            />
          </Form.Field>
        </Form.Root>
        {link ? (
          <Button
            variant="ghost"
            className={stackClasses({}, "gap-1 items-center bg-gray2 p-2")}
            onClick={() => {
              try {
                navigator.clipboard.writeText(link);
                Notification.add({
                  Title: t(
                    "app.client.share-session.dialog.copy-link.success.notification.title",
                  ),
                  variant: "success",
                });
              } catch (e) {
                Notification.add({
                  Title: t(
                    "app.client.share-session.dialog.copy-link.error.notification.title",
                  ),
                  Content: t(
                    "app.client.share-session.dialog.copy-link.error.notification.content",
                  ),
                  variant: "warning",
                });
              }
            }}
          >
            <Text>
              {t("app.client.share-session.dialog.copy-link.link.cta")}
            </Text>
            <span className="break-all rounded font-none text-smallText">
              {link}
            </span>
          </Button>
        ) : null}
      </DialogDefault>
    </Form.Provider>
  );
}
