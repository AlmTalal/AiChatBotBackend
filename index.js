require("dotenv").config({ path: require("find-config")("./.env") });
const { MongoClient } = require("mongodb");

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
const chatBotSendMsg = require("./SocketEvents/ChatBotSendMsg");

socketServer.on("connection", (socket) => {
  chatBotSendMsg(socket);
  socket.on("disconnect", () => {
    socket.disconnect();
  });
});
