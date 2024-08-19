const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const voteSchema = new Schema({
    commentId: { type: Schema.Types.ObjectId, ref: 'TrendingComment', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    voteType: { type: Number, required: true, validate: {
        validator: function(v) {
            return v === 1 || v === -1 || v === 0; // Ensures vote is either an upvote (+1) or a downvote (-1)
        },
        message: props => `${props.value} is not a valid vote type!`
    }}
});

module.exports = mongoose.model('Vote', voteSchema);