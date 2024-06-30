const mongoose = require("mongoose");
const Message = require("../schema/message");
const express = require('express');
const cors = require('cors');

// Middleware
const app = express();
app.use(cors());
app.use(express.json());

const getNumberOfUnreadDms = async (req, res) => {
    const passedInfo = req.body;
    const me = passedInfo.to;
    const other = passedInfo.from;
    
    try {

        const messagesUnread = await Message.find({ to: me, from: other, read_by_to: false });

      res.status(200).json({ from: other, number: messagesUnread.length });;
        
    } catch (error) {
      return res.status(500).json({ message: error.message, isValid: false });
    }
  };
  
module.exports = getNumberOfUnreadDms;