import React, { useState, useEffect } from 'react';
import sendIcon from '../images/Iconsax (1).png'; // Ensure the correct path

function MessageInput({ currentUser, selectedUser, sendMessage, isBlocked }) {
    const [txtMsg, setTxtMsg] = useState('');

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !isBlocked) {
            sendMessage(txtMsg);
            setTxtMsg('');
        }
    };

    return (
        <div className="textbox-msg-block">
            <button onClick={() => { if (!isBlocked) sendMessage(txtMsg); setTxtMsg(''); }} className='textbox-msg-sendbutton'>
                <img className="send-msg-icon" src={sendIcon} alt="Send Icon" />
            </button>
            <input
                type="text"
                value={txtMsg}
                onChange={(e) => setTxtMsg(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message"
                className="textbox-msg-textbox"
                disabled={isBlocked}
            />
            {isBlocked && <div className="blocked-message">This user has been blocked.</div>}
        </div>
    );
}

export default MessageInput;
