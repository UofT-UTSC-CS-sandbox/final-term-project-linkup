const mongoose = require("mongoose");
const Message = require("../schema/message");
const express = require('express');
const cors = require('cors');

// Middleware
const app = express();
app.use(cors());
app.use(express.json());

const markMessagesAsRead = async (req, res) => {
    const passedInfo = req.body;
    
    try {

      // Mark all messages from another person as read
      await Message.updateMany(
        { to: passedInfo.to, from: passedInfo.from, read_by_to: false },
        { $set: { read_by_to: true } }
      );

      return res.status(200).json({ message: "updated"});
        
    } catch (error) {
      return res.status(500).json({ message: error.message, isValid: false });
    }
  };
  
module.exports = markMessagesAsRead;