
# LinkUp: Transforming Resume Reviews into Opportunities!

## Overview

LinkUp is a dynamic web application designed to transform how job seekers refine their resumes and expand their professional networks. By enabling users to anonymously upload and review resumes, LinkUp creates a collaborative environment focused on delivering constructive feedback. This interactive platform uses a swipe-based system for document review, where users swipe right to engage and provide feedback, and swipe left to skip, ensuring thorough evaluation of each resume.

When mutual right swipes occur, signaling a match, LinkUp allows users to initiate direct messaging, fostering deeper connections and potential professional collaborations. This system not only enhances resume quality through direct community feedback but also builds a network of professionals who can support each other’s career growth. LinkUp is committed to helping job seekers improve their employment prospects in a competitive market while nurturing a supportive professional community.


![Readme Image 2](src/images/readme2.png "Screenshot for Readme")


## Motivation

The job market is fiercely competitive, and a standout resume is crucial for success. Many job seekers lack access to tailored feedback that could elevate their resumes from good to great. Our platform addresses this by enabling users to anonymously receive and provide detailed feedback, facilitating a more effective resume refinement process in a supportive community environment.

## Installation

To build and run the LinkUp project, follow these steps after setting up the prerequisites:

1. **Clone the Linkup repository from GitHub:**
   ```bash
   git clone https://github.com/UofT-UTSC-CS-sandbox/final-term-project-linkup.git
   ```

2. **Navigate to the project directory in your terminal:**
   ```bash
   cd final-term-project-linkup
   ```

3. **Install the required dependencies:**
   ```bash
   npm install
   ```

4. **Configure the MongoDB connection.** Accessing MongoDB Atlas for Database
   To gain access to our MongoDB Atlas cluster for this project, please follow these outlined steps:

   1. **Create an Account**:
   - If you do not already have an account, sign up for MongoDB Atlas by visiting the [MongoDB Atlas website](https://www.mongodb.com/atlas).

   2. **Submit Your Account Email**:
   - Please email your MongoDB Atlas account email address to [vaibhav.santhanam@mail.utoronto.ca]. This step is necessary to proceed with the access grant.

   3. **Await Access Grant**:
   - Once we receive your email, we will proceed to add you to the MongoDB Atlas cluster. An email confirmation will be sent once access has been granted.


5. **Start the application:**
   ```bash
   npm start
   ```

6. **Open your browser and visit the following URL to access the Linkup web application:**
Once you have started the server, Visual Studio Code or your terminal should automatically open your browser. If it does not, you can manually open your browser and visit the following URL to access the Linkup web application:

   ```plaintext
   http://localhost:3001
   ```

## Contribution

We appreciate contributions to LinkUp and value your efforts in enhancing the application. Here are the guidelines for contributing:

### Git Flow Strategy

We will employ the Git Flow strategy, which utilizes a two-branch system, *main* and *develop*, to manage the project's codebase. The *main* branch will contain stable releases, while *develop* will hold all completed features.

New features should branch from *develop*, and upon completion, a Pull Request (PR) should merge back into *develop*.

#### Branch Naming and Commit Guidelines

We will categorize branches as feature, bugfix, hotfix, or chore. Commits should follow the Conventional Commits structure to simplify change tracking.

#### Testing and Documentation

Ensure thorough testing of new features to maintain stability. Documentation should be updated accordingly.

### Issue Tracking

We utilize GitHub Issues to manage bugs, feature requests, and other tasks. Check existing issues or create a new one before starting your work.

### Pull Requests

After completing your changes, submit a pull request to the *develop* branch. A team member will review and provide feedback before merging.

We believe in the power of collaboration to build the best product possible and look forward to your contributions to make Linkup better.

## Technologies Used

Linkup utilises a range of technologies to deliver a smooth and engaging user experience:

- **JavaScript:** The primary language for both frontend and backend development.
- **HTML:** Used to structure and present content on the web pages.
- **CSS:** Used for styling and layout of the application.
- **MongoDB:** A NoSQL database to store user profiles, resume reviews, and connection data.
- **Node.js:** A JavaScript runtime for server-side execution.
- **Express.js:** A web application framework for Node.js, used to build the backend API.
- **React:** A JavaScript library for building user interfaces, used in the frontend.

This combination of technologies provides a strong and efficient foundation for Linkup, ensuring a seamless user experience and reliable performance.

Thank you for your interest in LinkUp. We hope our application helps to enhance professional networking journey!

Figma link 
``` plain text 
https://www.figma.com/design/0iETezP6dJLcd5efMPoop3/CSCC01-%7C-Link-Up-Prototype

```

Acknowledgements
1) Ashtian Dela Cruz
2) Bahar Chidem 
3) Keerthiha Baskaran
4) Matthew Wu
5) Vaibhav Lakshmi Santhanam
