import { checkAuthenticated } from "@mioto/server/db/checkAuthenticated";
import PizZip from "pizzip";

export async function GET(
  _: Request,
  props: { params: Promise<{ themeUuid: string }> },
) {
  const params = await props.params;

  const { themeUuid } = params;

  const user = await checkAuthenticated();

  if (user === "unauthenticated") return new Response(null, { status: 401 });

  const result = await user.db.theme.findUnique({
    where: {
      uuid: themeUuid,
    },
  });

  if (!result?.content) return new Response(null, { status: 404 });

  const zip = new PizZip();

  zip.file("theme.json", JSON.stringify(result.content));
  if (result.customCss) {
    zip.file("custom.css", result.customCss);
  }

  return new Response(
    zip.generate({ type: "uint8array" }) as unknown as BodyInit,
  );
}
