"use client";

import { cardClasses } from "@mioto/design-system/Card";
import { IconButton, IconButtonLink } from "@mioto/design-system/IconButton";
import { Row } from "@mioto/design-system/Row";
import Text from "@mioto/design-system/Text";
import { twMerge } from "@mioto/design-system/tailwind/merge";
import {
  ArrowLeft,
  ArrowRight,
  FloppyDisk,
} from "@phosphor-icons/react/dist/ssr";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { getFileAction } from "./getFile.action";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { useRendererContext } from "../../../renderer/Context";
import type { IFileVariable } from "../../../variables/exports/types";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function PDFPreview({
  variable,
  blurFromPageOnwards,
  downloadButton,
  width,
}: {
  variable: IFileVariable;
  blurFromPageOnwards?: string;
  downloadButton?: boolean;
  width: number;
}) {
  const {
    config: { userUuid },
  } = useRendererContext();
  const { data, isLoading } = useQuery({
    queryKey: ["fileDownload", variable.id],
    queryFn: async () => {
      if (!variable.value) return undefined;

      return await getFileAction({
        fileUuid: variable.value.uuid,
        userUuid,
      });
    },
  });

  const [numPages, setNumPages] = React.useState<number>();
  const [pageNumber, setPageNumber] = React.useState<number>(1);
  const [renderedPageNumber, setRenderedPageNumber] = React.useState<
    number | null
  >(null);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  const pdfLoading = renderedPageNumber !== pageNumber;
  const pdfLoadingForward = (renderedPageNumber ?? 0) < pageNumber;
  const pdfLoadingBackward = (renderedPageNumber ?? 0) > pageNumber;

  const previewData = React.useMemo(
    () => (data ? { data: data.data } : undefined),
    [data],
  );

  return !isLoading && data ? (
    <>
      <Document
        file={previewData}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadStart={() => setNumPages(undefined)}
        className={twMerge(
          "border border-gray5 bg-white flex justify-center",
          numPages ? "" : "hidden",
        )}
        loading={null}
      >
        {pdfLoading && renderedPageNumber ? (
          <Page
            key={renderedPageNumber}
            pageNumber={renderedPageNumber}
            className={twMerge(
              "animate-pulse",
              blurFromPageOnwards && pageNumber >= Number(blurFromPageOnwards)
                ? "blur"
                : "",
            )}
            devicePixelRatio={
              blurFromPageOnwards && pageNumber >= Number(blurFromPageOnwards)
                ? 0.1
                : undefined
            }
            renderTextLayer={
              !blurFromPageOnwards || pageNumber <= Number(blurFromPageOnwards)
            }
            width={width}
          />
        ) : null}
        <Page
          width={width}
          key={pageNumber}
          pageNumber={pageNumber}
          className={twMerge(
            blurFromPageOnwards && pageNumber >= Number(blurFromPageOnwards)
              ? "blur"
              : "",
            pdfLoading ? "hidden" : "",
          )}
          onRenderSuccess={() => setRenderedPageNumber(pageNumber)}
          devicePixelRatio={
            blurFromPageOnwards && pageNumber >= Number(blurFromPageOnwards)
              ? 0.1
              : undefined
          }
          renderTextLayer={
            !blurFromPageOnwards || pageNumber <= Number(blurFromPageOnwards)
          }
        />
      </Document>
      <Row
        className={cardClasses([
          "items-center justify-between border-t-0 rounded-t-none bg-gray2",
          numPages ? "" : "hidden",
        ])}
      >
        <IconButton
          tooltip={{ children: "Vorherige Seite" }}
          disabled={pageNumber <= 1}
          onClick={previousPage}
          size="small"
          isLoading={pdfLoadingBackward}
        >
          <ArrowLeft />
        </IconButton>
        <Text size="small">
          {pageNumber || (numPages ? 1 : "--")} von {numPages || "--"}
        </Text>
        <Row className="gap-2">
          {downloadButton ? (
            <IconButtonLink
              tooltip={{ children: "Speichern" }}
              size="small"
              href={data.downloadLink}
            >
              <FloppyDisk />
            </IconButtonLink>
          ) : null}
          <IconButton
            tooltip={{ children: "Nächste Seite" }}
            disabled={pageNumber >= (numPages ?? 0)}
            onClick={nextPage}
            size="small"
            isLoading={pdfLoadingForward}
          >
            <ArrowRight />
          </IconButton>
        </Row>
      </Row>
    </>
  ) : null;
}

export default PDFPreview;
