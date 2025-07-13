import { Failure } from "@mioto/errors";

export type TTemplateError = {
  name?: string;
  message?: string;
  tag?: string;
  explanation?: string;
};

export const TemplateFailure = (templateErrors: TTemplateError[]) =>
  new Failure({
    code: "invalid_template",
    additionalData: templateErrors,
  });

export const TemplateTagGenerationFailure = (templateErrors: TTemplateError) =>
  new Failure({
    code: "invalid_template_tag_generation_request",
    additionalData: templateErrors,
  });
