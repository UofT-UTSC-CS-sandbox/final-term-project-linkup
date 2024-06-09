const mongoose = require("mongoose");
const User = require("../schema/user");
const express = require('express');
const cors = require('cors');

// Bcrypt for hashing
const bcryptjs = require('bcryptjs');

// Jwt for creating web tokens (refresh and access)
const jwt = require('jsonwebtoken');

// Middleware
const app = express();
app.use(cors());
app.use(express.json());

require('dotenv').config();

// Function to create an access token
const createAccessToken = (user) => {
  return jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET_FORJWT, { expiresIn: '2h' });
};


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
      
      // Create tokens
      const accessToken = createAccessToken(user);

      // Send tokens to the frontend
      res.status(200).json({
        accessToken: accessToken,
        user: {
          email: user.email
        },
      });
  
    } catch (error) {
      res.status(500).send('Error logging in user: ' + error.message);
    }
  };
  
  module.exports = loginUser;