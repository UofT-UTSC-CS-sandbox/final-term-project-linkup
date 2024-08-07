## **To run this CI/CD Workflow:**
-  Simply, make a PR to the `main` branch or push changes to the `main` branch
- Go to the `Actions` Tab to view the status of the workflow.

## Deliverables
- The automated tests for the backend and frontend can be found in backend/__ tests __ and frontend/__ tests __ respectively
- The Dockerfiles can be found in the backend/ and frontend/ directories
- The docker-compose files can be found in the root directory

## Details of Implementation
- **CI Pipeline**
  - Specify that the CI Pipeline is triggered on PR or push to `main`
  - Checkout code via `Github Actions`
  - Install `docker-compose`
  - Log in to Docker Hub 
  - Run `docker-compose build` to build frontend and backend images with and without dependencies
    - **Note**: we have defined a redis container within the docker-compose file in case that we want to implement a test suite that requires redis to run
  - Tag frontend and backend images and push them to Docker Hub
  - List docker images 
- **CD Pipeline**
  - Specify workflow to run only after CI Pipeline has been completed
  - Run code on `ubuntu-latest` 
  - Checkout code via `Github Actions`
  - Log in to Docker Hub
  - Pull Docker backend and frontend images
  - Deploy backend and frontend containers
  - Run Automated Tests on backend and frontend
    - We first install necessary packages (i.e. `npm install`)
    - Then, we run `npm test` for the respective containers each having their own test suite

