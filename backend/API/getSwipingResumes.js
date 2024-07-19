const Resume = require('../schema/resume');
const Swipes = require('../schema/swipes');
const User = require('../schema/user');

// API call to fetch resumes for swiping (public and not the current user)
const getSwipingResumes = async (req, res) => {
    try {
        console.log("Fetching Resumes for user:", req.params.userId);
        // Get the current user's id
        const userId = req.params.userId;

        // Get list of resumes that user has already swiped on
        const swipedResumes = await Swipes.find({ user_id: userId }).select('resume_id');

        // Get current user
        const user = await User.findOne({ _id: userId });

        console.log("user found: ", user);
        if(!user){
            return res.status(404).json({error: 'User not found'});
        }

        // Log the swiped resumes
        if (swipedResumes.length === 0) {
            console.log(`No swiped resumes found for user: ${userId}`);
        } else {
            console.log("Resume Ids that the user has already swiped on:", swipedResumes);
        }

        const swipedResumeIds = swipedResumes.map(swiped => swiped.resume_id);
        
        // Build match criteria based on non-empty preferences
        let matchCriteria = [];
        if (user.preferences_interest) matchCriteria.push({ field_of_interest: user.preferences_interest });
        if (user.preferences_workexp) matchCriteria.push({ work_experience_level: user.preferences_workexp });
        if (user.preferences_edu) matchCriteria.push({ education: user.preferences_edu });
        if (user.preferences_loc) matchCriteria.push({ location: user.preferences_loc });

        console.log("User preferences: ", matchCriteria);

        // Query for resumes that are public, not uploaded by the current user, not swiped on, and match user preferences
        let resumes;
        if (matchCriteria.length === 0) {
            // If no preferences are set, return all public resumes the user hasn't swiped on
            console.log("No user preferences set. Returning all public resumes.");
            resumes = await Resume.find({
                public: true,
                uploader_id: { $ne: userId },
                _id: { $nin: swipedResumeIds }
            }).populate({
                path: 'uploader_id',
                model: 'User',
                select: '_id anon_username email field_of_interest work_experience_level education location'
            });
        } else {
            // Query for resumes that are public, not uploaded by the current user, not swiped on
            resumes = await Resume.find({
                public: true,
                uploader_id: { $ne: userId },
                _id: { $nin: swipedResumeIds },
            }).populate({
                path: 'uploader_id',
                model: 'User',
                match: {
                    $or: matchCriteria
                },
                select: '_id anon_username email field_of_interest work_experience_level education location' 
            });

            // Filter out resumes where uploader_id did not match any of the preferences
            resumes = resumes.filter(resume => resume.uploader_id !== null);
        }
        
        console.log("Swiping resumes: ", resumes);
        // Return the filtered resumes
        res.json(resumes);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching swiping resumes' });
    }
};

module.exports = getSwipingResumes;