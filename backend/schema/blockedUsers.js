const mongoose = require('mongoose');

const BlockedUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    blockedUsernames: [{
        type: String,
        required: true
    }]
});

const BlockedUser = mongoose.model('BlockedUser', BlockedUserSchema);

module.exports = BlockedUser;
