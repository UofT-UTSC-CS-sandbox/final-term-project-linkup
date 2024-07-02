const Resume = require('../schema/resume');

const getPublicResumes = async (req, res) => {
    try {
        const publicResumes = await Resume.find({ public: true });
        res.status(200).json(publicResumes);
    } catch (error) {
        console.error('Error fetching public resumes:', error);
        res.status(500).json({ message: 'Error fetching public resumes', error: error });
    }
};

module.exports = getPublicResumes;