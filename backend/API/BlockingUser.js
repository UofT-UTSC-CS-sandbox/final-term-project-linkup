const mongoose = require('mongoose');
const BlockedUser = require('../schema/blockedUsers'); 

// API call to block a user
const blockUser = async (req, res) => {
    try {
        const { username, blockedUsername } = req.body;
        console.log('Received request to block user:', { username, blockedUsername });

        if (!username || !blockedUsername) {
            console.log('Missing username or blockedUsername');
            return res.status(400).json({ message: 'Username and Blocked Username are required' });
        }

        let blockedUserRecord = await BlockedUser.findOne({ username });
        console.log('Blocked user record found:', blockedUserRecord);

        if (!blockedUserRecord) {
            // If no record exists, create a new one
            console.log('No record found, creating a new one.');
            blockedUserRecord = new BlockedUser({
                username,
                blockedUsernames: [blockedUsername]
            });
        } else {
            // If record exists, update it
            console.log('Record found, updating it.');
            if (!blockedUserRecord.blockedUsernames.includes(blockedUsername)) {
                blockedUserRecord.blockedUsernames.push(blockedUsername);
            }
        }

        await blockedUserRecord.save();
        console.log('Blocked user record saved successfully.');
        res.status(200).json({ message: 'User blocked successfully' });
    } catch (error) {
        console.error('Error blocking user:', error);
        res.status(500).send('Error blocking user: ' + error.message);
    }
};

// API call to check if a user is blocked
const checkIfBlocked = async (req, res) => {
    try {
        const { username, blockedUsername } = req.body;
        console.log('Received request to check if user is blocked:', { username, blockedUsername });

        if (!username || !blockedUsername) {
            console.log('Missing username or blockedUsername');
            return res.status(400).json({ message: 'Username and Blocked Username are required' });
        }

        // Find if there is a blocked user record
        const blockedUserRecord = await BlockedUser.findOne({ username, blockedUsernames: blockedUsername });

        if (blockedUserRecord) {
            return res.status(200).json({ isBlocked: true });
        } else {
            return res.status(200).json({ isBlocked: false });
        }
    } catch (error) {
        console.error('Error checking if user is blocked:', error);
        res.status(500).send('Error checking if user is blocked: ' + error.message);
    }
};

const getBlockedUsers = async (req, res) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({ message: 'Username is required' });
        }

        // Find blocked users for the current user
        const blockedUserRecord = await BlockedUser.findOne({ username });

        if (blockedUserRecord) {
            return res.status(200).json({ blockedUsernames: blockedUserRecord.blockedUsernames });
        } else {
            return res.status(200).json({ blockedUsernames: [] });
        }
    } catch (error) {
        console.error('Error fetching blocked users:', error);
        res.status(500).send('Error fetching blocked users: ' + error.message);
    }
};

module.exports = { blockUser, checkIfBlocked, getBlockedUsers};
