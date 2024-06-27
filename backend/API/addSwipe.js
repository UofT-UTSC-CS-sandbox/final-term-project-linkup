const Swipes = require('../schema/swipes');

const addSwipe = async (req, res) => {
    try {
        const { user_id, resume_id, uploader_id, accept } = req.body;

        // Create a new instance of Swipes
        const swipe = new Swipes({
            user_id,
            resume_id,
            uploader_id,
            accept
        });

        // Save the swipe to the database
        await swipe.save();

        res.status(200).json({ message: 'Swipe added successfully' });
    } catch (error) {
        console.error('Error adding swipe:', error);
        res.status(500).json({ error: 'Error adding swipe' });
    }
};

module.exports = addSwipe;
