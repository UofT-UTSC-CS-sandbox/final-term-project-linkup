//Movie model
const mongoose = require('mongoose')
//const mongoose = require('mongoose)

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    age: Number,
  }, { collection: 'customers' });

const User = mongoose.model('User', UserSchema);
module.exports = User;