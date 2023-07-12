const { ChatOpenAI } = require("langchain/chat_models/openai");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { HNSWLib } = require("langchain/vectorstores/hnswlib");
const { OpenAIEmbeddings } = require("langchain/embeddings/openai");
const {
  ContextualCompressionRetriever,
} = require("langchain/retrievers/contextual_compression");
const {
  LLMChainExtractor,
} = require("langchain/retrievers/document_compressors/chain_extract");
const { RetrievalQAChain } = require("langchain/chains");
const path = require("path");
require("dotenv").config({ path: require("find-config")("../.env") });

const talalInfoAnswering = async (question) => {
  const filePath = path.resolve(__dirname, "../Information/Talal.txt");

  //Starts the LLM
  const llm = new ChatOpenAI({
    openAIApiKey: process.env.OPEN_AI,
    modelName: "gpt-3.5-turbo-0613",
    maxTokens: 500,
  });
  const baseCompressor = LLMChainExtractor.fromLLM(llm);

  //Load the text And spliting it
  let loader = new TextLoader(filePath);
  loader = await loader.load();
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 100,
  });

  const docs = await splitter.splitDocuments(loader, [], {
    chunkHeader: "Talal Alam Information",
    appendChunkOverlapHeader: true,
  });

  //Embedding the text
  const embedding = await HNSWLib.fromDocuments(
    docs,
    new OpenAIEmbeddings({ openAIApiKey: process.env.OPEN_AI })
  );

  //Retrieving the text from from the embeddings
  const retriever = new ContextualCompressionRetriever({
    baseCompressor,
    baseRetriever: embedding.asRetriever(),
  });

  //Calling the chain
  const chain = RetrievalQAChain.fromLLM(llm, retriever);
  const res = await chain.call({
    query: `${question}`,
  });

  return res.text;
};

const talalInfoFuncAi = {
  name: "talalInformation",
  description: "Answers everything about Talal",
  parameters: {
    type: "object",
    properties: {
      question: {
        type: "string",
        description: "the question about Talal",
      },
    },
    required: ["question"],
  },
};

module.exports = { talalInfoAnswering, talalInfoFuncAi };
