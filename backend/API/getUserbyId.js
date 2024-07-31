const User = require('../schema/user');


const getUser = async (req, res) => {
    try {
        // Get the current user's id
        const userId = req.params.userId;

        // Get list of resumes that user has already swiped on
        const targetUser = await User.findById(userId);
        console.log('Returning User:', targetUser); // Log the resume data

        res.json(targetUser);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: error.message });
    }
  };

module.exports = getUser;