const Resume = require('../schema/resume');

const updateResumePublicStatus = async (req, res) => {
    const { _id, publicStatus } = req.body;

    try {
        const updatedResume = await Resume.findByIdAndUpdate(_id, { public: publicStatus }, { new: true });
        if (!updatedResume) {
            return res.status(404).send('Resume not found');
        }
        res.status(200).send('Resume updated successfully');
    } catch (error) {
        console.error('Error updating resume:', error);
        res.status(500).send('Error updating resume');
    }
};

module.exports = updateResumePublicStatus;
