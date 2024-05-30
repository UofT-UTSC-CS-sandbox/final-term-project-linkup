
const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const cors = require('cors');
const User = require('./user');
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

  app.get('/api/user', async (req, res) => {
    try {
        const user = await User.findOne(); // Make sure this model exists and is correctly imported
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
