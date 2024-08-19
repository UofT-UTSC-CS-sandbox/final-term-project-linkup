const mongoose = require("mongoose");
const TrendingComment = require('../schema/trendingComment');
const Vote = require('../schema/votes');

const getTrendingComments = async (req, res) => {
    const userId = req.params.userId; // Assuming you have user information from session or token
    const resumeId = req.params.resumeId;

    try {
        // const comments = await TrendingComment.find({ resumeId, parentId: null})
        //     .lean()
        //     .sort({ createdAt: -1 });
            
            const comments = await TrendingComment.aggregate([
                // Match top-level comments
                { $match: { resumeId: mongoose.Types.ObjectId(resumeId), parentId: null } },
                // Lookup to find replies and count them
                { $lookup: {
                    from: "trendingcomments", // assuming collection name is trendingcomments
                    localField: "_id",
                    foreignField: "parentId",
                    as: "replies"
                }},
                { $addFields: {
                    repliesCount: { $size: "$replies" }
                }},
                { $project: { replies: 0 } }, // Exclude the replies field from output
                // Sort comments by creation date
                { $sort: { createdAt: -1 } }
            ]); 
        // Get vote counts and user-specific votes in one go, if possible
        const commentIds = comments.map(comment => comment._id);
        const votes = await Vote.aggregate([
            { $match: { commentId: { $in: commentIds } } },
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

        // Attach vote data to comments
        const commentsWithVotes = comments.map(comment => ({
            ...comment,
            votes: votesMap[comment._id.toString()] ? votesMap[comment._id.toString()].totalVotes : 0,
            userVote: votesMap[comment._id.toString()] ? votesMap[comment._id.toString()].userVote : 0,
        }));

        res.json(commentsWithVotes);
    } catch (error) {
        console.error('Error fetching trending comments:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = getTrendingComments;