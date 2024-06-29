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
      // Using the passed from front-end object
      const passed = req.body;
      const me = passed.from;
      const other = passed.to;

      const messages = await Message.find({
        $or: [
          { to: me, from: other },
          { to: other, from: me },
        ]})
        .sort({_id:-1})
        .limit(passed.limit);

      // Send tokens to the frontend
      res.status(200).json(messages);
  
    } catch (error) {
      res.status(500).send('Error logging in user: ' + error.message);
    }
  };
  
  module.exports = getMessages;