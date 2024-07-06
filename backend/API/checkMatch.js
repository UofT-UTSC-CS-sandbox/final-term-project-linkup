<<<<<<< HEAD
=======
const { MongoBatchReExecutionError } = require('mongodb');
>>>>>>> feature/LC-27-trending-resumes-page
const Swipes = require('../schema/swipes');

const checkMatch = async (req, res) => {
    try {
<<<<<<< HEAD
        // const {currentUserId, swipedResumeUploaderId} = req.body;
        const passedInfo = req.body;
        console.log(passedInfo.currId);
        console.log(passedInfo.otherId);

        const currentUserId = passedInfo.currId;
        const swipedResumeUploaderId = passedInfo.otherId;

        // find all swipes where user_id swiped right
        const userSwipes = await Swipes.find({
            user_id: currentUserId,
            accept: true
        });

        console.log(`User swipes: ${JSON.stringify(userSwipes)}`);

        // find all swipes where the uploader swiped right
        const uploaderSwipes = await Swipes.find({
            user_id: swipedResumeUploaderId,
            accept: true
        });

        console.log(`Uploader swipes: ${JSON.stringify(uploaderSwipes)}`);

        if (uploaderSwipes.length === 0) {
            res.json({ hasMatch: false });
            return;
        }

        // check for mututal right swipes
        const hasMatch = userSwipes.some(userSwipe => {
            const uploaderId = userSwipe.uploader_id.toString();

            if(!uploaderId){
                res.json({ hasMatch: false });
                console.error('uploaderId is null');
                return;
            }

            // check if there is a corresponding swipe from uploader_id to user_id
            return uploaderSwipes.some(uploaderSwipe =>
                uploaderSwipe.uploader_id.toString() === currentUserId.toString() &&
                userSwipe.uploader_id.toString() === swipedResumeUploaderId.toString() && 
                uploaderSwipe.accept
            );
        });

        res.json({ hasMatch });
    } catch (error) {
        console.error('Error in finding match:', error);
=======
        const userId = req.params.userId;

        // find all swipes where user_id swiped right and uploader_id also swiped right
        const matches = await Swipe.find({
            user_id: userId,
            accept: true
        }).populate({
            path: 'resume_id',
            populate: {
                path: 'uploader_id',
                model: 'User'
            }
        });

        // check for mututal right swipes
        const hasMatch = matches.some(match => {
            const uploaderId = match.resume_id.uploader_id.toString();

            // check if there is a corresponding swipe from uploader_id to user_id
            return matches.some(otherMatch => 
                otherMatch.user_id.toString() === uploaderId && 
                otherMatch.accept &&
                otherMatch.resume_id.toString() === match.resume_id.toString()
            );
        });
        
        res.json({ hasMatch });
    } catch (error) {
>>>>>>> feature/LC-27-trending-resumes-page
        res.status(500).json({ error: 'Error in finding match' });
    }
};

module.exports = checkMatch;