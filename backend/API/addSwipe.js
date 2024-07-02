const Swipes = require('../schema/swipes');
const Resume = require('../schema/resume');

const addSwipe = async (req, res) => {
    try {
        const { user_id, resume_id, uploader_id, accept } = req.body;
        const existingSwipe = await Swipes.findOne({ user_id, resume_id, accept });

        if (existingSwipe) {
            return res.status(400).json({ error: 'Duplicate swipe detected' });
        }

        // Create a new instance of Swipes
        const swipe = new Swipes({
            user_id,
            resume_id,
            uploader_id,
            accept
        });

        // Save the swipe to the database
        await swipe.save();

        // update resume table to increment number of swipes only if user swiped right on user
        if (accept) {
            await Resume.findByIdAndUpdate(resume_id, { $inc: { num_swipes: 1 } });
        }

        res.status(200).json({ message: 'Swipe added successfully' });
    } catch (error) {
        console.error('Error adding swipe:', error);
        res.status(500).json({ error: 'Error adding swipe' });
    }
};

module.exports = addSwipe;
