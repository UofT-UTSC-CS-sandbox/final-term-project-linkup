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

        const updatedUser = await User.findByIdAndUpdate(user._id, {
            preferences_edu: preferences.preferences_edu || user.preferences_edu,
            preferences_interest: preferences.preferences_interest || user.preferences_interest,
            preferences_loc: preferences.preferences_loc || user.preferences_loc,
            preferences_workexp: preferences.preferences_workexp || user.preferences_workexp,
        }, { new: true });
        

        console.log('Updated User:', updatedUser); // Log updated user info
        res.status(200).send('Preferences updated successfully');
    } catch (error) {
        console.error('Error updating preferences:', error);
        res.status(500).send('Error updating preferences: ' + error.message);
    }
}

module.exports = updatePreferences;
