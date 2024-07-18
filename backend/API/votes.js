const TrendingComment = require('../schema/trendingComment');

const voteOnComment = async (req, res) => {
    const { commentId, delta } = req.body;
    try {
        const comment = await TrendingComment.findByIdAndUpdate(
            commentId,
            { $inc: { votes: delta } },  // Increment or decrement the votes field
            { new: true }  // Return the updated document
        );

        if (!comment) {
            return res.status(404).send({ message: "Comment not found" });
        }

        res.json(comment);
    } catch (error) {
        console.error('Failed to update comment votes:', error);
        res.status(500).send({ message: "Failed to update comment votes due to an internal error." });
    }
};

module.exports = voteOnComment;