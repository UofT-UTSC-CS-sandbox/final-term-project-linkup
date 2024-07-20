const TrendingComment = require('../schema/trendingComment');

const getTrendingComments = async (req, res) => {
    try {
        let comments = await TrendingComment.find({ resumeId: req.params.resumeId, parentId: null })
                                            .sort({ createdAt: -1 });
        comments = await Promise.all(comments.map(async (comment) => {
            const replies = await TrendingComment.find({ parentId: comment._id }).sort({ createdAt: 1 });
            return { ...comment.toObject(), replies };
        }));
        res.json(comments);
    } catch (error) {
        console.error('Error fetching trending comments:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = getTrendingComments;
