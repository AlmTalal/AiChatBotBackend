import dotenv from "dotenv";
import findConfig from "find-config";
import { MongoClient } from "mongodb";

dotenv.config({ path: findConfig("./.env") });

const socketServer = require("socket.io")(3001, {
  cors: {
    origin: "*",
  },
});
const client = new MongoClient(process.env.MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//Socket events
import chatBotSendMsg from "./SocketEvents/ChatBotSendMsg";

socketServer.on("connection", (socket) => {
  chatBotSendMsg(socket);
  socket.on("disconnect", () => {
    socket.disconnect();
  });
});
