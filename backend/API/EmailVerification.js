const mongoose = require("mongoose");
const User = require("../schema/user");
const express = require('express');
const cors = require('cors');

// Middleware
const app = express();
app.use(cors());
app.use(express.json());

const EmailVerification = async (req, res) => {
    const passedInfo = req.body; // Passed token
    const token = passedInfo.token;
  
    try {
      const user = await User.findOne({
        "verificationToken": token,
      });

      if (!user) {
        return res.status(200).json({ message: "Invalid verification token. Please try again", isValid: false });
      }
      if (user.verified) {
        return res.status(200).json({ message: "Email already verified", isValid: false });
      }
  
      user.verified = true;
      await user.save();
      return res.json({
        message: "Your account has been verified",
        isValid: true,
      });

    } catch (error) {
      return res.status(500).json({ message: error.message, isValid: false });
    }
  };
  
module.exports = EmailVerification;