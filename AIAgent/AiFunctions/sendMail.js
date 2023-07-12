/**
 * It will be implmeneted in the future for sending mails
 */

const sendMailFuncAi = {
  name: "sendMail",
  description: "Sends a mail to anyone",
  parameters: {
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "the message that is gonna be sent",
      },
      mail: {
        type: "string",
        description: "The mail of the person that is gonna recieve the message",
      },
    },
    required: ["message", "mail"],
  },
};

const sendMail = (text, reciever) => {
  console.log(text, reciever);
};

module.exports = { sendMailFuncAi, sendMail };
