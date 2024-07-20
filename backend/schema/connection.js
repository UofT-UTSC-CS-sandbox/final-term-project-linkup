const mongoose = require('mongoose');

const ConnectionSchema = new mongoose.Schema({
  user1: String,
  user2: String,
  accepted: Boolean,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Connection = mongoose.model('Connection', ConnectionSchema);

module.exports = Connection;
