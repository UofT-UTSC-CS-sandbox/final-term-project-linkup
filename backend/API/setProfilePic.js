const mongoose = require("mongoose");
const User = require('../schema/user');
const express = require('express');
const cors = require('cors');

// Middleware
const app = express();
app.use(cors());
app.use(express.json());

const setProfilePic = async (req, res) => {
  try {
    const passedInfo = req.body;
    
    // Mark all messages from another person as read
    await User.updateOne(
      { anon_username: passedInfo.username },
      { $set: { avatar: passedInfo.filename } }
    );

    return res.status(200).json({ message: "updated"});
      
  } catch (error) {
    return res.status(500).json({ message: error.message, isValid: false });
  }
};
  
module.exports = setProfilePic;