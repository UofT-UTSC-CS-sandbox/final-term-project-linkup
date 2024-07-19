const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trendingCommentSchema = new Schema({
    resumeId: { type: Schema.Types.ObjectId, ref: 'Resume' },
    text: { type: String, required: true },
    username: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    votes: { type: Number, default: 0 },
    parentId: { type: Schema.Types.ObjectId, ref: 'TrendingComment', default: null }
});

const TrendingComment = mongoose.model('TrendingComment', trendingCommentSchema);

module.exports = TrendingComment;
