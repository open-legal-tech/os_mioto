"use client";

import { Combobox } from "@mioto/design-system/Combobox";
import { DialogDefault, useDialogContext } from "@mioto/design-system/Dialog";
import { Form } from "@mioto/design-system/Form";
import { HelpTooltip } from "@mioto/design-system/HelpTooltip";
import Label from "@mioto/design-system/Label";
import { Notification } from "@mioto/design-system/Notification";
import { Row } from "@mioto/design-system/Row";
import { SelectWithCombobox } from "@mioto/design-system/SelectWithCombobox";
import { Stack } from "@mioto/design-system/Stack";
import { useTranslations } from "@mioto/locale";
import { sellTreeAction } from "@mioto/server/actions/sellTree.action";
import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";

export type SellTreeDialogProps = {
  sellTo: { uuid: string; name?: string };
  shareableTrees: {
    id: string;
    name: string;
    credits?: number;
  }[];
};

export function ShareTreeDialogClient({
  sellTo,
  shareableTrees,
}: SellTreeDialogProps) {
  const methods = Form.useForm<{ tree: string; credits: number }>();
  const { close } = useDialogContext();

  const t = useTranslations();

  return (
    <Form.Provider methods={methods}>
      <DialogDefault
        title={t("app.client.share-tree.dialog.title")}
        ConfirmationButton={
          <Form.SubmitButton>
            {t("app.client.share-tree.dialog.submit")}
          </Form.SubmitButton>
        }
        description={t("app.client.share-tree.dialog.description", {
          name: sellTo.name,
        })}
      >
        <Form.Root
          className="gap-4"
          onSubmit={methods.handleAsyncSubmit(async (values) => {
            await sellTreeAction({
              sellToUuid: sellTo.uuid,
              shareTreeUuid: values.tree,
              credits: values.credits,
            });

            Notification.add({
              Title: t(
                "app.client.share-tree.dialog.notification.success.title",
              ),
              variant: "success",
            });

            methods.reset();
            close();
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
                  data: {
                    credits: shareableTree.credits,
                  },
                  id: shareableTree.id,
                  name: shareableTree.name,
                };
              })}
              {...methods.register("tree", { required: true })}
              onSelect={(value) => {
                const treeCredits = shareableTrees.find(
                  (shareAbleTree) => shareAbleTree.id === value,
                )?.credits;

                methods.setValue("tree", value as string);

                treeCredits != null
                  ? methods.setValue("credits", treeCredits)
                  : null;
              }}
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
          <Stack className="gap-2">
            <Row className="gap-1">
              <Label htmlFor="sessions">
                {t("app.client.share-tree.dialog.form.credits.label")}
              </Label>
              <HelpTooltip>
                {t("app.client.share-tree.dialog.credits.help-tooltip")}
              </HelpTooltip>
            </Row>
            <Form.Input
              id="sessions"
              type="number"
              {...methods.register("credits", { valueAsNumber: true })}
              placeholder={t(
                "app.client.share-tree.dialog.credits.placeholder",
              )}
            />
          </Stack>
        </Form.Root>
      </DialogDefault>
    </Form.Provider>
  );
}
