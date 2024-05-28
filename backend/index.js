
const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const cors = require('cors');
const Movies = require('./user');
require('dotenv').config();

const MONGO_DB = "mongodb+srv://Cluster20901:Yn1EcWJYZVFX@cluster20901.oyjixnu.mongodb.net/sample-mflix?retryWrites=true&w=majority&appName=Cluster20901";
const PORT = 3000;

const app = express();
const port = PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const mongooseOptions = {
  serverSelectionTimeoutMS: 5000 // Timeout after 5s instead of 30s
};


// MongoDB connection
mongoose.connect(MONGO_DB, {dbName: "sample_mflix"})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const query = Movies.find();

query.exec()
  .then(result => {
    console.log('Query result:', result);
  })
  .catch(error => {
    console.error('Error executing query:', error);
  });
 