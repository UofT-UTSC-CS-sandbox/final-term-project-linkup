const Resume = require('../schema/resume');


// Endpoint to delete resumes
const deleteResumes = (gfsBucket) => {
    return async (req, res) => {
      
        const { resumeIds } = req.body;
    
        try 
        {
            // Find resumes to delete
            const resumesToDelete = await Resume.find({ _id: { $in: resumeIds } });

            // Delete resumes from MongoDB
            await Resume.deleteMany({ _id: { $in: resumeIds } });

            // Delete files from GridFS

            // go thru array of all resumes to delete
            for (const resume of resumesToDelete) 
            {
                const fileId = resume.file_path;

                // find the resume of that file id
                gfsBucket.find({ filename: fileId }).toArray((err, files) => {
                    if (err) 
                    {
                        console.error('Error finding file in GridFS:', err);
                        return res.status(500).json({ error: 'Error finding file in GridFS' });
                    }

                    //if there is a resume to delete, delete first one in array
                    if (files.length > 0) {
                        const file = files[0];
                        gfsBucket.delete(file._id, (err) => {
                            if (err) {
                                console.error('Error deleting file from GridFS:', err);
                                return res.status(500).json({ error: 'Error deleting file from GridFS' });
                            }
                        });
                    }
                });
            }

            res.status(200).json({ message: 'Resumes deleted successfully' });
        } catch (error) {
            console.error('Error deleting resumes:', error);
            res.status(500).json({ error: 'Error deleting resumes' });
        }
    };
};

module.exports = deleteResumes;