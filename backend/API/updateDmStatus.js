const express = require('express');
const router = express.Router();
const Connection = require('../schema/connection');

const updateDmStatus = async (req, res) => {
  const { to, from, accepted } = req.body;

  try {
    const connection = await Connection.findOneAndUpdate(
      {
        $or: [
          { user1: to, user2: from },
          { user1: from, user2: to }
        ]
      },
      { user1: to, user2: from, accepted },
      { new: true, upsert: true }
    );

    res.json({ success: true, connection  });
  } catch (error) {
    console.error('Error updating DM status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = updateDmStatus;
