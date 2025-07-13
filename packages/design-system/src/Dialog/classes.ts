import { buttonClasses } from "../Button";
import { cardClasses } from "../Card";
import { headingClasses } from "../Heading/classes";
import { rowClasses } from "../Row";
import { textClasses } from "../Text/classes";
import { tv } from "../tailwind/tv";

export const dialogClasses = tv({
  slots: {
    card: cardClasses(
      "lg:w-[500px] gap-4 p-6 flex flex-col border-gray7 shadow-lg",
    ),
    heading: headingClasses({ className: "hyphens-none" }),
    description: textClasses({}),
    cancel: buttonClasses({ variant: "tertiary" }),
    submit: buttonClasses({ variant: "primary" }),
    buttonRow: rowClasses({}, "gap-2 self-end"),
  },
  variants: {
    destructive: {
      true: {
        submit: buttonClasses({ variant: "primary", colorScheme: "danger" }),
      },
    },
  },
});
