import React from 'react';
import '../pages/DirectMessages.css'; // Ensure this path is correct

function BlockUserModal({ isOpen, onClose, currentUser, selectedUser, onBlock }) {
    if (!isOpen) return null;

    const blockUser = async (username, blockedUsername) => {
        try {
            const response = await fetch('http://localhost:3001/block-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, blockedUsername })
            });

            if (response.ok) {
                console.log('User blocked successfully');
                onBlock(); // Update the UI to reflect the blocked user
                onClose(); // Close the modal
            } else {
                console.log('Failed to block user');
            }
        } catch (error) {
            console.log('Error blocking user:', error);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className="modal-header">Do you want to block this user?</div>
                <p>You won't be able to continue to chat with this user any longer</p>
                <p>You can't undo this action</p>
                <div className="modal-buttons">
                    <button className="modal-button cancel-button" onClick={onClose}>Cancel</button>
                    <button className="modal-button delete-button" onClick={() => {
                        blockUser(currentUser, selectedUser);
                    }}>Block</button>
                </div>
            </div>
        </div>
    );
}

export default BlockUserModal;
