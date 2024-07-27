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
const getSwipingResumes = require('./API/getSwipingResumes');
const addSwipe = require('./API/addSwipe');
const checkMatch = require('./API/checkMatch');
const getPublicResumes = require('./API/getPublicResumes');
const getResumebyId = require('./API/getResumebyId');
const getUserbyId = require('./API/getUserbyId');
const getTrendingComments = require('./API/getTrendingComments');
const postTrendingComment = require('./API/postTrendingComment');
const voteOnComment = require('./API/votes');
const { blockUser, checkIfBlocked, getBlockedUsers } = require('./API/BlockingUser');
const BlockedUser = require('./schema/blockedUsers');

// Direct messaging API's
const sendMessage = require('./API/sendMessage');
const getMessages = require('./API/getMessages');
const markMessagesAsRead = require('./API/markMessagesAsRead');
const deleteConversation = require('./API/deleteConversation');
const deleteMessage = require('./API/deleteMessage');
const addComments = require('./API/addComments');
const getComments = require('./API/getComments');
const getUploaderName = require('./API/getUserName');
const updateDmStatus = require('./API/updateDmStatus');
const getDmStatus = require('./API/getDmStatus');

// Profile pic API's
const setProfilePic = require('./API/setProfilePic');
const getProfilePic = require('./API/getProfilePic');

require('dotenv').config();

const MONGO_DB = "mongodb+srv://Cluster20901:Yn1EcWJYZVFX@cluster20901.oyjixnu.mongodb.net/linkup?retryWrites=true&w=majority&appName=Cluster20901";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Function to setup MongoDB Change Stream
const eventEmitter = new EventEmitter();

// MongoDB connection
mongoose.connect(MONGO_DB, { dbName: "linkup" })
  .then(() => {
    console.log('MongoDB connected');
    setupChangeStream()
  })
  .catch(err => console.error('MongoDB connection error:', err));

const conn = mongoose.connection;
let changeStream;

// Listener for new messages
function setupChangeStream() {
  const db = mongoose.connection;
  const collection = db.collection('messages');

  // Watch for changes in the 'messages' collection
  changeStream = collection.watch();

  // Handle change events
  changeStream.on('change', (change) => {
    if (change.operationType === 'insert') {
      const newMessage = change.fullDocument;
      eventEmitter.emit('newMessage', newMessage);
    }
  });
}

// Close change stream when application shuts down
process.on('SIGINT', () => {
  changeStream.close();
  mongoose.connection.close(() => {
    console.log('MongoDB disconnected on app termination');
    process.exit(0);
  });
});

app.get('/sse', async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const currUser = req.query.user;

  // Fetch blocked users for the current user
  const blockedUserEntry = await BlockedUser.findOne({ username: currUser });
  const blockedUsers = blockedUserEntry ? blockedUserEntry.blockedUsernames : [];

  const listener = (message) => {
    // Check if the message sender is blocked
    if (!blockedUsers.includes(message.from)) {
      res.write(`data: ${JSON.stringify(message)}\n\n`);
    }
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

  // RESUMES
  app.post('/upload', upload.single('file'), uploadResumes);
  app.get('/resumes/:userId', getUserResumes);
  app.get('/bucket/files/:filename', displayResumes(gfsBucket));
  app.post('/delete-resumes', deleteResumes(gfsBucket));
  app.post('/api/update-resume', updateResumePublicStatus);
  app.post('/block-user', blockUser);
  app.post('/check-blocked', checkIfBlocked);
  app.get('/api/resumes/public', getPublicResumes);
  app.get('/api/resume/:resumeId', getResumebyId);
  app.get('/api/resumes/public', getPublicResumes);
  app.get('/api/resume/:resumeId', getResumebyId);
  app.post('/api/resume/:resumeId/comments', addComments);
  app.get('/api/resume/:resumeId/comments', getComments);
});

// SIGN-UP
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
app.get('/api/user/:userId', getUserbyId);

// SIGN-UP
app.post('/new-user', newUser);

app.post('/verify-user', verifyUser);

app.post('/login', loginUser);
app.post('/api/updatePreferences', updatePreferences);
app.post('/getUserBio', getUserBio);
app.get('/api/swiping-resumes/:userId', getSwipingResumes);
app.post('/api/swipes/:userId', addSwipe);
app.post('/api/match/:userId', checkMatch);
app.post('/check-if-blocked', checkIfBlocked);
app.post('/get-blocked-users', getBlockedUsers);

// Direct Messaging
app.post('/send-message', sendMessage);
app.post('/get-messages', getMessages);
app.post('/mark-messages-as-read', markMessagesAsRead);
app.post('/delete-conversation', deleteConversation);
app.post('/delete-message', deleteMessage);
app.post('/block-user', blockUser);

// Trending comments
app.get('/api/trending/get-comments/:resumeId', getTrendingComments);
app.post('/trending/post-comments', postTrendingComment);
app.post('/api/comments/vote', voteOnComment);
//app.post('/get-number-of-unread-dms', getNumberOfUnreadDms);
app.post('/api/dm-status/update', updateDmStatus);
app.get('/api/dm-status', getDmStatus);

app.get('/api/get-uploader-name/:userId', getUploaderName);

// app.use('/api/resume', addComments);
// app.use('/api/resume', getComments);

// Profile Pics
app.post('/set-profile-pic', setProfilePic);
app.post('/get-profile-pic', getProfilePic);

// Listening on Port 3001
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));