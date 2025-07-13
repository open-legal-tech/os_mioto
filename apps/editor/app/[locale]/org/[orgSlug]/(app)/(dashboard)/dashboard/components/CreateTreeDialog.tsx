"use client";
import {
  DialogDefault,
  DialogRoot,
  type DialogRootProps,
} from "@mioto/design-system/Dialog";
import { Form } from "@mioto/design-system/Form";
import { useOrg } from "@mioto/design-system/Org";
import { stackClasses } from "@mioto/design-system/Stack";
import { useTranslations } from "@mioto/locale";
import { createTreeAction } from "@mioto/server/actions/createTree.action";
import { TreeNameInput } from "@mioto/workflow-builder/editor/components/TreeNameInput";
import { useRouter } from "../../../../../../../../i18n/routing";
type Props = Pick<DialogRootProps, "open" | "onOpenChange">;

export const CreateTreeDialog = ({ open, onOpenChange }: Props) => {
  const t = useTranslations();
  const methods = Form.useForm({
    defaultValues: { treeName: "", description: "" },
  });
  const router = useRouter();
  const orgSlug = useOrg();

  const onSubmit = methods.handleAsyncSubmit(async (values) => {
    const result = await createTreeAction({
      name: values.treeName,
      description: values.description,
    });

    methods.reset();
    onOpenChange?.(false);
    router.push(`/org/${orgSlug}/builder/${result.data.treeUuid}`);
  });

  return (
    <Form.Provider methods={methods}>
      <DialogRoot
        open={open}
        onOpenChange={(open) => {
          if (!open) methods.reset();
          onOpenChange?.(open);
        }}
      >
        <DialogDefault
          title={t("app.dashboard.new-project.create-new.title")}
          ConfirmationButton={
            <Form.SubmitButton>
              {t("app.dashboard.new-project.create-new.submit")}
            </Form.SubmitButton>
          }
        >
          <Form.Root className={stackClasses({}, "gap-2")} onSubmit={onSubmit}>
            <TreeNameInput />
            <Form.Field
              Label={t(
                "app.dashboard.new-project.create-new.form.description.label",
              )}
            >
              <Form.Textarea
                {...methods.register("description")}
                className="w-full"
                rows={5}
              />
            </Form.Field>
          </Form.Root>
        </DialogDefault>
      </DialogRoot>
    </Form.Provider>
  );
};
