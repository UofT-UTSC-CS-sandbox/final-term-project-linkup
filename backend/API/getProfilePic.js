const mongoose = require("mongoose");
const User = require("../schema/user");
const express = require('express');
const cors = require('cors');

// Middleware
const app = express();
app.use(cors());
app.use(express.json());

require('dotenv').config();

// API call to create new object
const getProfilePic = async (req, res) => {
    try {
      // Using the passed from front-end object
      const passedUser = req.body;
  
      const user = await User.findOne({
        anon_username: passedUser.username
      });

      if (!user) {
        return res.status(401).json({errorMsg : "Unable to find user"});
      }
  
      console.log(user.anon_username);
      console.log(user.avatar);
      
      // Send tokens to the frontend
      res.status(200).json({profilePic: user.avatar});
  
    } catch (error) {
      res.status(500).send('Error getting profile pic: ' + error.message);
    }
  };
  
  module.exports = getProfilePic;