const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
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
const sendMessage = require('./API/sendMessage');
const getMessages = require('./API/getMessages');

const WebSocket = require('ws');
const http = require('http');

require('dotenv').config();

const MONGO_DB = "mongodb+srv://Cluster20901:Yn1EcWJYZVFX@cluster20901.oyjixnu.mongodb.net/linkup?retryWrites=true&w=majority&appName=Cluster20901";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));



// MongoDB connection
mongoose.connect(MONGO_DB, {dbName: "linkup"})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const conn = mongoose.connection;
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

// Websocket
const server = new http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New client connected');

  ws.on('message', (message) => {
    console.log(`Received: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
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

// Listening on Port 3001
const PORT = 3001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
