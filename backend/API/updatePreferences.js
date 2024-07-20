const User = require('../schema/user');

async function updatePreferences(req, res) {
    const { email, preferences } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            console.log('User not found with email:', email);
            return res.status(404).send('User not found');
        }

        // Construct the update object conditionally
        const update = {};
        if (preferences.preferences_edu !== undefined) update.preferences_edu = preferences.preferences_edu;
        if (preferences.preferences_interest !== undefined) update.preferences_interest = preferences.preferences_interest;
        if (preferences.preferences_loc !== undefined) update.preferences_loc = preferences.preferences_loc;
        if (preferences.preferences_workexp !== undefined) update.preferences_workexp = preferences.preferences_workexp;

        // Update the user document
        const updatedUser = await User.findByIdAndUpdate(user._id, update, { new: true });

        console.log('Updated User:', updatedUser); // Log updated user info
        res.status(200).send('Preferences updated successfully');
    } catch (error) {
        console.error('Error updating preferences:', error);
        res.status(500).send('Error updating preferences: ' + error.message);
    }
}

module.exports = updatePreferences;
