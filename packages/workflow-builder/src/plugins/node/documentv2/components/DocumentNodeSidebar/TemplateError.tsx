import Badge from "@mioto/design-system/Badge";
import { Stack } from "@mioto/design-system/Stack";
import Text from "@mioto/design-system/Text";
import type { TTemplateError } from "@mioto/server/Document/shared";

export const TemplateError = ({
  templateError,
}: {
  templateError: TTemplateError;
}) => {
  return (
    <Stack className="bg-gray1 rounded p-2">
      <Badge colorScheme="gray" className="max-w-max mb-1">
        Tag: <span className="font-weak">{templateError.tag}</span>
      </Badge>
      <Text size="small" className="font-strong">
        {templateError.message}
      </Text>
      <Text size="small">{templateError.explanation}</Text>
    </Stack>
  );
};
