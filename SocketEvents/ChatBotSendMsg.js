const socket = require("../index");
const ai = require("../AIAgent/functionRouter");

module.exports = (socket) => {
  socket.on("sendMessage", async (message) => {
    const answer = await ai(message);
    socket.emit("response", answer);
  });
};
