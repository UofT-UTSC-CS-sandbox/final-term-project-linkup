const User = require('../schema/user');

// API call to fetch resumes for swiping (public and not the current user)
const getPreferences = async (req, res) => {
    try {
        // Get the current user's id
        const userId = req.params.userId;

        // Get list of resumes that user has already swiped on
        const targetResume = await User.find({ _id: userId });
        
        res.json(targetResume);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching swiping resumes' });
    }
};

module.exports = getPreferences;