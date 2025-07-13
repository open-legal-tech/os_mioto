import { getUnknownUser } from "@mioto/server/db/getUnknownUser";
import { ImageResponse } from "next/og";
import { createAcronym } from "./client/shared/createAcronym";
import builderEnv from "../../../../../env";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default async function Icon({
  params: { orgSlug },
}: {
  params: { orgSlug: string };
}) {
  // TODO Because of a bug with next/og and turbopack we disable this in development
  if (builderEnv.APP_ENV === "development")
    return new Response(null, { status: 404 });

  const { db } = await getUnknownUser();

  const org = await db.organization.findUnique({
    where: { slug: orgSlug },
    select: {
      name: true,
    },
  });

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 14,
          background: "#0b1c46",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          padding: "8px",
          borderRadius: "4px",
        }}
      >
        {org?.name ? createAcronym(org.name) : "M"}
      </div>
    ),
    size,
  );
}
