const Resume = require('../schema/resume');
const cache = require('./cache'); // Import the caching module

const getPublicResumes = async (req, res) => {
    try {
        let cachedResumes = await cache.get("topResumes");
        if (!cachedResumes) {
            let topResumes = await Resume.find({ public: true }).sort({ num_swipes: -1 }).limit(10);
            await cache.set("topResumes", topResumes, 3600);
            cachedResumes = topResumes;
        }
        res.status(200).json(cachedResumes);
    } catch (error) {
        console.error('Error fetching top resumes:', error);
        res.status(500).json({ message: 'Error fetching top resumes', error: error });
    }
};

module.exports = getPublicResumes;