//Movie model
const mongoose = require('mongoose')
//const mongoose = require('mongoose)

// Changed schema to reflect user in linkup database
const UserSchema = new mongoose.Schema({
    anon_username: String,
    email: String,
    password: String,
    field_of_interest: String,
    work_experience_level: String,
    education: String,
    location: String,
    avatar: String,
    salt: String,
    verified: Boolean,
    verificationToken: String,
    preferences_edu: String,
    preferences_interest: String,
    preferences_loc: String,
    preferences_workexp: String,
  }, { collection: 'users' });

const User = mongoose.model('User', UserSchema);
module.exports = User;