const mongoose = require("mongoose");
const User = require("../schema/user");
const express = require('express');
const cors = require('cors');

// Bcrypt for hashing
const bcryptjs = require('bcryptjs');

// Middleware
const app = express();
app.use(cors());
app.use(express.json());

// API call to create new object
const loginUser = async (req, res) => {
    try {
      // Using the passed from front-end object
      const passedUser = req.body;
  
      const user = await User.findOne({
        "email": passedUser.email,
      });

      if (!user) {
        return res.status(401).send('Authentication failed: User not found');
      }
  
      // Compare the provided password with the stored hash
      const isPasswordValid = bcryptjs.compareSync(passedUser.password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).send('Authentication failed: Incorrect password');
      }
      
      res.status(200).send('User logged in successfully');
  
  
    } catch (error) {
      res.status(500).send('Error logging in user: ' + error.message);
    }
  };
  
  module.exports = loginUser;