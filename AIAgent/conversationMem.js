const { OpenAI } = require("langchain/llms/openai");
const { BufferMemory, ChatMessageHistory } = require("langchain/memory");
const { ConversationChain } = require("langchain/chains");
const { HumanMessage, AIMessage, SystemMessage } = require("langchain/schema");
require("dotenv").config({ path: require("find-config")("../.env") });

let pastMessages = [
  new SystemMessage(
    "Tu eres una asistente mal hablada que dice muchas grocerias, tu nombre es Bolt"
  ),
];

const conversationMem = async (humanMsg) => {
  const model = new OpenAI({ openAIApiKey: process.env.OPEN_AI });
  const memory = new BufferMemory({
    chatHistory: new ChatMessageHistory(pastMessages),
  });
  const chain = new ConversationChain({ llm: model, memory: memory });
  const res = await chain.call({ input: humanMsg });
  console.log(res.response);
  console.log(pastMessages);
  return res.res;
};

module.exports = { conversationMem, pastMessages };
