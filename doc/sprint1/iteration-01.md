# LinkUp - Iteration 01 Planning Meeting

## Iteration 01

 * **Start date**: 06/04/2024
 * **End date**: 06/16/2024

## Process
#### **Roles & responsibilities**
The main roles are:
- **the scrum master**: the team member who delegates tasks to members, starts sprints, and ensures that we have completed and prepared all the necessary files and documents for submission
- **the repository manager**: the team member who makes sure other team members are making pull requests, updating issues, and merging and creating branches safely
- **the developers**: team members who are responsible for writing and testing code that they create; they are assigned to a task listed on the KANBAN Jira Board; 
- **the designers**: team member(s) who are responsible for maintaining the Figma prototype, ensuring that all fonts, sizing, and colors are uniform across all pages
- **the note takers**: team member(s) who are responsible for summarizing discussions during in-person or on-call meetings

#### **Events**
 * We plan to have at least one weekly in-person meeting and conduct online meetings if need be.
 * The purpose of each meeting is to discuss topics that require everyone’s approval, whether that be changes to the UI of a page or changes to the flow of our app. In addition, we may discuss technical blockers that team members require support with and database management and scaling in consideration of added features to our app. 
Nearing the end of each sprint, we will conduct a code review/merge session where the repository manager will attempt to merge all feature/bugfix branches to the develop branch. During the process, the repository manager may need to consult other team members, where most if not all will be present online or in-person, to resolve merge conflicts. 

#### **Artifacts**
We mainly rely on our KANBAN board to track members’ progress on their assigned task. Tasks are prioritized using the label feature within the KANBAN board on Jira, setting the tasks to High, Medium, or Low. They are evaluated based on how integral they are to the app’s core functionality (i.e. whether the app can work with or without accomplishing that task). To keep track of what tasks have been solved, we use the Issues and Pull Requests Tab within our Github repository. Issues listed in our Github repository mostly correspond to the tasks assigned to team members in our KANBAN board. These types of issues will be updated when a team member replies to that issue with the Pull Request link. Then, they will be resolved once the repository managers validates the PR and accepts or rejects the merge depending on the circumstances. Additional issues, such as bug fixes, database table needs to be set up, etc. will be also listed on the Issues tab. These types of issues will be resolved with Pull Request or a written response to that issue. 

## Product

#### **Goals and tasks**

**Goal #1**: Seamless onboarding process for new users
- **Description**: Users should be able to create an account using their email and setting up a password. Once they have successfully created an account using their email and password, then they are redirected to our landing page. Their public identity remains anonymous within our app.
- **Tasks to complete for Goal #1**: 
Create schema for users in our MongoDB database.
Create a backend API to send a POST request when a user enters an email and password to create an account.
Ensure that the user with that submitted email does not already exist within our database.
Generate a unique anonymous username for a new user.
Ensure that email is valid by sending an email to the submitted email, asking to verify the account.

**Goal #2**: Easy sign in process 
- **Description**: Users who have already created an account for our app can easily sign in by entering their email and password. If they have successfully done so, then they are redirected to the landing page. 
- **Tasks to complete for Goal #2**: 
Create a backend API to send a GET request when a user enters an email and password to sign in.
Ensure that the user exists within our database.
If the user exists, then redirect the user to the landing page.

**Goal #3**: Upload and delete as many resumes as users want
- **Description**: Users should be able to upload and delete pdf files. Here, we assume users intend to upload pdf files that are resumes.
- **Tasks to complete for Goal #3**: 
Create a page where within that page is a module that prompts the user to upload a pdf file. 
A progress bar will indicate whether the pdf file has been successfully uploaded. 
If the pdf file has successfully uploaded, then a preview of the pdf file will appear momentarily after. 
In the backend, we will send a POST request to store the pdf file and path to that file within our MongoDB database. 
If a user chooses to delete on their uploaded pdf files, they can do so by clicking a trash bin icon to delete. 
In the backend, we will send a DELETE request to delete said pdf file which has a unique id attributed to it. 

**Goal #4**: Users can set up preferences for their swiping experience
- **Description**: Before users can start swiping on other users’ resumes, they have the option to set preferences in the resumes that they want to see and also swipe on. These options include field of interest, work experience, location, and education. 
- **Tasks to complete for Goal #4**: 
Create a page where within that page is a module that prompts the user to select from a dropdown of options relating to that category (e.g. field of interest). 
Ensure that users can proceed to swiping without selecting any choices for preferences. 
Once the user has clicked “Finish,” they are directed to the page where they can swipe (not to be implemented for this sprint).
In the backend, the user document which matches the user who is currently logged in will have the fields respective to the preferences updated with the proper values. 

#### **Artifacts**
**Artifact #1**: Figma Prototype
- Illustrates every possible page of our “happy path.” Team members can directly refer to our Figma Prototype when building the UI of their designated task(s) or page. In addition, stakeholders can understand our vision for our app–from the app aesthetics to the user flow. 

**Artifact #2**: Database Design Document
- Maps out the relations between schemas. This document showcases our thought process in storing user and resume data. For team members, this document outlines how we should store data, so that when, for example, we need to keep track of the impressions (views) for user resumes, the document will clearly show how to retrieve that information.

**Artifact #3**: Readme file and other forms of documentation
- Act as a one-stop shop for our pitch, means of contribution, running our app, etc. If stakeholders want to learn about our app in a holistic view, our Readme includes our pitch: our purpose and how it works. In addition, if they want to better understand our target users and long-term vision for our app, they can refer to our product.md file and our personas. If they want to contribute to our long-term vision, they can refer to the "Contributions" section in our Readme file to learn how to responsibly contribute to our codebase. 




