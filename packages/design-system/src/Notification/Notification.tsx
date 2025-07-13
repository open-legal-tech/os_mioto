import {
  Check,
  Info,
  Lightning,
  Warning,
  X,
} from "@phosphor-icons/react/dist/ssr";
import * as ToastPrimitive from "@radix-ui/react-toast";
import type { TNotification } from ".";
import { Button, type ButtonProps } from "../Button";
import Heading from "../Heading";
import { Row } from "../Row";
import { Stack } from "../Stack";
import Text from "../Text";
import { twMerge } from "../tailwind/merge";
import { remove } from "./NotificationState";
import "./Toast.css";
import Badge from "../Badge";

const containerClasses = "rounded bg-white border border-gray5";

const icons = {
  danger: Warning,
  info: Info,
  success: Check,
  warning: Lightning,
} as const;

const variantColorSchemeClassName = {
  danger: "colorScheme-danger",
  info: "colorScheme-info",
  success: "colorScheme-success",
  warning: "colorScheme-warning",
};

export function Notification({
  notification: {
    Title,
    Content,
    id,
    variant = "info",
    customIcon,
    explanation,
    actions,
    type,
    duration,
  },
}: {
  notification: TNotification;
}) {
  const isElementTitle = typeof Title !== "string";
  const isElementContent = typeof Content !== "string";
  const IconSVG = customIcon ? customIcon : icons[variant];

  const Actions = actions ? () => actions({ dismiss: () => remove(id) }) : null;
  const Explanation = explanation ? () => explanation() : null;

  return (
    <ToastPrimitive.Root
      type={type}
      onOpenChange={(open) => {
        if (!open) {
          setTimeout(() => {
            remove(id);
          }, 200);
        }
      }}
      className={twMerge(
        containerClasses,
        variantColorSchemeClassName[variant],
        "shadow-lg",
        "data-[state=open]:animate-fadeIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut",
      )}
      duration={duration}
    >
      <Row className="p-5 gap-5 items-center">
        <Badge square colorScheme="inherit">
          <IconSVG />
        </Badge>
        <Stack className="flex-1 gap-2 overflow-x-hidden">
          <Row className="flex-1 justify-between gap-2 items-center">
            <ToastPrimitive.Title asChild>
              {isElementTitle ? (
                Title
              ) : (
                <Heading size="extra-small">{Title}</Heading>
              )}
            </ToastPrimitive.Title>
            <ToastPrimitive.Close aria-label="Schließen" asChild>
              <Button variant="tertiary" square>
                <X />
              </Button>
            </ToastPrimitive.Close>
          </Row>
          {Content ? (
            <ToastPrimitive.Description asChild>
              {isElementContent ? <Content /> : <Text>{Content}</Text>}
            </ToastPrimitive.Description>
          ) : null}
        </Stack>
      </Row>
      {explanation || Actions ? (
        <Stack className="bg-gray2 p-4 gap-2">
          {Explanation ? (
            <Stack className="max-h-[300px] overflow-y-auto">
              <Explanation />
            </Stack>
          ) : null}
          {Actions ? (
            <Row className="gap-2 justify-end">
              <Actions />
            </Row>
          ) : null}
        </Stack>
      ) : null}
    </ToastPrimitive.Root>
  );
}

export * from "./NotificationState";

export const Action = ({
  children,
  altText,
  size = "small",
  ...props
}: ButtonProps & { altText: string }) => {
  return (
    <ToastPrimitive.Action altText={altText} asChild>
      <Button size={size} {...props}>
        {children}
      </Button>
    </ToastPrimitive.Action>
  );
};
