const mongoose = require('mongoose');

const swipesSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User schema
  resume_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Resume' }, // Reference to Resume schema
  uploader_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to User schema
  accept: Boolean
}, { collection: 'swipes' });

const Swipe = mongoose.model('Swipe', swipesSchema);

module.exports = Swipe;