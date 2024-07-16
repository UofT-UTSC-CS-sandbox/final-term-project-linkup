import React, { useEffect, useState, useRef, useReducer } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import axios from "axios";

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
import editIcon from '../images/edit.svg';
import logo from '../images/linkup_logo_highquality.png';
import Sidebar from '../components/Sidebar.js';

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

  const messagesEndRef = useRef(null);

  // Delete Conversation Modal
  const [delConvModalOpen, setDelConvModalOpen] = useState(false);
  const toggleDelConvModal = () => {
    setDelConvModalOpen(!delConvModalOpen);
  };

  // Authentication and navigation
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser();

  // Redirect user to login page if not authenticated
  useEffect(() => {
    if(!isAuthenticated) {
      navigate('/login-page');
    }
    else
    {
      setCurrentUser(auth.name);
      getUsers();
      getMessages();
    }
  }, []);

  // Updates messages immediately after detecting a change in the selected user
  useEffect(() => {
    setMsgLimit(10);
    checkMoreToLoad();
    scrollToBottom();
  }, [selectedUser]);

  useEffect(() => {
    checkMoreToLoad();
  }, [msgLimit])

  useEffect(() => {
    if(userList.length > 0){
      checkMatched();
    }
  }, [userList])

  const checkMoreToLoad = () => {
    var filteredListLen = msgList.filter((msg) => (msg.to == auth.name && msg.from == selectedUser) || 
                                          (msg.to == selectedUser && msg.from == auth.name)).length;

    if(filteredListLen <= msgLimit)
    {
      setExistsMoreToLoad(false); 
    }
    else if (filteredListLen > msgLimit)
    {
      setExistsMoreToLoad(true);
    }
  }

  useEffect(() => {
    scrollToBottom();
    checkMoreToLoad();
  }, [msgList])

  // Listening for new messages
  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3001/sse');

    eventSource.onmessage = async (event) => {
        const newMessage = await JSON.parse(event.data);
        if(newMessage.to === auth.name) {
          getMessages();
        }
    };

    return () => {
        eventSource.close();
    };
  });

  // Checking if the user has left the page
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (selectedUser) {
        markCurrMessagesAsRead();
      }
    };
  
    // Add event listener for beforeunload
    window.addEventListener('beforeunload', handleBeforeUnload);
  
    // Clean up event listener on component unmount
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

    // Validation
    if(txtMsg === "") {
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
      await fetch('http://localhost:3001/mark-messages-as-read', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify(parties)
      }).then((response) => {
        if (response.ok) {
          console.log("messages from another user read");
          getMessages();
        
        } else {
          console.log("messages from another user read but didnt return anything?");
        }});
    } catch (error) {
  
    }
  }

  const deleteConversation = async () => {
    if(selectedUser === "") {
      return;
    }

    const parties = {
      me: currentUser,
      other: selectedUser
    };

    try {
      await fetch('http://localhost:3001/delete-conversation', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify(parties)
      }).then(async (response) => {
        if (response.ok) {
          getMessages();
        } else {
          
        }
      })

    } catch (error) {
  
    }
  }

  const deleteMessage = async (msg) => {
    if(selectedUser === "") {
      return;
    }

    try {
      await fetch('http://localhost:3001/delete-message', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify({msgId: msg._id})
      }).then(async (response) => {
        if (response.ok) {
          getMessages();
        } else {
          
        }
      })

    } catch (error) {
  
    }
  }

  const checkMatched = () => {
    const currUserId = auth.id;
    console.log(currUserId);

    try {
      userList.forEach(async (user) => {
        const otherUserId = user._id;
        console.log("trying to match " + user._id);

        if (otherUserId !== currUserId) {
          try {
            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            await axios.post(`http://localhost:3001/api/match/${currUserId}`, {
                currId: currUserId,
                otherId: otherUserId
            }, axiosConfig).then((response) => {
              const hasMatch = response.data.hasMatch;
              
              if (hasMatch) {
                setMatchedList((prevList) => {
                  const ids = prevList.map(someOtherUser => someOtherUser._id === user._id)
                                      .filter(mapping => mapping === true).length;
                  if(!ids){
                    return [...prevList, user]
                  }
                  return prevList});
              }});
          } catch (error) {
              console.error('Failed to check for matches', error);
          }
        }
      });
  }
  catch
  {

  }
};

  const getNumberOfUnreadDms = (user) => {
    return msgList.filter((msg) => (msg.to == auth.name && msg.from == user.anon_username && msg.read_by_to == false)).length;
  };

  const getLatestDm = (user) => {
    return msgList.filter((msg) => ((msg.to == auth.name && msg.from == user.anon_username) || 
                                    (msg.to == user.anon_username && msg.from == auth.name)))[0];
  }

  const scrollToBottom = () => {
    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
  };

  // Key listeners
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendMessage();
    }
  };

  // Components
  const messageComponent = (msg, index) => {
    if(msg.from !== auth.name) {
      if (msg.read_by_to == false && msg.to == auth.name) {
        return (
          <div key={msg._id} className="message-outer-single-block">
            <div className="message-single-block-unread" onMouseOver={() => setMsgHovered(msg._id)} onMouseOut={() => setMsgHovered('')}>{msg.message}</div>
            {msgHovered === msg._id && <div className="message-timestamp-block-unread">{msg.timestamp}</div>}
          </div>)
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
        <div className="message-single-block" onMouseOver={() => setMsgHovered(msg._id)} onMouseOut={() => setMsgHovered('')}>{msg.message}</div>
        {msgHovered === msg._id && <div className="message-timestamp-block">{msg.timestamp}</div>}
      </div>)
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
        {msgHovered === msg._id &&
          <div onMouseOver={() => setMsgHovered(msg._id)} onMouseOut={() => setMsgHovered('')} className='dm-msgactions-icons'>
            {/* <img className='dm-msgactions-size' src={editIcon} alt="Edit Message Icon" /> */}
            <img className='dm-msgactions-size' src={deleteIcon} onClick={() => {deleteMessage(msg)}} alt="Delete Message Icon" />
          </div>
        }
        <div className="message-single-block-self" onMouseOver={() => setMsgHovered(msg._id)} onMouseOut={() => setMsgHovered('')}>{msg.message}</div>
        {msgHovered === msg._id && <div className="message-timestamp-block-self">{msg.timestamp}</div>}
      </div>)
  }

  const userComponent = (user) => {
    const latestDm = getLatestDm(user);
    const numUnreadDms = getNumberOfUnreadDms(user);
    var latestMessage;
    var latestTimestamp;
    var outerBlockClass = 'individual-user-block';

    if (latestDm != undefined){
      if(latestDm.message.length >= 30) {
        latestMessage = latestDm.message.slice(0,30) + "...";
      }
      else if (latestDm.message.length < 30) {
        latestMessage = latestDm.message;
      }

      latestTimestamp = latestDm.timestamp.slice(0, latestDm.timestamp.length - 9) + 
                        latestDm.timestamp.slice(latestDm.timestamp.length - 2, latestDm.timestamp.length);
    }
    else if (latestDm === undefined)
    {
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
        console.log(selectedUser);
        setSelectedUser(user.anon_username);
        setMoreModalShow(false);
      }}>
      <div className={outerBlockClass}>
        <div className="circle">

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
  }

  // Delete Conversations Modal Component
  const deleteConversationModal = () => {
    console.log(delConvModalOpen);
    return (
      <div>
        <div onClick={toggleDelConvModal} className='overlay'></div>
        <div className="modal-content">
          <h4>Are you sure you want to delete the conversation?</h4>
          <p>
              NOTE: Only your messages will be deleted
              NOTE: The other user can see that you have deleted the message
          </p>
          <button onClick={() => {
              deleteConversation();
              toggleDelConvModal()}}>
              yes
          </button>
          <button onClick={toggleDelConvModal}>
              no
          </button>
        </div>
      </div>
    );
  }

   // Delete Conversations Modal Component
   const deleteMessageModal = (msg) => {
    console.log(delConvModalOpen);
    return (
      <div>
        <div onClick={toggleDelConvModal} className='overlay'></div>
        <div className="modal-content">
          <h4>Are you sure you want to delete this message?</h4>
          <p>
              NOTE: The other user can see that you have deleted the message
          </p>
          <button onClick={() => {
              deleteMessage(msg);
              toggleDelConvModal()}}>
              yes
          </button>
          <button onClick={toggleDelConvModal}>
              no
          </button>
        </div>
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
            <div className="current-select-user-info-block-name-circle"></div>
          }
          <div className="current-select-user-info-block-name">
            {selectedUser}
          </div>
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
              <div className='dm-more-modal-block-individualblock'>
                <img className='dm-more-modal-iconsize' src={slashIcon} alt="Slash Message Icon" />
                Block User
              </div>
            </div>}
        </div>
        <div className="direct-messages-block" ref={messagesEndRef}>
          {existMoreToLoad && <button onClick={() => setMsgLimit(msgLimit + 10)} className="loadmore-messages-button"> Load More </button>}
          {msgList.filter((msg) => (msg.to == auth.name && msg.from == selectedUser) || 
                                    (msg.to == selectedUser && msg.from == auth.name))
                  .map((msg, index) => messageComponent(msg, index))
                  .slice(0, msgLimit)
                  .reverse()}
        </div>
        <div className="textbox-msg-block">
          <button onClick={() => {sendMessage();
                                  markCurrMessagesAsRead()}} className='textbox-msg-sendbutton'>
            <img className="send-msg-icon" src={sendIcon} alt="sendIcon" />
          </button> 
          <input 
            type="text" 
            value={txtMsg} 
            onChange={handleTxtChange} 
            onKeyDown={handleKeyDown}
            placeholder={"   Type a message"}
            className="textbox-msg-textbox"
          />
        </div>
        <div className="select-user-block">
          {matchedList.map((user) => (userComponent(user)))}
        </div>
      </div>
      {delConvModalOpen && (
                <div>
                  {deleteConversationModal()}
                </div>)}
    </div>
  );
}

export default App;