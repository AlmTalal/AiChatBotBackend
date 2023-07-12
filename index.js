const express = require("express");
const app = express();
const cors = require("cors");
//routers
const aiChatBot = require("./routers/aiChatBot");

app.use(express.json());
app.use(cors());
app.use("/chatbot", aiChatBot);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`${port}`);
});
