const mongoose = require("mongoose");
const Message = require("../schema/message");
const BlockedUser = require('../schema/blockedUsers'); 
const express = require('express');
const cors = require('cors');

// Middleware
const app = express();
app.use(cors());
app.use(express.json());

require('dotenv').config();

// API call to get messages
const getMessages = async (req, res) => {
  try {
    const passedInfo = req.body;
    console.log("received request to get messages");

    // Get blocked users
    const blockedUserEntry = await BlockedUser.findOne({ username: passedInfo.currUser });
    const blockedUsers = blockedUserEntry ? blockedUserEntry.blockedUsernames : [];

    // Get all messages excluding those from blocked users
    const messages = await Message.find({
      $or: [
        { to: passedInfo.currUser, from: { $nin: blockedUsers } }, // Incoming messages not from blocked users
        { from: passedInfo.currUser } // Outgoing messages
      ]
    }).sort({ _id: -1 });

    // Send messages to the frontend
    res.status(200).json(messages);

  } catch (error) {
    res.status(500).send('Error retrieving messages: ' + error.message);
  }
};

module.exports = getMessages;
