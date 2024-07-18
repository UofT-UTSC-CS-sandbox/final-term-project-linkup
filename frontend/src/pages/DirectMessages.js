import React, { useEffect, useState, useRef, useReducer } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cloneDeep } from 'lodash';
import axios from "axios";

// Styling
import './DirectMessages.css';
import sendIcon from '../images/Iconsax (1).png';
import messageIcon from '../images/message-square.svg';
import logo from '../images/linkup_logo_highquality.png';
import Sidebar from '../components/Sidebar.js'
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

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
  
  const [currTimeStampShow, setCurrTimeStampShow] = useState('');
  
  const [existMoreToLoad, setExistsMoreToLoad] = useState(true);
  const [showButtons, setShowButtons] = useState(false);
  const [dmAccepted, setDmAccepted] = useState(null);

  const messagesEndRef = useRef(null);

  // Authentication and navigation
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser();

  const _ = require('lodash');

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
    //fetchDmStatus(selectedUser); 
    fetchDmStatus(selectedUser);
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
  },[]);

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



  // Components
  // const messageComponent = (msg, index) => {
  //   const isNewConversation = msg.message.includes('left comments on your resume') && !msg.read_by_to && dmAccepted === null;
  //   if(msg.from !== auth.name) {
  //     if (msg.read_by_to == false && msg.to == auth.name) {
  //       return (
  //         <div key={msg._id} className="message-outer-single-block">
  //           <div className="message-single-block-unread" onMouseOver={() => setCurrTimeStampShow(msg._id)} onMouseOut={() => setCurrTimeStampShow('')}>{msg.message}
  //           {isNewConversation && (
  //                       <div className="swipe-action-buttons">
  //                           <button onClick={handleAccept}>Accept</button>
  //                           <button onClick={handleDecline}>Decline</button>
  //                       </div>
  //                   )}
  //           </div>
  //           {currTimeStampShow === msg._id && <div className="message-timestamp-block-unread">{msg.timestamp}</div>}
  //         </div>)
  //     }
  //     return (
  //     <div key={msg._id} className="message-outer-single-block">
  //       <div className="message-single-block" onMouseOver={() => setCurrTimeStampShow(msg._id)} onMouseOut={() => setCurrTimeStampShow('')}>{msg.message}</div>
  //       {currTimeStampShow === msg._id && <div className="message-timestamp-block">{msg.timestamp}</div>}
  //     </div>)
  //   }
  //   return (
  //     <div key={msg._id} className="message-outer-single-block">
  //       <div className="message-single-block-self" onMouseOver={() => setCurrTimeStampShow(msg._id)} onMouseOut={() => setCurrTimeStampShow('')}>{msg.message}</div>
  //       {currTimeStampShow === msg._id && <div className="message-timestamp-block-self">{msg.timestamp}</div>}
  //     </div>)
  // }

  const messageComponent = (msg, index) => {
    
    let messageContent;
    try {
        messageContent = JSON.parse(msg.message);
    } catch (e) {
        messageContent = { text: msg.message };
    }
    const { resumeUrl, resumeId, commenter, text: messageText } = messageContent;
    // const resumeUrl = messageContent.resumeUrl;
    // const messageText = messageContent.text;

    const isNewConversation = messageText && messageText.includes('left comments on your resume') && dmAccepted === null;

    const viewCommentsLink = resumeId && commenter 
        ? `/view-resume-comments/${resumeId}/${commenter}` 
        : null;

    if (msg.from !== auth.name) {
        if (msg.read_by_to === false && msg.to === auth.name) {
            return (
                <div key={msg._id} className="message-outer-single-block">
                  {resumeUrl && (
                    <div className="message-single-block resume-message" onMouseOver={() => setCurrTimeStampShow(msg._id)} onMouseOut={() => setCurrTimeStampShow('')}>
                        <div className="resume-block">
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                                <Viewer fileUrl={resumeUrl} defaultScale={SpecialZoomLevel.PageWidth} />
                            </Worker>
                        </div>
                        </div>
                    )}
                    <div className="message-single-block-unread"  onMouseOver={() => setCurrTimeStampShow(msg._id)} onMouseOut={() => setCurrTimeStampShow('')}>
                        {viewCommentsLink ? (
                            <a href={viewCommentsLink}>{messageText}</a>
                        ) : (
                            messageText
                        )}
                        {isNewConversation && showButtons && (
                <div className="swipe-action-buttons">
                  <button onClick={handleAccept}>Accept</button>
                  <button onClick={handleDecline}>Decline</button>
                </div>
              )}
                    </div>
                    {currTimeStampShow === msg._id && <div className="message-timestamp-block-unread">{msg.timestamp}</div>}
                </div>
            );
        }
        return (
            <div key={msg._id} className="message-outer-single-block">
              {resumeUrl && (
                 <div className="message-single-block resume-message" onMouseOver={() => setCurrTimeStampShow(msg._id)} onMouseOut={() => setCurrTimeStampShow('')}>
                    <div className="resume-block">
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                            <Viewer fileUrl={resumeUrl} defaultScale={SpecialZoomLevel.PageWidth} />
                        </Worker>
                    </div>
                    </div>
                )}
                <div className="message-single-block" onMouseOver={() => setCurrTimeStampShow(msg._id)} onMouseOut={() => setCurrTimeStampShow('')}>
                {viewCommentsLink ? (
                            <a href={viewCommentsLink}>{messageText}</a>
                        ) : (
                            messageText
                        )}
                </div>
                {currTimeStampShow === msg._id && <div className="message-timestamp-block">{msg.timestamp}</div>}
            </div>
        );
    }
    return (
        <div key={msg._id} className="message-outer-single-block">
          {resumeUrl && (
            <div className="message-single-block-self resume-message" onMouseOver={() => setCurrTimeStampShow(msg._id)} onMouseOut={() => setCurrTimeStampShow('')}>
                <div className="resume-block">
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                        <Viewer fileUrl={resumeUrl} defaultScale={SpecialZoomLevel.PageWidth} />
                    </Worker>
                </div>
              </div>
            )}
            <div className="message-single-block-self" onMouseOver={() => setCurrTimeStampShow(msg._id)} onMouseOut={() => setCurrTimeStampShow('')}>
                {viewCommentsLink ? (
                      <a href={viewCommentsLink}>{messageText}</a>
                  ) : (
                      messageText
                  )}
            </div>
            {currTimeStampShow === msg._id && <div className="message-timestamp-block-self">{msg.timestamp}</div>}
        </div>
    );
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



  // const checkDmStatus = async (otherUser) => {
  //   const currUser = auth.name; // Use anon_username

  //   try {
  //     const response = await axios.get('http://localhost:3001/api/dm-status', {
  //       params: { to: currUser, from: otherUser }
  //     });

  //     if (response.data.isNewConversation) {
  //       setShowButtons(true);
  //     } else {
  //       setDmAccepted(response.data.accepted);
  //       setShowButtons(false);
  //     }
  //   } catch (error) {
  //     console.error('Error checking DM status:', error);
  //   }
  // };

  const fetchDmStatus = async (otherUser) => {
    const currUser = auth.name; // Use anon_username

    try {
      const response = await axios.get('http://localhost:3001/api/dm-status', {
        params: { to: currUser, from: otherUser }
      });

      if (response.data.isNewConversation) {
        setShowButtons(true);
        setDmAccepted(null);
      } else {
        setDmAccepted(response.data.accepted);
        setShowButtons(false);
      }
    } catch (error) {
      console.error('Error checking DM status:', error);
    }
  };

  const handleAccept = async () => {
    await updateDmStatus(true);
    setShowButtons(false);
    setDmAccepted(true);
  };

  const handleDecline = async () => {
    await updateDmStatus(false);
    setShowButtons(false);
    setDmAccepted(false);
  };

  const updateDmStatus = async (accepted) => {
    const currUser = auth.name; // Use anon_username
    const otherUser = userList.find(user => user.anon_username === selectedUser).anon_username;

    try {
      await axios.post('http://localhost:3001/api/dm-status/update', {
        to: currUser,
        from: otherUser,
        accepted
      });

      setMsgList(prev => prev.map(msg => {
        if (msg.to === currUser && msg.from === otherUser) {
          return { ...msg, accepted };
        }
        return msg;
      }));
    } catch (error) {
      console.error('Error updating DM status:', error);
    }
  };



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
          <div className="current-select-user-info-block-name-circle">

          </div>
          <div className="current-select-user-info-block-name">
            {selectedUser}
          </div>
        </div>
        <div className="direct-messages-block" ref={messagesEndRef}>
          {existMoreToLoad && <button onClick={() => setMsgLimit(msgLimit + 10)} className="loadmore-messages-button"> Load More </button>}
          {msgList.filter((msg) => (msg.to == auth.name && msg.from == selectedUser) || 
                                    (msg.to == selectedUser && msg.from == auth.name))
                  .map((msg, index) => messageComponent(msg, index))
                  .slice(0, msgLimit)
                  .reverse()}
        </div>

        {showButtons && (
              <div className="swipe-action-buttons-container">
                <button onClick={handleAccept}>Accept</button>
                <button onClick={handleDecline}>Decline</button>
              </div>
            )}
        <div className="textbox-msg-block">
          <button onClick={() => {sendMessage();
                                  markCurrMessagesAsRead()}} className='textbox-msg-sendbutton' disabled={dmAccepted === false || dmAccepted === null }>
            <img className="send-msg-icon" src={sendIcon} alt="sendIcon" />
          </button> 
          <input 
            type="text" 
            value={txtMsg} 
            onChange={handleTxtChange} 
            placeholder={"   Type a message"}
            className="textbox-msg-textbox"
            disabled={dmAccepted === false || dmAccepted === null}
          />
        </div>
        <div className="select-user-block">
          {matchedList.map((user) => (userComponent(user)))}
        </div>
      </div>
    </div>
  );
}

export default App;