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
const deleteMessage = async (req, res) => {
    try {
      const passedInfo = req.body;
      
      await Message.updateOne(
        {_id : passedInfo.msgId},
        {
          $set: {
            message: "deleted by sender",
            deleted_by_from: true
          }
        }
      );

      // Send tokens to the frontend
      res.status(200).json({ message: "updated"});
  
    } catch (error) {
      res.status(500).send('Error deleting message ' + error.message);
    }
  };
  
  module.exports = deleteMessage;