const { Configuration, OpenAIApi } = require("openai");
const { AIMessage, HumanMessage } = require("langchain/schema");
const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });
const configuration = new Configuration({
  apiKey: process.env.OPEN_AI,
});
const openai = new OpenAIApi(configuration);

/**
 * It Takes the user Message and routes it to the propper function
 */

//Functions
const {
  talalInfoAnswering,
  talalInfoFuncAi,
} = require("./AiFunctions/talalInfo");
const { sendMailFuncAi } = require("./AiFunctions/sendMail");
const { conversationMem, pastMessages } = require("./conversationMem");

//Takes the user message
const ai = async (message) => {
  const messages = [
    { role: "system", content: "You are a rude assitant" },
    {
      role: "user",
      content: message,
    },
  ];

  pastMessages.push(new HumanMessage(message));

  /**
   * Here you put all the functions that you need in this object:
   * {
   *    name : "Name of the function "
   *    description : "What the function does"
   *    parameters : {
   *        type: "type of the func parameters"
   *        properties : {
   *            the name of the parameter :{
   *                type : "the type of the parameter"
   *                description : "the description of the parameter"
   *            }
   *        }
   *        required : ["the required prperties to call the function"]
   *    }
   * }
   * see https://platform.openai.com/docs/guides/gpt/function-calling for more information
   * See an example in talalInfo.js
   */
  const functions = [sendMailFuncAi, talalInfoFuncAi];

  //It takes the message an redirects it to the propper function
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo-0613",
    messages: messages,
    functions: functions,
    function_call: "auto",
  });
  const callFunc = response.data.choices[0].message.function_call;
  if (!!callFunc) {
    const name = callFunc.name;
    const arguments = JSON.parse(callFunc.arguments);
    if (name === "sendMail") {
      const res = await sendMail(arguments.message, arguments.mail);
      pastMessages.push(new AIMessage(res));
      return res;
    }
    if (name === "talalInformation") {
      const res = await talalInfoAnswering(arguments.question);
      pastMessages.push(new AIMessage(res));
      return res;
    }
  } else {
    conversationMem(message);
  }
};

module.exports = ai;
