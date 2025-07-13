"use client";

import { Button } from "@mioto/design-system/Button";
import Heading from "@mioto/design-system/Heading";
import { Stack } from "@mioto/design-system/Stack";
import Text from "@mioto/design-system/Text";
import Link from "next/link";
import { IS_INTRO_PASSED_LS_KEY } from "../../constants";
import { useLocale } from "next-intl";
import { redirect } from "../../../../../../../../i18n/routing";

const handlePassIntroClick = () => {
  localStorage.setItem(IS_INTRO_PASSED_LS_KEY, JSON.stringify(true));
};

export default function Intro() {
  const locale = useLocale();
  if (
    typeof localStorage.getItem(IS_INTRO_PASSED_LS_KEY) === "string"
      ? JSON.parse(localStorage.getItem(IS_INTRO_PASSED_LS_KEY) as string)
      : null
  ) {
    redirect({ href: "/taskpane/user-trees", locale });
  }

  return (
    <Stack className="h-full p-4 justify-between">
      <Stack className="gap-y-2">
        <Heading className="text-center">
          Mioto Word Add-In: How It Works 🙌
        </Heading>
        <Text className="text-center">
          Welcome to the Mioto Word Add-In. Let&apos;s walk through the steps to
          dynamically enrich your documents!
        </Text>
      </Stack>
      <Link href="/taskpane/user-trees" onClick={handlePassIntroClick}>
        <Button className="w-full">Understood</Button>
      </Link>
    </Stack>
  );
}
