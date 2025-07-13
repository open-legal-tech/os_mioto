import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { embeddingModel } from "./models";

export async function createVectorStoreFromPdfs(files: Blob[]) {
  const docs = (
			await Promise.all(
				files.map(async (file) => {
					const loader = new PDFLoader(file, {});

					return await loader.load();
				}),
			)
		).flat();

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
    keepSeparator: true,
  });

  const splitDocs = await textSplitter.splitDocuments(docs);

  return await MemoryVectorStore.fromDocuments(splitDocs, embeddingModel);
}
