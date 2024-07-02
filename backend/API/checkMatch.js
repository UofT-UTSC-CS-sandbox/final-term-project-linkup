const Swipes = require('../schema/swipes');

const checkMatch = async (req, res) => {
    try {
        const {currentUserId, swipedResumeUploaderId} = req.body;

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
        res.status(500).json({ error: 'Error in finding match' });
    }
};

module.exports = checkMatch;