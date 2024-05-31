# User Stories

## Sprint 1

1. **As a new/registered user, I want to sign up and log in so that I can create an account and access my existing account.**

    - Given a user is on the sign-up page, when they enter their email and password and click "Sign Up," then an account should be created and a confirmation email should be sent. Given a registered user is on the login page, when they enter their credentials and click "Log In," then they should be logged into their account.

2. **As a new user, when I create an account, I want to be able to set my preferences in the types of documents that I can view from other users so that I can customize my swiping experience.**

    - Given a new user is creating an account, when they reach the preferences step, then they should be able to select the field of interest, experience level, education level, geographic location from the drop down menu.

3. **As a registered user, I want to upload more than one resume so that I can choose what document I want other users to view.**

    - Given a registered user is on the upload page, when they select and upload multiple resumes in .png, .pdf, or .docx formats, then the resumes should be uploaded successfully.

4. **As a registered user, I want to be able to delete as many of my uploaded documents so that I can upload other documents to replace them.**

    - Given a registered user is on their profile page under the ‘My Resumes’ section, when they click the "Delete/trash bin” icon at the bottom right of their resume, then the document should be deleted after a confirmation prompt.

5. **As a registered user, I want an anonymous username so that my privacy is protected.**

    - Given a new user is signing up, when they complete the registration process, then the system should automatically assign an anonymous username, and it should be displayed in place of their real name in public views.

## Sprint 2

1. **As a registered user, I want my name and contact information on my resume to remain confidential in public view so that my anonymity is ensured.**

    - Given a registered user uploads a resume, when the resume is displayed publicly, then personal information (name and contact details) should be automatically masked.

2. **As a user, I want to swipe left (reject) or right (wanting to match) on resumes so that I can personalize my resume browsing experience and choose what accounts I want to match with. After matching, I want to continue swiping without needing to leave a comment or start a private conversation.**

    - Given a user is on their feed, when they swipe right (accept) / left (reject) on a document, then the document should be stored as a potential match/rejected and not appear on their feed and when the user matches they should be able to continue swiping without needing to leave a comment or start a private conversation.

3. **As a user who has matched with another user, I want to be able to start a private one-on-one conversation with that user so that I can network with them and gain a professional connection with them.**

    - Given a registered user has matched with another user, when the matched user initiates a private conversation, then the registered user should receive a notification in their chat.

4. **As a registered user, I want to be able to zoom in on documents so that I can view the content on the document more clearly.**

    - Given a registered user is viewing a resume, when they click on the resume, then the document should zoom in and become scrollable.

5. **As a registered user, I can view trending documents so that I can see what types of documents are getting the most traction on the platform.**

    - Given a registered user is on the trending documents page, when they browse, then they should see a list of documents that are getting the most traction on the platform.

## Sprint 3

1. **As a user, I want to be able to leave comments on the document of the user that I have swiped right on.**

    - Given a registered user receives a comment on their document, when they review the comment, then they should have the option to accept or reject the incoming request to match with the user who left the comment.

2. **As a registered user, I can view comments from users I have matched with or swiped right on me.**

    - Given a registered user is viewing their document, when they check for comments, then they should be able to view comments left on their document by other users, one user at a time, so that they can efficiently review feedback provided by each user without their screen being cluttered.

3. **As a registered user, I want to delete conversations with users that I have matched with so that I can manage my chat history.**

    - Given a registered user is in their chat history, when they select a conversation and click "Delete" from the dropdown menu of the three-dot icon, then the conversation should be removed from their chat history.

4. **As a registered user, I can write and publish public comments on trending documents so that I can leave feedback on documents that I may not have seen.**

    - Given a registered user is viewing a trending document, when they write and publish a comment, then the comment should appear publicly on that document’s comments section.

5. **As a registered user, I want to be able to edit my preferences so that I can modify my swiping experience whenever.**

    - Given a registered user is in their profile settings, when they edit their preferences (the field of interest, experience level, education level, geographic location), then the resumes displayed in their feed should be updated accordingly.

## Sprint 4

1. **As a registered user, I do not want to see hateful and discriminatory comments that users may have left on my document.**

    - Given a registered user views comments on their document, when there are hateful or discriminatory comments, then those comments should be filtered out or hidden.

2. **As a registered user, I can reply to public comments on trending documents so that I can interact with different users and get to know their thoughts on the trending documents.**

    - Given a registered user is viewing comments on a trending document, when they reply to a comment, then the reply should be posted and visible under the original comment.

3. **As a registered user, I can upvote and downvote public comments on trending documents so that I can influence what comments are seen at the top of the public comment section(s).**

    - Given a registered user is viewing comments on a trending document, when they upvote or downvote a comment with the up/down arrow mark, then the vote should be registered and the comment's position should adjust based on its score.

4. **As a registered user, I can block users that I have matched with so that I can prevent users from talking to me.**

    - Given a registered user is in a matched conversation, when they block the user, then the blocked user should no longer be able to send messages.

5. **As a registered user, I can customize my profile so that I can personalize my account.**

    - Given a registered user is on their profile settings page, when they change their profile icon (choosing from the options provided) or bio, then the changes should be saved and reflected on their public profile.
