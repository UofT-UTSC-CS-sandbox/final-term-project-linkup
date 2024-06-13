
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./schema/user');
const getUser = require('./API/getUser');
const loginUser = require('./API/loginUser');
const newUser = require('./API/newUser');
const verifyUser = require('./API/EmailVerification');
const updatePreferences = require('./API/UpdatePreferences'); // Adjust path as necessary


require('dotenv').config();

// Changed to linkup database within cluster
const MONGO_DB = "mongodb+srv://Cluster20901:Yn1EcWJYZVFX@cluster20901.oyjixnu.mongodb.net/linkup?retryWrites=true&w=majority&appName=Cluster20901";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));


const mongooseOptions = {
  serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
};


// MongoDB connection
mongoose.connect(MONGO_DB, {dbName: "linkup"})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Listening on Port 3001
const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// API call to get existing users
app.get('/test-page', getUser);

// SIGN-UP
// API call to create new object
app.post('/new-user', newUser);

app.post('/verify-user', verifyUser);

app.post('/login', loginUser);
app.post('/api/updatePreferences', updatePreferences);
