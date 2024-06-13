const User = require('../schema/user'); 

async function updatePreferences(req, res) {
    const { email, preferences } = req.body; 

    try {
        // First, find the user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            console.log('User not found with email:', email);
            return res.status(404).send('User not found');
        }

        // Then, update the user's preferences using the user ID
        const updatedUser = await User.findByIdAndUpdate(user._id, {
            field_of_interest: preferences.field_of_interest || user.field_of_interest,
            work_experience_level: preferences.work_experience_level || user.work_experience_level,
            education: preferences.education || user.education,
            location: preferences.location || user.location,
        }, { new: true });

        console.log('Updated User:', updatedUser); // Log updated user info
        res.status(200).send('Preferences updated successfully');
    } catch (error) {
        console.error('Error updating preferences:', error);
        res.status(500).send('Error updating preferences: ' + error.message);
    }
}

module.exports = updatePreferences;
