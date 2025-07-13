import { useTranslations } from "@mioto/locale";
import type React from "react";
import { IconButtonLink } from "../IconButton";
import Logo from "../Logo";
import { Row } from "../Row";
import { Skeleton } from "../Skeleton";
import { twMerge } from "../tailwind/merge";

const containerClasses = "bg-white border-b border-gray5";

const contentClasses = "flex items-center gap-2 h-[56px]";

export type HeaderProps = {
  children?: React.ReactNode;
  className?: string;
  LeftSlot?: React.ReactNode;
  isLoading?: boolean;
  userEmail?: string;
  RightSlot?: React.ReactNode;
};

export const Header = ({
  children,
  className,
  LeftSlot = <div />,
  isLoading,
  userEmail,
  RightSlot = <div />,
}: HeaderProps) => {
  const t = useTranslations();

  return (
    <div
      className={
        className ? twMerge(containerClasses, className) : containerClasses
      }
    >
      <header className={contentClasses}>
        <div className="border-r border-b border-gray5 flex-shrink-0 z-10">
          <IconButtonLink
            orgLink
            square
            className="rounded-none border-0 w-[55px] h-[56px]"
            tooltip={{
              children: t("components.header.homeButtonHiddenLabel"),
              delay: 500,
              side: "right",
            }}
            href="/"
          >
            <Logo className="w-5 h-5" />
          </IconButtonLink>
        </div>
        <div className="px-2 flex flex-1">
          <Row className="gap-2 items-center">
            {isLoading ? (
              <Skeleton className="w-[200px] h-full mx-2" />
            ) : (
              LeftSlot
            )}
          </Row>
          {isLoading ? (
            <div className="flex-1" />
          ) : (
            (children ?? <div className="flex-1" />)
          )}
          {RightSlot}
        </div>
      </header>
    </div>
  );
};
