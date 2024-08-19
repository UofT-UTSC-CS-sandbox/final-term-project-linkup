const mongoose = require("mongoose");
const Vote = require('../schema/votes');
const TrendingComment = require('../schema/trendingComment');

const voteOnComment = async (req, res) => {
    const { userId, commentId, voteType } = req.body;

    try {
        const existingVote = await Vote.findOne({ commentId, userId });

        if (existingVote) {
            if (voteType === 0) {
                await existingVote.remove();
            } else if (existingVote.voteType !== voteType) {
                existingVote.voteType = voteType;
                await existingVote.save();
            }
        } else {
            if (voteType !== 0) { // Only save if voteType is not 0
                const newVote = new Vote({ commentId, userId, voteType });
                await newVote.save();
            }
        }

        await updateCommentVotes(commentId);
        res.status(200).json({ message: 'Vote registered successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error processing vote', error: error.message });
    }
};

// Helper function to update the vote count on a comment
async function updateCommentVotes(commentId) {
    const votes = await Vote.aggregate([
        { $match: { commentId: mongoose.Types.ObjectId(commentId) } },
        { $group: { _id: null, totalVotes: { $sum: '$voteType' } } }
    ]);

    const totalVotes = votes.length > 0 ? votes[0].totalVotes : 0;
    await TrendingComment.findByIdAndUpdate(commentId, { votes: totalVotes });
}


const getVoteStatus = async (req, res) => {
    const { userId, commentId } = req.query; // Assuming userId and commentId are passed as query parameters

    try {
        const existingVote = await Vote.findOne({ commentId, userId });

        if (existingVote) {
            res.status(200).json({ voteType: existingVote.voteType });
        } else {
            res.status(200).json({ voteType: 0 }); // No vote
        }
    } catch (error) {
        res.status(500).json({ message: 'Error fetching vote status', error: error.message });
    }
};

module.exports = { voteOnComment, getVoteStatus };
// module.exports = voteOnComment;