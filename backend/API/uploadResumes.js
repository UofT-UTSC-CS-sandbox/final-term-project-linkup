const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
const Resume = require('../schema/resume');
const User = require('../schema/user');

const MONGO_DB = "mongodb+srv://Cluster20901:Yn1EcWJYZVFX@cluster20901.oyjixnu.mongodb.net/linkup?retryWrites=true&w=majority&appName=Cluster20901";

// Create storage engine
const storage = new GridFsStorage({
    url: MONGO_DB,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
            if (err) {
                return reject(err);
            }
            const ext = path.extname(file.originalname);
            const filename = buf.toString('hex') + (ext === '.pdf' ? '' : ext); // Avoid appending if already .pdf
            const fileInfo = {
                filename: filename,
                bucketName: 'bucket'
            };
            resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });
  
// API call to handle file uploads

const uploadResumes = async (req, res) => {
    try {
        const { file, body } = req;
        console.log('File:', file);

        if (!file){
        return res.status(400).json({ error: 'No file uploaded' });
        }

        // Create a new resume object
        const newResume = new Resume({
            uploader_id: body.uploader_id,
            file_path: file.filename, // Store the GridFS filename
            public: body.public === 'true',
            num_swipes: 0
        });

        //save resume and wait for promise to see that the new resume is saved
        const savedResume = await newResume.save();
        console.log('Body:', body);
        // Associate the uploaded resume with the user profile and then update the resume object's id in storage
        await User.findByIdAndUpdate(body.uploader_id, { resume: savedResume._id });

        res.status(200).json({
            message: 'Resume uploaded successfully',
            file_id: file.filename,
        });
    } 
    catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ error: 'Error uploading resume' });
    }
};

module.exports = { upload, uploadResumes };
