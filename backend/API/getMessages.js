const mongoose = require("mongoose");
const Message = require("../schema/message");
const express = require('express');
const cors = require('cors');

// Middleware
const app = express();
app.use(cors());
app.use(express.json());

require('dotenv').config();


// API call to create new object
const getMessages = async (req, res) => {
    try {
      const passedInfo = req.body;
      console.log("receieved request to get messages");
      // Get all messages
      const messages = await Message.find({
        $or: [
          { to: passedInfo.currUser },
          { from: passedInfo.currUser },
        ]})
        .sort({_id:-1});

      // Send tokens to the frontend
      res.status(200).json(messages);
  
    } catch (error) {
      res.status(500).send('Error logging in user: ' + error.message);
    }
  };
  
  module.exports = getMessages;