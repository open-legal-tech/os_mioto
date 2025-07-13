"use client";

import { Button } from "@mioto/design-system/Button";
import {
  DialogButtonRow,
  DialogContent,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@mioto/design-system/Dialog";
import { IconButton } from "@mioto/design-system/IconButton";
import Text from "@mioto/design-system/Text";
import { useTranslations } from "@mioto/locale";
import { ArrowClockwise } from "@phosphor-icons/react/dist/ssr";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useRendererContext } from "./Context";

export function ResetButton({ className }: { className?: string }) {
  const [open, setOpen] = React.useState(false);
  const {
    config: { withResetConfirmation },
    send,
  } = useRendererContext();
  const t = useTranslations("renderer");
  const queryClient = useQueryClient();

  const onReset = async () => {
    send({ type: "RESET" });

    setOpen(false);
    queryClient.invalidateQueries({
      queryKey: ["session"],
    });
  };

  return withResetConfirmation ? (
    <DialogRoot open={open} onOpenChange={setOpen} destructive>
      <DialogTrigger asChild>
        <IconButton
          tooltip={{ children: t("reset.button.tooltip") }}
          variant="tertiary"
          square
          className={className}
        >
          <ArrowClockwise />
        </IconButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("reset.alert.title")}</DialogTitle>
        </DialogHeader>
        <Text>{t("reset.alert.description")}</Text>
        <DialogButtonRow asChild>
          <Button className="reset-submit-button" onAsyncClick={onReset}>
            {t("reset.alert.submit")}
          </Button>
        </DialogButtonRow>
      </DialogContent>
    </DialogRoot>
  ) : (
    <IconButton
      tooltip={{ children: t("reset.button.tooltip") }}
      variant="tertiary"
      square
      className={`gap-2 ${className} reset-button`}
      onClick={onReset}
    >
      <ArrowClockwise />
    </IconButton>
  );
}
