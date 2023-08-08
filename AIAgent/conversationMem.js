const { OpenAI } = require("langchain/llms/openai");
const { BufferMemory, ChatMessageHistory } = require("langchain/memory");
const { ConversationChain } = require("langchain/chains");
const { HumanMessage, AIMessage, SystemMessage } = require("langchain/schema");
require("dotenv").config({ path: require("find-config")("../.env") });

//All the messages that the curren session has with the chatBot

/**
 * Adds memory to the chatBot
 */

const conversationMem = async (humanMsg, pastMessages) => {
  const newPastMessages = [
    new SystemMessage("You are a good assitant, your name is Bolt"),
  ];

  if (pastMessages.length >= 1) {
    pastMessages.map((message) => {
      const isHuman = message.human;
      const msg = message.text;
      isHuman === true
        ? newPastMessages.push(new HumanMessage(`${msg}`))
        : newPastMessages.push(new AIMessage(`${msg}`));
    });
  }
  const model = new OpenAI({ openAIApiKey: process.env.OPEN_AI });
  const memory = new BufferMemory({
    chatHistory: new ChatMessageHistory(newPastMessages),
  });
  const chain = new ConversationChain({ llm: model, memory: memory });
  const res = await chain.call({ input: humanMsg });
  return res.response;
};

module.exports = { conversationMem };
