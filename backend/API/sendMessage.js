const Message = require('../schema/message');
const BlockedUser = require('../schema/blockedUsers'); // Ensure the path is correct
const { EventEmitter } = require('events');
const eventEmitter = new EventEmitter();
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

    // Check if the recipient has blocked the sender
    const isBlocked = await BlockedUser.findOne({ username: passedUser.to, blockedUsernames: passedUser.from });

    if (!isBlocked) {
      // Emit the new message event for SSE only if the sender is not blocked
      eventEmitter.emit('newMessage', newMsg);
    }

    res.status(200).json({ message: 'Message sent' });

  } catch (error) {
    res.status(500).send('Error sending message ' + error.message);
  }
};

module.exports = newMessage;
