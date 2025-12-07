import type { getFileContent } from "@mioto/server/File/getContent";

export function convertContentToStream(
  file: NonNullable<Awaited<ReturnType<ReturnType<typeof getFileContent>>>>,
) {
  const webStream = new ReadableStream({
    start(controller) {
      file.content.readableStreamBody?.on("data", (chunk) =>
        controller.enqueue(chunk),
      );
      file.content.readableStreamBody?.on("end", () => controller.close());
      file.content.readableStreamBody?.on("error", (err) =>
        controller.error(err),
      );
    },
  });

  return new Response(webStream, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Disposition": `attachment; filename="${file.displayName}"`,
    },
  });
}
