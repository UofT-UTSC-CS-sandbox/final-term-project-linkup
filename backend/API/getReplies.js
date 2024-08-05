const mongoose = require("mongoose");
const TrendingComment = require('../schema/trendingComment');
const Vote = require('../schema/votes');

const getRepliesForComment = async (req, res) => {
    const commentId = req.params.commentId; // This is the ID of the parent comment
    const userId = req.params.userId; // Assuming you are using some form of user auth to get user info

    try {
        const replies = await TrendingComment.find({ parentId: commentId })
            .lean()
            .sort({ createdAt: -1 });

        // Aggregate votes for replies similarly as you did for comments
        const replyIds = replies.map(reply => reply._id);
        const votes = await Vote.aggregate([
            { $match: { commentId: { $in: replyIds } } },
            { $group: { _id: "$commentId", totalVotes: { $sum: "$voteType" }, 
                        userVote: { 
                            $max: {
                                $cond: { if: { $eq: ["$userId", userId] }, then: "$voteType", else: 0 }
                            }
                        }}}
        ]);

        const votesMap = votes.reduce((acc, vote) => {
            acc[vote._id.toString()] = { totalVotes: vote.totalVotes, userVote: vote.userVote };
            return acc;
        }, {});

        // Attach vote data to replies
        const repliesWithVotes = replies.map(reply => ({
            ...reply,
            votes: votesMap[reply._id.toString()] ? votesMap[reply._id.toString()].totalVotes : 0,
            userVote: votesMap[reply._id.toString()] ? votesMap[reply._id.toString()].userVote : 0,
        }));

        res.json(repliesWithVotes);
    } catch (error) {
        console.error('Error fetching replies:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = getRepliesForComment;