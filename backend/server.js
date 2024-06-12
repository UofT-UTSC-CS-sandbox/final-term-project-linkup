const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
const User = require('./schema/user');
const getUser = require('./API/getUser');
const Resume = require('./schema/resume');
require('dotenv').config();

const MONGO_DB = "mongodb+srv://Cluster20901:Yn1EcWJYZVFX@cluster20901.oyjixnu.mongodb.net/linkup?retryWrites=true&w=majority";
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true });
const conn = mongoose.connection;

// Initialize GridFS
let gfsBucket;
conn.once('open', () => {
  gfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'bucket'
  });
});

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

// API call to get existing objects
app.get('/test-page', getUser);

// API call to create new object
app.post('/test-page', async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(200).send('User added successfully');
  } catch (error) {
    res.status(500).send('Error adding user: ' + error.message);
  }
});

// API call to handle file uploads
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { file, body } = req;
    console.log('File:', file);

    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Create a new resume object
    const newResume = new Resume({
      uploader_id: body.uploader_id,
      file_path: file.filename, // Store the GridFS filename
      public: body.public === 'true',
      num_swipes: 0
    });

    const savedResume = await newResume.save();
    console.log('Body:', body);
    // Associate the uploaded resume with the user profile
    await User.findByIdAndUpdate(body.uploader_id, { resume: savedResume._id });

    res.status(200).json({
      message: 'Resume uploaded successfully',
      file_id: file.filename,
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ error: 'Error uploading resume' });
  }
});

// API call to fetch resumes for a specific user
app.get('/resumes/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const resumes = await Resume.find({ uploader_id: userId }).populate('uploader_id');
    res.json(resumes);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching resumes' });
  }
});

// Endpoint to serve files from GridFS
app.get('/bucket/files/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    console.log('Filename:', filename);

    // Find the file by filename
    gfsBucket.find({ filename }).toArray((err, files) => {
      if (err) {
        console.error('Error finding file:', err);
        return res.status(500).json({ error: 'Error finding file' });
      }

      // Check if file exists
      if (!files || files.length === 0) {
        console.log('File not found');
        return res.status(404).json({ error: 'File not found' });
      }

      // Set content type and create read stream to send the file
      const file = files[0];
      if (file.contentType === 'application/pdf' || file.filename.endsWith('.pdf')) {
        res.setHeader('Content-Type', 'application/pdf');
        const readstream = gfsBucket.openDownloadStreamByName(filename);
        readstream.pipe(res);
      } else {
        res.status(400).json({ error: 'Not a PDF file' });
      }
    });
  } catch (error) {
    console.error('Error serving file:', error);
    res.status(500).json({ error: 'Error serving file' });
  }
});

// Endpoint to delete resumes
app.post('/delete-resumes', async (req, res) => {
  const { resumeIds } = req.body;

  try {
    // Find resumes to delete
    const resumesToDelete = await Resume.find({ _id: { $in: resumeIds } });

    // Delete resumes from MongoDB
    await Resume.deleteMany({ _id: { $in: resumeIds } });

    // Delete files from GridFS
    for (const resume of resumesToDelete) {
      const fileId = resume.file_path;

      gfsBucket.find({ filename: fileId }).toArray((err, files) => {
        if (err) {
          console.error('Error finding file in GridFS:', err);
          return res.status(500).json({ error: 'Error finding file in GridFS' });
        }

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
});

// Listening on Port 3001
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
