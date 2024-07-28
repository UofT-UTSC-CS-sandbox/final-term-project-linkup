const Resume = require('../schema/resume');
const Comment = require('../schema/comments');

// API call to fetch resumes with comments for a specific user
const getUserResumesAndComments = async (req, res) => {
    try {
        const userId = req.params.userId;
        const resumes = await Resume.find({ uploader_id: userId }).populate('uploader_id');

        const resumesWithComments = await Promise.all(resumes.map(async (resume) => {
            const comments = await Comment.find({ resumeId: resume._id });
            return {
                ...resume.toObject(),
                comments
            };
        }));

        res.json(resumesWithComments);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching resumes with comments' });
    }
};

module.exports = getUserResumesAndComments;
