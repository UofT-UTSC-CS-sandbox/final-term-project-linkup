import React, { useEffect, useState, useRef, useReducer } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cloneDeep } from 'lodash';

// Styling
import './DirectMessages.css';

// Routing and authentication
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'; 

function App() {
  const [txtMsg, setTxtMsg] = useState('');

  const [userList, setUserList] = useState([]);

  const [msgList, setMsgList] = useState([]);
  const [msgLimit, setMsgLimit] = useState(10);
  const [selectedUser, setSelectedUser] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  
  const [existMoreToLoad, setExistsMoreToLoad] = useState(true);

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
  }, [selectedUser]);

  useEffect(() => {
    checkMoreToLoad();
  }, [msgLimit])

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
    // userList.forEach((user) => getNumberOfUnreadDms(user));
  }, [userList])

  useEffect(() => {
    scrollToBottom();
    checkMoreToLoad();
    console.log(msgList);
  }, [msgList])

  // Listening for new messages
  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3001/sse');

    eventSource.onmessage = async (event) => {
        const newMessage = await JSON.parse(event.data);
        if(newMessage.to === auth.name) {
          // userList.forEach((user) => getNumberOfUnreadDms(user));
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
            setUserList([]);
            setUserList(data);
            setSelectedUser(data[0].anon_username);
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

  // Communicating Email and password to server
  const getNumberOfUnreadDms = (user) => {
    return msgList.filter((msg) => (msg.to == auth.name && msg.from == user.anon_username && msg.read_by_to == false)).length;
  };

  const scrollToBottom = () => {
    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
  };

  const messageComponent = (msg, index) => {
    if (msg.read_by_to == false && msg.to == auth.name) {
      return (<div key={index} style={{ color: "red" }}>
        To: {msg.to} From: {msg.from} {msg.timestamp} <br></br>
        {msg.message}
      </div>)
    }
    return (<div key={msg._id}>
      To: {msg.to} From: {msg.from} {msg.timestamp} <br></br>
      {msg.message}
    </div>)
  }

  return (
    <div className="App-header">
      <div className="direct-messages-block" ref={messagesEndRef}>
        {existMoreToLoad && <button onClick={() => setMsgLimit(msgLimit + 10)}> Load More </button>}
        {msgList.filter((msg) => (msg.to == auth.name && msg.from == selectedUser) || 
                                  (msg.to == selectedUser && msg.from == auth.name))
                .map((msg, index) => messageComponent(msg, index))
                .slice(0, msgLimit)
                .reverse()}
      </div>
      <div className="textbox-msg-block">
        <input 
          type="text" 
          value={txtMsg} 
          onChange={handleTxtChange} 
          placeholder={msgLimit}
        />
        <button onClick={() => sendMessage()}>Send</button>
      </div>
      <div className="select-user-block">
        {userList.map((user) => (
          <div onClick={() => 
            { 
              markCurrMessagesAsRead();
              console.log(selectedUser);
              setSelectedUser(user.anon_username);
            }} style={{ cursor: 'pointer' }}>
            {user.anon_username} + ({getNumberOfUnreadDms(user)})
          </div>
        ))}
      </div>
      {/* <label style={{ color: 'red' }}> 
        {selectedUser}
      </label>
      <br></br>
      <label style={{ color: 'green' }}> 
        {currentUser}
      </label>
      <br></br>
      <label style={{ color: 'blue' }}> 
        {currentTime}
      </label> */}
    </div>
  );
}

export default App;