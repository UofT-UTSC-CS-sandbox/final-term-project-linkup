import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BlockUserModal from '../components/BlockUser'; // Import BlockUserModal component

// Routing and authentication
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'; 

// Styling
import './DirectMessages.css';
import sendIcon from '../images/Iconsax (1).png';
import messageIcon from '../images/message-square.svg';
import moreIcon from '../images/more-horizontal.svg';
import deleteIcon from '../images/trash-2.svg';
import slashIcon from '../images/slash.svg';
import logo from '../images/linkup_logo_highquality.png';
import Sidebar from '../components/Sidebar.js';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

// Profile Pics
import bearTwemoji from '../images/profilePics/bearTwemoji.png';
import bunnyTwemoji from '../images/profilePics/bunnyTwemoji.png';
import catTwemoji from '../images/profilePics/catTwemoji.png';
import cowTwemoji from '../images/profilePics/cowTwemoji.png';
import dogTwemoji from '../images/profilePics/dogTwemoji.png';
import horseTwemoji from '../images/profilePics/horseTwemoji.png';
import pigTwemoji from '../images/profilePics/pigTwemoji.png';
import tigerTwemoji from '../images/profilePics/tigerTwemoji.png';
import { extractColors } from 'extract-colors'

function App() {
  const [txtMsg, setTxtMsg] = useState('');

  const [userList, setUserList] = useState([]);
  const [matchedList, setMatchedList] = useState([]);
  const [matchedListProfileColourDict, setMatchedListProfileColourDict] = useState({});

  const [msgList, setMsgList] = useState([]);
  const [msgLimit, setMsgLimit] = useState(10);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedUserProfilePic, setSelectedUserProfilePic] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  const [msgHovered, setMsgHovered] = useState('');
  const [moreModalShow, setMoreModalShow] = useState(false);
  const [existMoreToLoad, setExistsMoreToLoad] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  const messagesEndRef = useRef(null);

  // A dictionary that maps profile picture STRINGS to IMAGES
  const profilePicDictionary = {
    "bearTwemoji.png": bearTwemoji,
    "bunnyTwemoji.png": bunnyTwemoji,
    "catTwemoji.png": catTwemoji,
    "cowTwemoji.png": cowTwemoji,
    "dogTwemoji.png": dogTwemoji,
    "horseTwemoji.png": horseTwemoji,
    "pigTwemoji.png": pigTwemoji,
    "tigerTwemoji.png": tigerTwemoji
  };

  // Profile pic background colour
  const [bgColour, setBgColour] = useState('#D0D0D0'); // Default grey colour

  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const colour = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * colour).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  const loadImageAndExtractColour = async (profilePic) => {
    try {
      const imgSrc = profilePicDictionary[profilePic];
      if (imgSrc) {
        const img = new Image();
        img.src = imgSrc;
        img.crossOrigin = 'anonymous';

        return new Promise((resolve, reject) => {
          img.onload = async () => {
            try {
              const returnedColours = await extractColors(imgSrc);
              const colours = returnedColours.sort((a, b) => b.area - a.area); // Sorting by most prominent colours
              if (colours.length > 0) {
                const { hue, saturation, lightness } = colours[0];
                const adjustedSaturation = Math.min(1, saturation + 0.7);
                const adjustedLightness = Math.min(0.85, lightness + 0.5); // Increase the brightness
                const adjustedColour = hslToHex(
                  hue * 360, // Convert hue to degrees
                  adjustedSaturation * 100, // Convert to percentage
                  adjustedLightness * 100 // Convert to percentage
                );
                resolve(adjustedColour);
              } else {
                reject('No colours found');
              }
            } catch (err) {
              reject('Error extracting colour:', err);
            }
          }
        });
      }
    }
    catch (error) {

    }
  };

  const fetchColour = async () => {
    try {
      const colour = await loadImageAndExtractColour(selectedUserProfilePic);
      setBgColour(colour);
    } catch (err) {
      console.error('Error fetching colour:', err);
    }
  };

  const fetchColourOthers = async () => {
    try {
      // Create an array of promises
      const colourPromises = matchedList.map(async (user) => {
        const colour = await loadImageAndExtractColour(user.avatar);
        return { username: user.anon_username, colour };
      });
  
      // Wait for all promises to resolve
      const userToColour = await Promise.all(colourPromises);
  
      // Update the state with the colour dictionary
      const newMatchedListProfileColourDict = {};
      userToColour.forEach(({ username, colour }) => {
        newMatchedListProfileColourDict[username] = colour;
      });
  
      console.log(newMatchedListProfileColourDict);
      setMatchedListProfileColourDict(newMatchedListProfileColourDict);
    } catch (err) {
      console.error('Error fetching colour:', err);
    }
  };

  useEffect(() => {
    fetchColour();
  }, [selectedUserProfilePic]);

  // Delete Conversation Modal
  const [delConvModalOpen, setDelConvModalOpen] = useState(false);
  const toggleDelConvModal = () => {
    setDelConvModalOpen(!delConvModalOpen);
  };

  const [delMsgModalOpen, setDelMsgModalOpen] = useState(false);
  const [msgToBeDeleted, setMsgToBeDeleted] = useState({});
  const toggleDelMsgModal = () => {
    setDelMsgModalOpen(!delMsgModalOpen);
  };

  // Authentication and navigation
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser();

  // Redirect user to login page if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login-page');
    } else {
      setCurrentUser(auth.name);
      getUsers();
      getMessages();
      checkBlockedUsers(auth.name, selectedUser); // Check blocked status on load
    }
  }, [isAuthenticated, auth.name, navigate, selectedUser]);

  // Updates messages immediately after detecting a change in the selected user
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

  // Function to check if there are more messages to load
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

  useEffect(() => {
    fetchColourOthers();
  }, [matchedList]); 

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleBlock = () => {
    setIsBlocked(true);
  };

  const checkBlockedUsers = async (username, selectedUser) => {
    try {
      const response = await fetch('http://localhost:3001/get-blocked-users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
      });
      const data = await response.json();
      if (data.blockedUsernames.includes(selectedUser)) {
        setIsBlocked(true);
      } else {
        setIsBlocked(false);
      }
    } catch (error) {
      console.error('Error fetching blocked users:', error);
    }
  };

  // Listening for new messages
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

  // Checking if the user has left the page
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

  // Communicating Email and password to server
  const getUsers = async () => {
    try {
        await fetch('http://localhost:3001/get-user', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json'
            }
        }).then(async (response) => {
          if (response.ok) {
            const data = await response.json();
            
            // Setting user list
            setUserList(data);
          } else {
            console.log("response was not ok");
              
          }
        })

    } catch (error) {
      console.log("error here>");
    }
  };

  // Communicating Email and password to server
  const getMessages = async () => {

    try {
      await fetch('http://localhost:3001/get-messages', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({currUser : auth.name})
      }).then(async (response) => { 
        if (response.ok) {
        console.log("retrieved messages");
        const data = await response.json();
        setMsgList(data);
        // if (data.some(msg => msg.to === auth.name && msg.messageType === 'new_dm' && !msg.read_by_to)) {
        //   setShowButtons(true);
        // }
      } else {
        console.log("response was not ok");
          
      }});
    } catch (error) {
      console.log("error here>0");
    }
  };

  const sendMessage = async () => {
    if(selectedUser === "") {
      return;
    }

    if(txtMsg.trim() ==="") {
      return;
    }

    const newMsg = {
      to: selectedUser,
      from: currentUser,
      timestamp: new Date().toLocaleString(),
      message: txtMsg
    };

    try {
      await fetch('http://localhost:3001/send-message', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify(newMsg)
      }).then(async (response) => {
        if (response.ok) {
          setTxtMsg('');
          getMessages();
          console.log("Message sent!");
        } else {
        
            
        }
      })

    } catch (error) {
  
    }
  }

  const markCurrMessagesAsRead = async () => {
    if(selectedUser === "") {
      return;
    }

    // Checking if messages are already read
    const numUnread = msgList.filter((msg) => (msg.to == auth.name && msg.from == selectedUser && msg.read_by_to == false)).length;
    if(numUnread === 0)
    {
      return;
    }
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

  // Function to delete conversation
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

  // Function to delete a specific message
  const deleteMessage = async (msg) => {
    if (selectedUser === "") return;

    if(msg == {}) {
      console.log("no message to be deleted");
      return;
    }

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

  // Function to check matched users
  const checkMatched = async() => {
    const currUserId = auth.id;

    try {
      for (const user of userList) {
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
      };
    } catch (error) {
      console.log("error here>", error);
    }
  };

  // Function to get the number of unread DMs for a user
  const getNumberOfUnreadDms = (user) => {
    return msgList.filter((msg) => (msg.to === auth.name && msg.from === user.anon_username && msg.read_by_to === false)).length;
  };

  // Function to get the latest DM for a user
  const getLatestDm = (user) => {
    return msgList.filter((msg) => ((msg.to === auth.name && msg.from === user.anon_username) ||
      (msg.to === user.anon_username && msg.from === auth.name)))[0];
  };

  const scrollToBottom = () => {
    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
  };

  // Component to render each message

  // Key listeners
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  const messageComponent = (msg, index) => {
    
    let messageContent;
    try {
        messageContent = JSON.parse(msg.message);
    } catch (e) {
        messageContent = { text: msg.message };
    }
    const { resumeUrl, resumeId, commenter, text: messageText } = messageContent;

    const viewCommentsLink = resumeId && commenter 
        ? `/view-resume-comments/${resumeId}/${commenter}` 
        : null;

    if (msg.from !== auth.name) {
        if (msg.read_by_to === false && msg.to === auth.name) {
            return (
                <div key={msg._id} className="message-outer-single-block">
                  {resumeUrl && (
                    <div className="message-single-block resume-message" onMouseOver={() => setMsgHovered(msg._id)} onMouseOut={() => setMsgHovered('')}>
                        <div className="resume-block">
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                                <Viewer fileUrl={resumeUrl} defaultScale={SpecialZoomLevel.PageWidth} />
                            </Worker>
                        </div>
                        </div>
                    )}
                    <div className="message-single-block-unread"  onMouseOver={() => setMsgHovered(msg._id)} onMouseOut={() => setMsgHovered('')}>
                        {viewCommentsLink ? (
                            <a href={viewCommentsLink}>{messageText}</a>
                        ) : (
                            messageText
                        )}
                    </div>
                    {msgHovered === msg._id && <div className="message-timestamp-block-unread">{msg.timestamp}</div>}
                </div>
            );
        }
        if(msg.deleted_by_from === true)
          {
            return (
              <div key={msg._id} className="message-outer-single-block">
                <div className="message-single-block-deleted" onMouseOver={() => setMsgHovered(msg._id)} onMouseOut={() => setMsgHovered('')}><i>{msg.message}</i></div>
                {msgHovered === msg._id && <div className="message-timestamp-block">{msg.timestamp}</div>}
              </div>)
          }
        return (
            <div key={msg._id} className="message-outer-single-block">
              {resumeUrl && (
                 <div className="message-single-block resume-message" onMouseOver={() => setMsgHovered(msg._id)} onMouseOut={() => setMsgHovered('')}>
                    <div className="resume-block">
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                            <Viewer fileUrl={resumeUrl} defaultScale={SpecialZoomLevel.PageWidth} />
                        </Worker>
                    </div>
                    </div>
                )}
                <div className="message-single-block" onMouseOver={() => setMsgHovered(msg._id)} onMouseOut={() => setMsgHovered('')}>
                {viewCommentsLink ? (
                            <a href={viewCommentsLink}>{messageText}</a>
                        ) : (
                            messageText
                        )}
                </div>
                {msgHovered === msg._id && <div className="message-timestamp-block">{msg.timestamp}</div>}
            </div>
        );
    }
    if(msg.deleted_by_from === true)
      {
        return (
          <div key={msg._id} className="message-outer-single-block">
            <div className="message-single-block-self-deleted" onMouseOver={() => setMsgHovered(msg._id)} onMouseOut={() => setMsgHovered('')}><i>{msg.message}</i></div>
            {msgHovered === msg._id && <div className="message-timestamp-block-self">{msg.timestamp}</div>}
          </div>)
      }
    return (
        <div key={msg._id} className="message-outer-single-block">
          {resumeUrl && (
            <div className="message-single-block-self resume-message" onMouseOver={() => setMsgHovered(msg._id)} onMouseOut={() => setMsgHovered('')}>
                <div className="resume-block">
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                        <Viewer fileUrl={resumeUrl} defaultScale={SpecialZoomLevel.PageWidth} />
                    </Worker>
                </div>
              </div>
            )}
            {msgHovered === msg._id &&
          <div onMouseOver={() => setMsgHovered(msg._id)} onMouseOut={() => setMsgHovered('')} className='dm-msgactions-icons'>

            {/* <img className='dm-msgactions-size' src={editIcon} alt="Edit Message Icon" /> */}
            <img className='dm-msgactions-size' src={deleteIcon} onClick={() => {
              setMsgToBeDeleted(msg);
              toggleDelMsgModal();
            }} alt="Delete Message Icon" />
          </div>
        }
            <div className="message-single-block-self" onMouseOver={() => setMsgHovered(msg._id)} onMouseOut={() => setMsgHovered('')}>
                {viewCommentsLink ? (
                      <a href={viewCommentsLink}>{messageText}</a>
                  ) : (
                      messageText
                  )}
            </div>
            {msgHovered === msg._id && <div className="message-timestamp-block-self">{msg.timestamp}</div>}
        </div>
    );
}

  const userComponent = (user) => {
    const latestDm = getLatestDm(user);
    const numUnreadDms = getNumberOfUnreadDms(user);
    let latestMessage;
    let latestTimestamp;
    let outerBlockClass = 'individual-user-block';

    const profilePicColour = matchedListProfileColourDict[user.anon_username];

    if (latestDm) {
      latestMessage = latestDm.message.length >= 30 ? latestDm.message.slice(0, 30) + "..." : latestDm.message;
      latestTimestamp = latestDm.timestamp.slice(0, latestDm.timestamp.length - 9) +
        latestDm.timestamp.slice(latestDm.timestamp.length - 2, latestDm.timestamp.length);
    } else {
      latestMessage = "";
      latestTimestamp = "";
    }


    if (user.anon_username === selectedUser)
    {
      outerBlockClass = 'individual-user-block-selected';
    }

    return (<div onClick={() => 
      { 
        markCurrMessagesAsRead();
        setTxtMsg('');
        setSelectedUser(user.anon_username);
        setSelectedUserProfilePic(user.avatar);
        setMoreModalShow(false);
        checkBlockedUsers(auth.name, user.anon_username); // Check blocked status when user is selected
      }}>
      <div className={outerBlockClass}>
        <div className="circle" style={{ backgroundColor : profilePicColour }}>
          {profilePicDisplay(user.avatar)}
        </div>
        <div className='individual-user-block-name'>
          {user.anon_username}
        </div>
        {numUnreadDms > 0 &&
          <div className='individual-user-block-unread-dm'>
          {numUnreadDms}
          </div>
        }
        <div className='individual-user-block-latest-msg'>
          {latestMessage}
        </div>
        <div className='individual-user-block-latest-timestamp'>
          {latestTimestamp}
        </div>
      </div>
    </div>)
  };


  // Delete Conversations Modal Component
  const deleteConversationModal = () => {
    return (
      <div className="modal-overlay-delete" onClick={toggleDelConvModal}>
        <div className="modal-content-delete">
            <h2 className="modal-header-delete"> Are you sure you want to delete this conversation?</h2>
            <p> The recepient will be able to see that you have deleted your messages <br /> You can’t undo this action.</p>
            <div className="modal-buttons-delete">
                <button className="cancel-button-delete modal-button-delete" onClick={toggleDelConvModal}>Cancel</button>
                <button className="delete-button-delete modal-button-delete" onClick={deleteConversation}>Delete</button>
            </div>
        </div>
      </div>
    );
  }

   // Delete Conversations Modal Component
   const deleteMsgModal = () => {
    console.log(msgToBeDeleted);
    return (
      <div className="modal-overlay-delete" onClick={toggleDelMsgModal}>
        <div className="modal-content-delete">
            <h2 className="modal-header-delete"> Are you sure you want to delete this message?</h2>
            <p> The recepient will be able to see that you have deleted your messages <br /> You can’t undo this action.</p>
            <div className="modal-buttons-delete">
                <button className="cancel-button-delete modal-button-delete" onClick={toggleDelMsgModal}>Cancel</button>
                <button className="delete-button-delete modal-button-delete" onClick={() => {deleteMessage(msgToBeDeleted)}}>Delete</button>
            </div>
        </div>
      </div>
    );
  }

  const profilePicDisplay = (avatar) => {
    return (
      <div>
        <img
            src={profilePicDictionary[avatar]}
            style={{ margin: '5px', width: '26px', height: '26px'}}
          />
      </div>
    );
  }

  return (
    <div className="container">
     <div className="app-logo-container"> 
        <a href="/">
          <img src={logo} className="logo" alt="LinkUp Logo" />
        </a> 
      </div>
      <Sidebar/>
      <div className="messages-window-block">
        <div className="my-conversations-header-block">
          <img className="my-conversations-header-icon" src={messageIcon} alt="sendIcon" />
          <div className="my-conversations-header-title">
            My Conversations
          </div>
        </div>
        <div className="current-selected-user-info-block">
          {selectedUser !== "" &&
            <div className="current-select-user-info-block-name-circle" style={{ backgroundColor: bgColour}}>
              {profilePicDisplay(selectedUserProfilePic)}
            </div>}
          <div className="current-select-user-info-block-name">{selectedUser}</div>
          {selectedUser !== "" &&
            <div className="dm-more-button-block" onClick={() => setMoreModalShow(!moreModalShow)}>
              <img src={moreIcon} alt="More modal icon" />
            </div>}
          {moreModalShow &&
            <div className="dm-more-modal">
              <div onClick={() => 
                {toggleDelConvModal(); 
                 setMoreModalShow(!moreModalShow)
                }} className='dm-more-modal-block-individualblock'>
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
          <button onClick={() => { sendMessage(); markCurrMessagesAsRead() }} className='textbox-msg-sendbutton' disabled={isBlocked}>
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
      {delConvModalOpen && (
                <div>
                  {deleteConversationModal()}
                </div>)}
      {delMsgModalOpen && (
                <div>
                  {deleteMsgModal()}
                </div>)}
    </div>
  );
}

export default App;
