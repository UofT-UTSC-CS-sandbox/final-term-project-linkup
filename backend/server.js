const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { EventEmitter } = require('events');
const User = require('./schema/user');
const getUser = require('./API/getUser');
const loginUser = require('./API/loginUser');
const newUser = require('./API/newUser');
const verifyUser = require('./API/EmailVerification');
const updatePreferences = require('./API/UpdatePreferences'); 
const getUserBio = require('./API/getUserBio');
const { upload, uploadResumes } = require('./API/uploadResumes');
const getUserResumes = require('./API/getUserResumes');
const displayResumes = require('./API/displayResumes');
const deleteResumes = require('./API/deleteResumes');
const updateResumePublicStatus = require('./API/updateResume');

// Direct messaging api's
const sendMessage = require('./API/sendMessage');
const getMessages = require('./API/getMessages');
const markMessagesAsRead = require('./API/markMessagesAsRead');
const getNumberOfUnreadDms = require('./API/getNumberOfUnreadDms');

require('dotenv').config();

const MONGO_DB = "mongodb+srv://Cluster20901:Yn1EcWJYZVFX@cluster20901.oyjixnu.mongodb.net/linkup?retryWrites=true&w=majority&appName=Cluster20901";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Function to setup MongoDB Change Stream
const eventEmitter = new EventEmitter();

// MongoDB connection
mongoose.connect(MONGO_DB, {dbName: "linkup"})
  .then(() => {
    console.log('MongoDB connected');
    setupChangeStream()})
  .catch(err => console.error('MongoDB connection error:', err));

const conn = mongoose.connection;

// Listener for new messages
function setupChangeStream() {
  const db = mongoose.connection;
  const collection = db.collection('messages');

  // Watch for changes in the 'messages' collection
  const changeStream = collection.watch();

  // Handle change events
  changeStream.on('change', (change) => {
      if (change.operationType === 'insert') {
          const newMessage = change.fullDocument;
          eventEmitter.emit('newMessage', newMessage);
      }
  });
}

app.get('/sse', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const listener = (message) => {
      res.write(`data: ${JSON.stringify(message)}\n\n`);
  };

  eventEmitter.on('newMessage', listener);

  req.on('close', () => {
      eventEmitter.off('newMessage', listener);
  });
});

// Initialize GridFS
let gfsBucket;
conn.once('open', () => {
  gfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'bucket'
  });

  //RESUMES
  app.post('/upload', upload.single('file'), uploadResumes);
  app.get('/resumes/:userId', getUserResumes);
  app.get('/bucket/files/:filename', displayResumes(gfsBucket));
  app.post('/delete-resumes', deleteResumes(gfsBucket));
  app.post('/api/update-resume', updateResumePublicStatus)

});


// SIGN-UP
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

// API call to get existing users
app.get('/get-user', getUser);

// SIGN-UP
// API call to create new object
app.post('/new-user', newUser);

app.post('/verify-user', verifyUser);

app.post('/login', loginUser);
app.post('/api/updatePreferences', updatePreferences);
// app.post('/api/updatePreferences', updateYourself);
app.post('/getUserBio', getUserBio);

// Direct Messaging
app.post('/send-message', sendMessage);
app.post('/get-messages', getMessages);
app.post('/mark-messages-as-read', markMessagesAsRead);
app.post('/get-number-of-unread-dms', getNumberOfUnreadDms);

// Listening on Port 3001
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
