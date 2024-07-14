import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BlockUserModal from '../components/BlockUser';

// Styling
import './DirectMessages.css';
import sendIcon from '../images/Iconsax (1).png';
import messageIcon from '../images/message-square.svg';
import moreIcon from '../images/more-horizontal.svg';
import deleteIcon from '../images/trash-2.svg';
import slashIcon from '../images/slash.svg';
import logo from '../images/linkup_logo_highquality.png';
import Sidebar from '../components/Sidebar.js';

// Routing and authentication
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

function App() {
    const [txtMsg, setTxtMsg] = useState('');
    const [userList, setUserList] = useState([]);
    const [matchedList, setMatchedList] = useState([]);
    const [msgList, setMsgList] = useState([]);
    const [msgLimit, setMsgLimit] = useState(10);
    const [selectedUser, setSelectedUser] = useState('');
    const [currentUser, setCurrentUser] = useState('');
    const [msgHovered, setMsgHovered] = useState('');
    const [moreModalShow, setMoreModalShow] = useState(false);
    const [existMoreToLoad, setExistsMoreToLoad] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBlocked, setIsBlocked] = useState(false);

    const messagesEndRef = useRef(null);

    const navigate = useNavigate();
    const isAuthenticated = useIsAuthenticated();
    const auth = useAuthUser();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login-page');
        } else {
            setCurrentUser(auth.name);
            getUsers();
            getMessages();
        }
    }, [isAuthenticated, auth.name, navigate]);

    useEffect(() => {
        setMsgLimit(10);
        checkMoreToLoad();
        scrollToBottom();
    }, [selectedUser]);

    useEffect(() => {
        checkMoreToLoad();
    }, [msgLimit]);

    useEffect(() => {
        if (userList.length > 0) {
            checkMatched();
        }
    }, [userList]);

    const checkMoreToLoad = () => {
        const filteredListLen = msgList.filter((msg) => (msg.to === auth.name && msg.from === selectedUser) ||
            (msg.to === selectedUser && msg.from === auth.name)).length;

        if (filteredListLen <= msgLimit) {
            setExistsMoreToLoad(false);
        } else if (filteredListLen > msgLimit) {
            setExistsMoreToLoad(true);
        }
    };

    useEffect(() => {
        scrollToBottom();
        checkMoreToLoad();
    }, [msgList]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleBlock = () => {
        setIsBlocked(true);
    };

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:3001/sse');

        eventSource.onmessage = async (event) => {
            const newMessage = await JSON.parse(event.data);
            if (newMessage.to === auth.name) {
                getMessages();
            }
        };

        return () => {
            eventSource.close();
        };
    }, [auth.name]);

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (selectedUser) {
                markCurrMessagesAsRead();
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };

    }, [selectedUser]);

    const handleTxtChange = (event) => {
        setTxtMsg(event.target.value);
    };

    const getUsers = async () => {
        try {
            const response = await fetch('http://localhost:3001/get-user', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setUserList(data);
            } else {
                console.log("response was not ok");
            }
        } catch (error) {
            console.log("error here>", error);
        }
    };

    const getMessages = async () => {
        try {
            const response = await fetch('http://localhost:3001/get-messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ currUser: auth.name })
            });

            if (response.ok) {
                const data = await response.json();
                setMsgList(data);
                console.log("retrieved messages");
            } else {
                console.log("response was not ok");
            }
        } catch (error) {
            console.log("error here>", error);
        }
    };

    const sendMessage = async () => {
        if (selectedUser === "" || txtMsg === "" || isBlocked) return;

        const newMsg = {
            to: selectedUser,
            from: currentUser,
            timestamp: new Date().toLocaleString(),
            message: txtMsg
        };

        try {
            const response = await fetch('http://localhost:3001/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newMsg)
            });

            if (response.ok) {
                setTxtMsg('');
                getMessages();
                console.log("Message sent!");
            }
        } catch (error) {
            console.log("error here>", error);
        }
    };

    const markCurrMessagesAsRead = async () => {
        if (selectedUser === "") return;

        const numUnread = msgList.filter((msg) => (msg.to === auth.name && msg.from === selectedUser && msg.read_by_to === false)).length;
        if (numUnread === 0) return;

        console.log("there exists unread");

        const parties = {
            to: currentUser,
            from: selectedUser
        };

        try {
            const response = await fetch('http://localhost:3001/mark-messages-as-read', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(parties)
            });

            if (response.ok) {
                console.log("messages from another user read");
                getMessages();
            } else {
                console.log("messages from another user read but didn't return anything?");
            }
        } catch (error) {
            console.log("error here>", error);
        }
    };

    const deleteConversation = async () => {
        if (selectedUser === "") return;

        const parties = {
            me: currentUser,
            other: selectedUser
        };

        try {
            const response = await fetch('http://localhost:3001/delete-conversation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(parties)
            });

            if (response.ok) {
                getMessages();
            }
        } catch (error) {
            console.log("error here>", error);
        }
    };

    const deleteMessage = async (msg) => {
        if (selectedUser === "") return;

        try {
            const response = await fetch('http://localhost:3001/delete-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ msgId: msg._id })
            });

            if (response.ok) {
                getMessages();
            }
        } catch (error) {
            console.log("error here>", error);
        }
    };

    const checkMatched = () => {
        const currUserId = auth.id;
        console.log(currUserId);

        try {
            userList.forEach(async (user) => {
                const otherUserId = user._id;
                console.log("trying to match " + user._id);

                if (otherUserId !== currUserId) {
                    try {
                        const response = await axios.post(`http://localhost:3001/api/match/${currUserId}`, {
                            currId: currUserId,
                            otherId: otherUserId
                        }, {
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        });

                        const hasMatch = response.data.hasMatch;
                        if (hasMatch) {
                            setMatchedList((prevList) => {
                                const ids = prevList.map(someOtherUser => someOtherUser._id === user._id).filter(mapping => mapping === true).length;
                                if (!ids) {
                                    return [...prevList, user];
                                }
                                return prevList;
                            });
                        }
                    } catch (error) {
                        console.error('Failed to check for matches', error);
                    }
                }
            });
        } catch (error) {
            console.log("error here>", error);
        }
    };

    const getNumberOfUnreadDms = (user) => {
        return msgList.filter((msg) => (msg.to === auth.name && msg.from === user.anon_username && msg.read_by_to === false)).length;
    };

    const getLatestDm = (user) => {
        return msgList.filter((msg) => ((msg.to === auth.name && msg.from === user.anon_username) ||
            (msg.to === user.anon_username && msg.from === auth.name)))[0];
    };

    const scrollToBottom = () => {
        messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    };

    const messageComponent = (msg, index) => {
        if (msg.from !== auth.name) {
            if (msg.read_by_to === false && msg.to === auth.name) {
                return (
                    <div key={msg._id} className="message-outer-single-block">
                        <div className="message-single-block-unread" onMouseOver={() => setMsgHovered(msg._id)} onMouseOut={() => setMsgHovered('')}>{msg.message}</div>
                        {msgHovered === msg._id && <div className="message-timestamp-block-unread">{msg.timestamp}</div>}
                    </div>);
            }
            return (
                <div key={msg._id} className="message-outer-single-block">
                    <div className="message-single-block" onMouseOver={() => setMsgHovered(msg._id)} onMouseOut={() => setMsgHovered('')}>{msg.message}</div>
                    {msgHovered === msg._id && <div className="message-timestamp-block">{msg.timestamp}</div>}
                </div>);
        }
        return (
            <div key={msg._id} className="message-outer-single-block">
                {msgHovered === msg._id &&
                    <div onMouseOver={() => setMsgHovered(msg._id)} onMouseOut={() => setMsgHovered('')} className='dm-msgactions-icons'>
                        {/* <img className='dm-msgactions-size' src={editIcon} alt="Edit Message Icon" /> */}
                        <img className='dm-msgactions-size' src={deleteIcon} onClick={() => { deleteMessage(msg) }} alt="Delete Message Icon" />
                    </div>}
                <div className="message-single-block-self" onMouseOver={() => setMsgHovered(msg._id)} onMouseOut={() => setMsgHovered('')}>{msg.message}</div>
                {msgHovered === msg._id && <div className="message-timestamp-block-self">{msg.timestamp}</div>}
            </div>);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    const userComponent = (user) => {
        const latestDm = getLatestDm(user);
        const numUnreadDms = getNumberOfUnreadDms(user);
        let latestMessage;
        let latestTimestamp;
        let outerBlockClass = 'individual-user-block';

        if (latestDm) {
            latestMessage = latestDm.message.length >= 30 ? latestDm.message.slice(0, 30) + "..." : latestDm.message;
            latestTimestamp = latestDm.timestamp.slice(0, latestDm.timestamp.length - 9) +
                latestDm.timestamp.slice(latestDm.timestamp.length - 2, latestDm.timestamp.length);
        } else {
            latestMessage = "";
            latestTimestamp = "";
        }

        if (user.anon_username === selectedUser) {
            outerBlockClass = 'individual-user-block-selected';
        }

        return (<div onClick={() => {
            markCurrMessagesAsRead();
            setTxtMsg('');
            console.log(selectedUser);
            setSelectedUser(user.anon_username);
            setMoreModalShow(false);
        }}>
            <div className={outerBlockClass}>
                <div className="circle"></div>
                <div className='individual-user-block-name'>{user.anon_username}</div>
                {numUnreadDms > 0 && <div className='individual-user-block-unread-dm'>{numUnreadDms}</div>}
                <div className='individual-user-block-latest-msg'>{latestMessage}</div>
                <div className='individual-user-block-latest-timestamp'>{latestTimestamp}</div>
            </div>
        </div>);
    };

    return (
        <div className="container">
            <div className="app-logo-container">
                <a href="/">
                    <img src={logo} className="logo" alt="LinkUp Logo" />
                </a>
            </div>
            <Sidebar />
            <div className="messages-window-block">
                <div className="my-conversations-header-block">
                    <img className="my-conversations-header-icon" src={messageIcon} alt="sendIcon" />
                    <div className="my-conversations-header-title">
                        My Conversations
                    </div>
                </div>
                <div className="current-selected-user-info-block">
                    {selectedUser !== "" &&
                        <div className="current-select-user-info-block-name-circle"></div>}
                    <div className="current-select-user-info-block-name">{selectedUser}</div>
                    {selectedUser !== "" &&
                        <div className="dm-more-button-block" onClick={() => setMoreModalShow(!moreModalShow)}>
                            <img src={moreIcon} alt="More modal icon" />
                        </div>}
                    {moreModalShow &&
                        <div className="dm-more-modal">
                            <div onClick={() => deleteConversation()} className='dm-more-modal-block-individualblock'>
                                <img className='dm-more-modal-iconsize' src={deleteIcon} alt="Delete Message Icon" />
                                Delete Conversation
                            </div>
                            <div onClick={openModal} className='dm-more-modal-block-individualblock'>
                                <img className='dm-more-modal-iconsize' src={slashIcon} alt="Slash Message Icon" />
                                Block User
                            </div>
                            <BlockUserModal 
                            isOpen={isModalOpen} 
                            onClose={closeModal} 
                            currentUser={currentUser} 
                            selectedUser={selectedUser} 
                            onBlock={handleBlock}
                            />
                        </div>}
                </div>
                <div className="direct-messages-block" ref={messagesEndRef}>
                    {existMoreToLoad && <button onClick={() => setMsgLimit(msgLimit + 10)} className="loadmore-messages-button"> Load More </button>}
                    {msgList.filter((msg) => (msg.to === auth.name && msg.from === selectedUser) ||
                        (msg.to === selectedUser && msg.from === auth.name))
                        .map((msg, index) => messageComponent(msg, index))
                        .slice(0, msgLimit)
                        .reverse()}
                </div>
                <div className="textbox-msg-block">
                    <button onClick={() => { sendMessage(); markCurrMessagesAsRead(); }} className='textbox-msg-sendbutton' disabled={isBlocked}>
                        <img className="send-msg-icon" src={sendIcon} alt="sendIcon" />
                    </button>
                    <input
                        type="text"
                        value={txtMsg}
                        onChange={handleTxtChange}
                        onKeyDown={handleKeyDown}
                        placeholder={"   Type a message"}
                        className="textbox-msg-textbox"
                        disabled={isBlocked}
                    />
                    {isBlocked && <div className="blocked-message">This user has been blocked.</div>}
                </div>
                <div className="select-user-block">
                    {matchedList.map((user) => (userComponent(user)))}
                </div>
            </div>
        </div>
    );
}

export default App;
