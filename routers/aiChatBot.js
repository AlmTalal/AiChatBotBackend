const express = require("express");
const ai = require("../AIAgent/functionRouter");
const router = express.Router();

//Returns a message from the chatBotRouter func
router.post("/", async (req, res) => {
  const answer = await ai(req.body.message, req.body.pastMessages);
  res.send(answer);
});

module.exports = router;
