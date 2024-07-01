const { MongoBatchReExecutionError } = require('mongodb');
const Swipes = require('../schema/swipes');

const checkMatch = async (req, res) => {
    try {
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
        res.status(500).json({ error: 'Error in finding match' });
    }
};

module.exports = checkMatch;