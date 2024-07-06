const Swipes = require('../schema/swipes');
<<<<<<< HEAD
const Resume = require('../schema/resume');
=======
>>>>>>> feature/LC-27-trending-resumes-page

const addSwipe = async (req, res) => {
    try {
        const { user_id, resume_id, uploader_id, accept } = req.body;
<<<<<<< HEAD
        const existingSwipe = await Swipes.findOne({ user_id, resume_id, accept });

        if (existingSwipe) {
            return res.status(400).json({ error: 'Duplicate swipe detected' });
        }
=======
>>>>>>> feature/LC-27-trending-resumes-page

        // Create a new instance of Swipes
        const swipe = new Swipes({
            user_id,
            resume_id,
            uploader_id,
            accept
        });

        // Save the swipe to the database
        await swipe.save();

<<<<<<< HEAD
        // update resume table to increment number of swipes only if user swiped right on user
        if (accept) {
            await Resume.findByIdAndUpdate(resume_id, { $inc: { num_swipes: 1 } });
        }

=======
>>>>>>> feature/LC-27-trending-resumes-page
        res.status(200).json({ message: 'Swipe added successfully' });
    } catch (error) {
        console.error('Error adding swipe:', error);
        res.status(500).json({ error: 'Error adding swipe' });
    }
};

module.exports = addSwipe;
