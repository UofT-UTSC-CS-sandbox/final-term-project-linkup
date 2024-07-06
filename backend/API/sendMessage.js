const Message = require('../schema/message');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

require('dotenv').config();

const newMessage = async (req, res) => {
  try {
    const passedUser = req.body;

    const newMsg = new Message({
        to: passedUser.to,
        from: passedUser.from,
        timestamp: passedUser.timestamp,
        message: passedUser.message,
        read_by_to: false
    });

    await newMsg.save();
    res.status(200).json({ message: 'Message sent'});

  } catch (error) {
    res.status(500).send('Error sending message ' + error.message);
  }
};

module.exports = newMessage;
