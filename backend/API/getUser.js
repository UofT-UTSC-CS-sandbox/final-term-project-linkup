const User = require('../schema/user');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const getUser = async (req, res) => {
    try {
        const users = await User.find(); 
        if (!users) {
            return res.status(404).json({ message: "No user found" });
        }
        res.json(users);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: error.message });
    }
  };

module.exports = getUser;