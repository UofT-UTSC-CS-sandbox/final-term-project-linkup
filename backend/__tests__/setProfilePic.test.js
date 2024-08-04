// __tests__/setProfilePic.test.js

const request = require('supertest');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('../schema/user'); // Adjust path as necessary
const setProfilePic = require('./API/setProfilePic');

// Initialize express app and use the route
const app = express();
app.use(cors());
app.use(express.json());
app.post('/set-profile-pic', setProfilePic);

describe('POST /set-profile-pic', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect('mongodb://localhost:27017/test_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    // Seed test data if necessary
    await User.create({ anon_username: 'testuser', avatar: '' });
  });

  afterAll(async () => {
    // Clean up database and close connection
    await User.deleteMany({});
    await mongoose.disconnect();
  });

  it('should return a 200 status and expected response', async () => {
    const requestData = {
      username: 'testuser',
      filename: 'new-avatar.png'
    };

    const response = await request(app)
      .post('/set-profile-pic')
      .send(requestData);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ message: 'updated' });

    // Verify that the profile picture was updated in the database
    const user = await User.findOne({ anon_username: 'testuser' });
    expect(user.avatar).toBe('new-avatar.png');
  });
});
