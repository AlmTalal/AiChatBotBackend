const socket = require("../index");
const ai = require("../AIAgent/functionRouter");

export default function (socket) {
  socket.on("sendMessage", async (message) => {
    const answer = await ai(message);
    socket.emit("response", answer);
  });
}
