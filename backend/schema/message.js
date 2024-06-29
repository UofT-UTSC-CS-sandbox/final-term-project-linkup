//Movie model
const mongoose = require('mongoose')

// Changed schema to reflect user in linkup database
const MessageSchema = new mongoose.Schema({
    to: String,
    from: String,
    timestamp: String,
    message: String
  }, { collection: 'messages' });

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;