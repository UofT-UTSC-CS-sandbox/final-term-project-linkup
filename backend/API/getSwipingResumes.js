const Resume = require('../schema/resume');
const Swipes = require('../schema/swipes');

// API call to fetch resumes for swiping (public and not the current user)
const getSwipingResumes = async (req, res) => {
    try {
        console.log("Fetching Resumes for user:", req.params.userId);
        // Get the current user's id
        const userId = req.params.userId;

        // Get list of resumes that user has already swiped on
        const swipedResumes = await Swipes.find({ user_id: userId }).select('resume_id');
        const swipedResumeIds = swipedResumes.map(swiped => swiped.resume_id);
        
        // Query for resumes that are public and not uploaded by the current user
        const resumes = await Resume.find({ 
            public: true, 
            uploader_id: { $ne: userId }, 
            _id: { $nin: swipedResumeIds} 
        }).populate('uploader_id');
        
        res.json(resumes);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching swiping resumes' });
    }
};

module.exports = getSwipingResumes;