const express = require("express");
const app = express();
const cors = require("cors");
const chatBotSockets = require("socket.io")(3001, {
  cors: {
    origin: "*",
  },
});
const ai = require("./AIAgent/functionRouter");

app.use(express.json());
app.use(cors());

chatBotSockets.on("connection", (socket) => {
  socket.on("sendMessage", async (message) => {
    const answer = await ai(message);
    socket.emit("response", answer);
  });

  socket.on("webStatus", (message) => {
    socket.broadcast.emit("webStatusIs", message);
  });
});
