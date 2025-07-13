import { Button } from "@mioto/design-system/Button";
import { useTranslations } from "@mioto/locale";
import { Plus } from "@phosphor-icons/react/dist/ssr";

export const AddOptionButton = ({ onClick }: { onClick: () => void }) => {
  const t = useTranslations("plugins.node.form.select");

  return (
    <Button size="small" variant="secondary" onClick={onClick}>
      <Plus />
      {t("addOptionButton")}
    </Button>
  );
};
