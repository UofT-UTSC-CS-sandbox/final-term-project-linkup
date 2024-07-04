const Resume = require('../schema/resume');

// API call to fetch resumes for swiping (public and not the current user)
const getResumebyId = async (req, res) => {
    try {
        // Get the current user's id
        const resumeId = req.params.resumeId;

        // Get list of resumes that user has already swiped on
        const targetResume = await Resume.find({ _id: resumeId });
        
        res.json(targetResume);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching swiping resumes' });
    }
};

module.exports = getResumebyId;