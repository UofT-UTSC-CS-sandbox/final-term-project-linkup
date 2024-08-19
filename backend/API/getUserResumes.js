const Resume = require('../schema/resume');


// API call to fetch resumes for a specific user
const getUserResumes = async (req, res) => {
    try {
        //get user's id and look for any resume's with that uploader_id
        const userId = req.params.userId;
        const resumes = await Resume.find({ uploader_id: userId }).populate('uploader_id');
        res.json(resumes);
    } 
    catch (error) {
        res.status(500).json({ error: 'Error fetching resumes' });
    }
};

module.exports = getUserResumes;