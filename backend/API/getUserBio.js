const mongoose = require("mongoose");
const User = require("../schema/user");
const express = require('express');
const cors = require('cors');

// Middleware
const app = express();
app.use(cors());
app.use(express.json());

const getPreferences = async (req, res) => {
    try {
      // Using the passed from front-end object
      const passedEmail = req.body;
  
      const user = await User.findOne({
        "email": passedEmail.email
      });

      // Send tokens to the frontend
      res.status(200).json({
        field_of_interest: user.field_of_interest,
        education: user.education,
        location: user.location,
        work_experience_level: user.work_experience_level,
        preferences_interest: user.preferences_interest,
        preferences_loc: user.preferences_loc,
        preferences_edu: user.preferences_edu,
        preferences_workexp: user.preferences_workexp
      });
  
    } catch (error) {
      res.status(500).send('Error retrieving data: ' + error.message);
    }
  };
  
  module.exports = getPreferences;