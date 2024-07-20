const mongoose = require('mongoose');
const Comment = require('../schema/comments');

const getCommentsHandler = async (req, res) => {
    try {
        const { resumeId } = req.params;

        // Check if resumeId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(resumeId)) {
            return res.status(400).json({ error: 'Invalid resume ID format' });
        }

        console.log('Fetching comments for resume ID:', resumeId); // Log the resumeId being fetched
        const comments = await Comment.find({ resumeId });
        if (!comments) {
            return res.status(404).json({ error: 'No comments found' });
        }
        console.log('Returning Comments:', comments); // Log the comments data being returned
        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error); // Log the error for debugging
        res.status(500).json({ error: 'Error fetching comments' });
    }
};

module.exports = getCommentsHandler;
