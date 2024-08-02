const User = require('../schema/user');
const express = require('express');
const cors = require('cors');
// Mail and Google API's
var Mailgen = require('mailgen');
const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const bcryptjs = require('bcryptjs');
const crypto = require('crypto');
const token = crypto.randomBytes(20).toString('hex');

const app = express();
app.use(cors());
app.use(express.json());

require('dotenv').config();

const createTransporter = async () => {
  try {
    const oauth2Client = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          console.log("*ERR: ", err)
          reject();
        }
        resolve(token); 
      });
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.GROUP_EMAIL,
        accessToken,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    return transporter;
  } catch (err) {
    return err;
  }
};

const sendEmailVerification = async({passedEmail}, res) => {
  const currentUrl = "http://localhost:3000";

  var mailGenerator = new Mailgen({
    theme: 'default',
    product: {
      name: 'LinkUp',
      link: currentUrl
    }
  });

  var emailContent = {
    body: {
      intro: 'Welcome to LinkUp! We\'re very excited to have you on board.',
      action: {
        instructions: 'To get started with LinkUp, please click here:',
        button: {
          color: '#22BC66',
          text: 'Confirm your account',
          link: `${currentUrl}/verification/${token}`,
        }
      }
    }
  };

  var emailBody = mailGenerator.generate(emailContent);

  let mailConfig = {
    from: process.env.GROUP_EMAIL,
    to: passedEmail,
    subject: "< LinkUp : Please verify your email! >",
    html: emailBody,
  };

  let emailTransporter = await createTransporter();
  await emailTransporter.sendMail(mailConfig);
}

const animalNames = ['Cat', 'Dog', 'Moose', 'Eagle', 'Tiger', 'Lion', 'Bear', 'Wolf', 'Fox'];

const generateAnonUsername = async () => {
  let username;
  let usernameExists = true;

  while (usernameExists) {
    const animal = animalNames[Math.floor(Math.random() * animalNames.length)];
    const randomNumber = Math.floor(1000 + Math.random() * 9000).toString();
    username = 'Anonymous' + animal + randomNumber;
    usernameExists = await User.findOne({ anon_username: username });
  }

  return username;
};

const newUser = async (req, res) => {
  try {
    const passedUser = req.body;

    const user = await User.findOne({
      "email": passedUser.email,
    });

    if (user) {
      return res.status(401).send('Account creation failed: email is already used by an existing account');
    }
    // generate anon username
    const anonUsername = await generateAnonUsername();
    // Bcrypt for hashing
    var generatedSalt = bcryptjs.genSaltSync(10);
    var hashedPassword = bcryptjs.hashSync(passedUser.password, generatedSalt);

    const newUser = new User({
      anon_username: anonUsername,
      email: passedUser.email,
      password: hashedPassword,
      field_of_interest: passedUser.field_of_interest,
      work_experience_level: passedUser.work_experience_level,
      education: passedUser.education,
      location: passedUser.location,
      avatar: "bearTwemoji.png",
      salt: generatedSalt,
      verified: false,
      verificationToken: token,
      preferences_edu:"",
      preferences_interest:"",
      preferences_loc: "",
      preferences_workexp: "",
    });

    await newUser.save();
    sendEmailVerification({passedEmail: passedUser.email}, res);
    res.status(200).json({ message: 'User created and verification email sent', newUser });

  } catch (error) {
    res.status(500).send('Error adding User: ' + error.message);
  }
};

module.exports = newUser;
