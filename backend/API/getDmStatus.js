const express = require('express');
const router = express.Router();
const Connection = require('../schema/connection');

const getDmStatus = async (req, res) => {
  const { to, from } = req.query;

  try {
    const connection = await Connection.findOne({
      $or: [
        { user1: to, user2: from },
        { user1: from, user2: to }
      ]
    });

    if (!connection) {
      res.json({ isNewConversation: true });
    } else {
      res.json({ isNewConversation: false, accepted: connection.accepted });
    }
  } catch (error) {
    console.error('Error checking DM status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = getDmStatus;
