## **System Design for Building, Pushing, Deploying Docker**
### **CI Pipeline**
- `A2_Part1.yml` file
  - Responsible for building docker images for the frontend and backend and pushing them to DockerHub
- `A2_Part2.yml` file
  - Responsible for pulling frontend and backend containers and running automated tests within their respective containers



## **System Design for Automated Testing**
### **Backend**
- In `package.json`:
- `npm test`
    - runs `jest --coverage --forceExit --maxWorkers=2`
- In `__ tests __` :
  - `setProfilePic.test.js`
    - verify that making `POST` request at `/set-profile-pic` endpoint results in 200 response code
###  **Frontend**
- In `package.json`:
  - `npm test`
    - runs `jest --coverage --transformIgnorePatterns \"node_modules/(?!axios)/\"`
- In `__ tests __` :
  - `LoginPage.test.js`:
    - check that the Login component contains the phrase “Swipe. Match. Network.”
