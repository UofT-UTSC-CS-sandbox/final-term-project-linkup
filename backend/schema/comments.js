const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    resumeId: { type: Schema.Types.ObjectId, required: true, ref: 'Resume' },
    user: { type: String, required: true },
    comment: { type: String, required: true },
    highlightedText: { type: String },
    position: {
        top: { type: Number, required: true },
        left: { type: Number, required: true },
        width: { type: Number, required: true },
        height: { type: Number, required: true }
    }
}, { timestamps: true });

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
