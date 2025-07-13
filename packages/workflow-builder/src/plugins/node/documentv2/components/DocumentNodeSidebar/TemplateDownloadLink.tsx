import { buttonClasses } from "@mioto/design-system/Button";
import { IconButton, IconButtonLink } from "@mioto/design-system/IconButton";
import { LoadingSpinner } from "@mioto/design-system/LoadingSpinner";
import { useTranslations } from "@mioto/locale";
import { Download } from "@phosphor-icons/react/dist/ssr";
import { useQuery } from "@tanstack/react-query";
import { getTemplateDownloadLinkAction } from "./template.actions";

const buttonVariants = {
  variant: "tertiary",
  colorScheme: "gray",
  square: true,
  size: "small",
} as const;

type Props = {
  templateUuid: string;
  treeUuid: string;
};

export function TemplateDownloadLink({ templateUuid, treeUuid }: Props) {
  const t = useTranslations();
  const { data, isLoading, isSuccess } = useQuery({
    queryKey: ["template-url", templateUuid],
    queryFn: async () => {
      const result = await getTemplateDownloadLinkAction({
        treeInternalTemplateUuid: templateUuid,
        treeUuid,
      });

      if (!result.success) throw result.failure;

      return result.data;
    },
  });

  if (isLoading) {
    return (
      <IconButton
        {...buttonVariants}
        disabled
        tooltip={{
          children: t(
            "plugins.node.document.template-download-link.loading.tooltip",
          ),
        }}
      >
        <LoadingSpinner />
      </IconButton>
    );
  }

  if (!isSuccess) {
    return (
      <IconButton
        {...buttonVariants}
        disabled={isLoading}
        tooltip={{
          children: t(
            "plugins.node.document.template-download-link.error.tooltip",
          ),
        }}
      >
        <Download />
      </IconButton>
    );
  }

  return (
    <IconButtonLink
      href={data.downloadUrl}
      download
      tooltip={{
        children: t("plugins.node.document.template-download-link.tooltip"),
      }}
      className={buttonClasses(buttonVariants)}
    >
      <Download />
    </IconButtonLink>
  );
}
