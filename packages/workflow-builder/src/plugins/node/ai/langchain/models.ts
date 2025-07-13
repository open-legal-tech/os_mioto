
import { AzureChatOpenAI, AzureOpenAIEmbeddings } from "@langchain/openai";

export const model_3 = new AzureChatOpenAI({
  temperature: 0,
  azureOpenAIApiDeploymentName: "mioto-3_5",
  azureOpenAIApiVersion: "2023-03-15-preview",
  azureOpenAIApiInstanceName: "Editor-AI",
});

export const model_4 = new AzureChatOpenAI({
  temperature: 0,
  azureOpenAIApiDeploymentName: "mioto-4o",
  azureOpenAIApiVersion: "2023-03-15-preview",
  azureOpenAIApiInstanceName: "Editor-AI",
});

export const embeddingModel = new AzureOpenAIEmbeddings({
  azureOpenAIApiVersion: "2023-03-15-preview",
  azureOpenAIApiInstanceName: "Editor-AI",
  azureOpenAIApiEmbeddingsDeploymentName: "embedding",
});
