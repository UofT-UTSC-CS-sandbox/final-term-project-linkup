const express = require('express');
const router = express.Router();
const User = require('../schema/user'); // Adjust the path as necessary

const getUploaderName = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).json({ uploaderName: user.anon_username });
    } catch (error) {
        res.status(500).send('Error fetching uploader name: ' + error.message);
    }
};

module.exports = getUploaderName;
