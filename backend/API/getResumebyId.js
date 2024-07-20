// const Resume = require('../schema/resume');

// // API call to fetch resumes for swiping (public and not the current user)
// const getResumebyId = async (req, res) => {
//     try {
//         // Get the current user's id
//         const resumeId = req.params.resumeId;

//         // Get list of resumes that user has already swiped on
//         const targetResume = await Resume.find({ _id: resumeId });
        
//         res.json(targetResume);
//     } catch (error) {
//         res.status(500).json({ error: 'Error fetching swiping resumes' });
//     }
// };

// module.exports = getResumebyId;



const Resume = require('../schema/resume');

// API call to fetch a resume by ID
const getResumebyId = async (req, res) => {
    try {
        const resumeId = req.params.resumeId;
        const resume = await Resume.findById(resumeId);
        if (!resume) {
            return res.status(404).json({ error: 'Resume not found' });
        }
        console.log('Returning Resume:', resume); // Log the resume data
        res.json(resume);
    } catch (error) {
        console.error('Error fetching resume:', error);
        res.status(500).json({ error: 'Error fetching resume' });
    }
};

module.exports = getResumebyId;




// const mongoose = require('mongoose');
// const Resume = require('../schema/resume');

// // API call to fetch a resume by ID
// const getResumebyId = async (req, res) => {
//     try {
//         const { resumeId } = req.params;

//         // Check if resumeId is a valid ObjectId
//         if (!mongoose.Types.ObjectId.isValid(resumeId)) {
//             console.error('Invalid resume ID format:', resumeId);
//             return res.status(400).json({ error: 'Invalid resume ID format' });
//         }

//         console.log('Fetching resume with ID:', resumeId); // Log the resumeId being fetched
//         const resume = await Resume.findById(resumeId);
//         if (!resume) {
//             console.error('Resume not found with ID:', resumeId);
//             return res.status(404).json({ error: 'Resume not found' });
//         }
//         console.log('Returning Resume:', resume); // Log the resume data being returned
//         res.json(resume);
//     } catch (error) {
//         console.error('Error fetching resume:', error); // Log the error for debugging
//         res.status(500).json({ error: 'Error fetching resume' });
//     }
// };

// module.exports = getResumebyId;
