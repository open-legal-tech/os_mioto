"use client";

import Link from "@mioto/design-system/Link";
import { useTranslations } from "@mioto/locale";
import { CaretLeft } from "@phosphor-icons/react/dist/ssr";
import { P, match } from "ts-pattern";
import { usePathname } from "../../../../../../i18n/routing";

export function BackButton({ className }: { className?: string }) {
  const pathname = usePathname();
  const t = useTranslations();

  return match(pathname)
    .with(
      P.string.includes("/client/tree").or(P.string.includes("/render/")),

      () => (
        <Link
          orgLink
          size="large"
          className={`max-w-max text-primary5 ring-offset-[0px] gap-1 font-weak ${className}`}
          href="/client"
        >
          <CaretLeft />
          <span className="hidden md:inline">
            {t("client-portal.dashboard.backButton")}
          </span>
        </Link>
      ),
    )
    .otherwise(() => <div />);
}
