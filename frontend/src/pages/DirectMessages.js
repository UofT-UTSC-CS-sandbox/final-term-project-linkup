import React, { useEffect, useState, useRef } from 'react';

import { useNavigate } from 'react-router-dom';

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
  
  const [loadingMore, setLoadingMore] = useState(false);
  const [existMoreToLoad, setExistsMoreToLoad] = useState(true);

  const currentTime = new Date().toLocaleString();
  const messagesEndRef = useRef(null);

  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser();

  // Websocket
  const ws = useRef(null);

  // const prevListRef = useRef();

  // useEffect(() => {
  //   if (prevListRef.current) {
  //     const prevList = prevListRef.current;
  //     const hasChanged = JSON.stringify(prevList) !== JSON.stringify(msgList);
  //     if (hasChanged) {
  //       console.log('The list has changed.');
  //       setExistsMoreToLoad(true);
  //     } else {
  //       console.log('The list has not changed.');
  //       setExistsMoreToLoad(false);
  //     }
  //   }

  //   // Update the ref to the current list for the next render
  //   prevListRef.current = msgList;
  // }, [msgList]);

  // Redirect user to login page if not authenticated
  useEffect(() => {
    if(!isAuthenticated) {
      navigate('/login-page');
    }
    else
    {
      setCurrentUser(auth.name);
      getUsers();
    }
  }, []);

  // Updates messages immediately after detecting a change in the selected user
  useEffect(() => {
    if (selectedUser) {
      setMsgLimit(10);
      getMessages();
      setLoadingMore(false);
    }
  }, [selectedUser]);

  useEffect(() => {
    getMessages();
    setLoadingMore(true);
  }, [msgLimit]);

  useEffect(() => {
    if(!loadingMore) { 
      scrollToBottom();
    }

    if(msgList.length < msgLimit)
    {
      setExistsMoreToLoad(false); 
    }
    else if (msgList.length >= msgLimit)
    {
      setExistsMoreToLoad(true);
    }
  }, [msgList]);

  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:3001');
    
    ws.current.onopen = () => {
      console.log('WebSocket connection established');
    };

    ws.current.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      console.log("new message received : " + newMessage)
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const handleTxtChange = (event) => {
    setTxtMsg(event.target.value);
  };

  // Communicating Email and password to server
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
            setSelectedUser(data[0].anon_username);
        } else {
          console.log("response was not ok");
            
        }
    } catch (error) {
      console.log("error here>");
    }
  };

  // Communicating Email and password to server
  const getMessages = async () => {
    try {
      const parties = {
        to: selectedUser,
        from: currentUser,
        limit: msgLimit
      };

      const response = await fetch('http://localhost:3001/get-messages', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(parties)
      });

      if (response.ok) {
          
        const data = await response.json();
        setMsgList(data);
        
      } else {
        console.log("response was not ok");
          
      }
    } catch (error) {
      console.log("error here>0");
    }
  };

  const sendMessage = async () => {
    const newMsg = {
      to: selectedUser,
      from: currentUser,
      timestamp: currentTime,
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
      } else {
      
          
      }
    } catch (error) {
  
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
  };

  return (
    <div className="App-header">
      <div className="direct-messages-block" ref={messagesEndRef}>
        {existMoreToLoad && <button onClick={() => setMsgLimit(msgLimit + 10)}> Load More </button>}
        {msgList.slice().reverse().map((msg) => (
          <div>
            To: {msg.to} From: {msg.from} {msg.timestamp} <br></br>
            {msg.message}
          </div>
        ))}
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
          <div onClick={() => setSelectedUser(user.anon_username)} style={{ cursor: 'pointer' }}>
            {user.anon_username}
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