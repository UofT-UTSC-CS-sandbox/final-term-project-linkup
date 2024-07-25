const TrendingComment = require('../schema/trendingComment');
const isBad = require('../Utils/CommentFilter');

const postTrendingComment = async (req, res) => {
    const { resumeId, text, username, parentId = null } = req.body;

    if (isBad(text)) {
        return res.status(400).json({ error: 'Your comment contains inappropriate language.' });
    }

    const newComment = new TrendingComment({ resumeId, text, username, parentId });
    try {
        await newComment.save();
        res.status(201).json(newComment);
    } catch (error) {
        console.error('Error posting trending comment:', error);
        res.status(400).json({ message: error.message });
    }
};

module.exports = postTrendingComment;