
const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./schema/user');
const getUser = require('./API/getUser');
require('dotenv').config();

const MONGO_DB = "mongodb+srv://Cluster20901:Yn1EcWJYZVFX@cluster20901.oyjixnu.mongodb.net/sample-analytics?retryWrites=true&w=majority&appName=Cluster20901";
// const PORT = 3001;

const app = express();
//const port = PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const mongooseOptions = {
  serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
};


// MongoDB connection
mongoose.connect(MONGO_DB, {dbName: "sample-analytics"})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

app.get('/test-page', getUser);

// Endpoint to handle insertion of new movie
app.post('/test-page', async (req, res) => {
  try {
    const newUser= new User(req.body);
    await newUser.save();
    res.status(200).send('User added successfully');
  } catch (error) {
    res.status(500).send('Error adding another Jane Doe: ' + error.message);
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
