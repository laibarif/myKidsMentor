const express = require("express");
const { sendMessage, getMessages ,getSpecficUserMessage} = require("../controller/messageController.js");

const router = express.Router();

// Route to save a new message
router.post("/send", sendMessage);

// Route to fetch previous messages between two users
router.get("/history", getMessages);

router.get("/userMessage", getSpecficUserMessage);
module.exports = router;
