import React from 'react';
import '../pages/DirectMessages.css';  // Assume the same CSS file is used for modals

function HatefulCommentModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className="modal-header">A hateful comment has been detected</div>
                <p>You won't be able to post this comment as it contains inappropriate language.</p>
                <div className="modal-buttons">
                    <button className="modal-button delete-button" onClick={onClose}>OK</button>
                </div>
            </div>
        </div>
    );
}

export default HatefulCommentModal;
