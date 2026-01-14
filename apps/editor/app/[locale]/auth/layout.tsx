import { Link } from "@mioto/design-system/Link";
import { Logo } from "@mioto/design-system/Logo";
import {
  getTranslations,
  setRequestLocale,
} from "@mioto/locale/server";
import Image from "next/image";
import backgroundImage from "../../../public/Mioto_Product.png";
import { containerClasses } from "../../shared/AuthCard";
// import { AnalyticsProvider } from "../shared/AnalyticsProvider";
import { BottomLeftBlocks } from "./BottomLeftBlocks";
import { TopRightBlocks } from "./TopRightBlocks";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function Page(props: Props) {
  const { locale } = await props.params;

  const { children } = props;

  setRequestLocale(locale);
  const t = await getTranslations({ locale });

  return (
    // <AnalyticsProvider>
    <div
      className="grid bg-gray1 grid-rows-[max-content,1fr] items-end isolate h-[100dvh]"
      style={{
        gridTemplateColumns: "1fr 20% min(50%, 700px)",
      }}
    >
      <div className="row-[1] w-max col-span-full lg:ml-4 justify-center flex lg:justify-start z-50 bg-white lg:bg-transparent">
        <Link
          href="/docs"
          className="rounded w-[80px] lg:w-[110px] focus:outer-focus p-2"
        >
          <Logo large />
        </Link>
      </div>
      <div className="hidden lg:grid lg:col-span-2 lg:col-start-1 row-span-full h-[90%] relative items-end grid-cols-[1fr] lg:grid-cols-[100px_1fr]">
        <Image
          src={backgroundImage}
          alt={t("auth.layout.image.alt")}
          className="object-cover h-[80%] -mb-4 w-full object-left z-10 col-span-1 col-start-2 rounded-tl-md"
          priority
        />
        <TopRightBlocks className="absolute top-[70px] right-[-30px]" />
        <BottomLeftBlocks className="absolute left-0 bottom-0" />
      </div>
      <div
        className={containerClasses(
          "col-span-full lg:col-start-3 lg:col-end-4 w-full h-full row-span-[2] md:row-span-full z-10 relative border-l border-gray5 p-6 lg:p-8 items-center",
        )}
      >
        {children}
      </div>
    </div>
    // </AnalyticsProvider>
  );
}
