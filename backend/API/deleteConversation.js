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
const deleteConversation = async (req, res) => {
    try {
      const passedInfo = req.body;
      
      await Message.deleteMany({
        $and: [
          { from: passedInfo.me },
          { to: passedInfo.other }
        ]});

      // Send tokens to the frontend
      res.status(200).json({ message: "updated"});
  
    } catch (error) {
      res.status(500).send('Error deleting conversation ' + error.message);
    }
  };
  
  module.exports = deleteConversation;