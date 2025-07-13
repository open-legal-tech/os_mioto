import { ButtonLink } from "@mioto/design-system/Button";
import { Form } from "@mioto/design-system/Form";
import Separator from "@mioto/design-system/Separator";
import { Stack } from "@mioto/design-system/Stack";
import Text from "@mioto/design-system/Text";
import { useTranslations } from "@mioto/locale";
import { checkRegisterAccessAction } from "@mioto/server/actions/checkAccess.action";
import {
  descriptionClasses,
  headerClasses,
  headingClasses,
} from "../../../shared/AuthCard";

type AccessFormProps = {
  onSuccess: (code: string) => void;
  className?: string;
};

export const AccessForm = ({ onSuccess, className }: AccessFormProps) => {
  const t = useTranslations();

  const methods = Form.useForm<{
    accessCode: string;
  }>();

  return (
    <Stack className={`max-w-[500px] gap-6 ${className}`} key="access-form">
      <header className={headerClasses}>
        <h2 className={headingClasses}>
          <span className="mr-4">💫</span>
          {t("auth.register.access-form.title")}
        </h2>
      </header>
      <main className="gap-6 grid">
        <Text className={descriptionClasses}>
          {t("auth.register.access-form.description")}
        </Text>
        <Form.Provider methods={methods}>
          <Form.Root
            onSubmit={methods.handleAsyncSubmit(async (values) => {
              const result = await checkRegisterAccessAction(values);

              if (!result.success) {
                methods.setError("accessCode", {
                  message: t(
                    "auth.register.access-form.errors.access_code_not_found",
                  ),
                });
                return;
              }

              onSuccess(methods.getValues("accessCode"));
            })}
          >
            <Form.Field Label="Zugangscode">
              <Form.Input
                {...methods.register("accessCode", {
                  required: {
                    value: true,
                    message: t(
                      "auth.register.access-form.access-code.required.message",
                    ),
                  },
                })}
              />
            </Form.Field>
            <Form.SubmitButton className="mt-4" type="submit">
              {t("auth.register.access-form.submit")}
            </Form.SubmitButton>
          </Form.Root>
        </Form.Provider>
      </main>
    </Stack>
  );
};
