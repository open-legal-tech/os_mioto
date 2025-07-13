"use server";

import { Failure } from "@mioto/errors";
import { getCurrentEmployee } from "@mioto/server/db/getCurrentEmployee";
import { proxy } from "valtio";
import * as Y from "yjs";
import { z } from "zod";
import type { TTree } from "../../tree/exports/types";
import { bind } from "../../tree/utils/exports/bind";
import {
  ZTreeExport,
  convertTreeToExport,
  convertTreeToReadableExport,
} from "../utils/utils";
import { getTree } from "./getTree";

const invalid_file = new Failure({
  code: "export_invalid_file",
});

const createExportContent = (
  name: string,
  json: any,
  yDoc: Y.Doc,
  description: string | null,
) => {
  const exportContent = ZTreeExport.safeParse({
    name,
    description,
    treeData: json,
    treeDocument: Buffer.from(Y.encodeStateAsUpdate(yDoc)),
  });

  if (!exportContent.success) {
    console.error(exportContent.error);

    const file = JSON.stringify({
      name,
      description,
      treeDocument: Buffer.from(Y.encodeStateAsUpdate(yDoc)),
      treeData: json,
    });

    const fileName = `${name}.json`;

    return {
      success: true,
      data: {
        file,
        failure: invalid_file.body(),
        fileName,
      },
    };
  }

  const file = JSON.stringify(exportContent.data);
  const fileName = `${name}.json`;

  return {
    success: true,
    data: {
      file,
      fileName,
    },
  };
};

const exportTreeInput = z.object({ treeUuid: z.string() });

type TExportTreeInput = z.infer<typeof exportTreeInput>;

export async function exportTreeAction({ treeUuid }: TExportTreeInput) {
  const { db, token } = await getCurrentEmployee();
  const tree = await getTree(db)({ treeUuid, token });

  if (!tree.success) {
    throw new Error("Tree not found");
  }

  const yDoc = new Y.Doc();
  const buffer = new Uint8Array(tree?.data.tree.document ?? Buffer.from([]));
  Y.applyUpdate(yDoc, buffer);
  const treeMap = yDoc.getMap("tree");
  const json = proxy({} as TTree);
  bind(json, treeMap);

  return new Promise<ReturnType<typeof createExportContent>>((resolve) => {
    yDoc.on("update", (_1, _2, doc) => {
      resolve(
        createExportContent(
          tree.data.tree.name,
          json,
          doc,
          tree.data.tree.description,
        ),
      );
    });

    // We separate to steps. First we adjust the export for both the readable and the importable version.
    // Then we adjust the readable version to be readable.
    convertTreeToExport(json, treeMap);
    const readableJson = convertTreeToReadableExport(treeMap.toJSON() as TTree);

    setTimeout(() => {
      resolve(
        createExportContent(
          tree.data.tree.name,
          readableJson,
          yDoc,
          tree.data.tree.description,
        ),
      );
    }, 100);
  });
}
