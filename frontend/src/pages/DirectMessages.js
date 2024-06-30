import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Styling
import './DirectMessages.css';

// Routing and authentication
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'; 

function App() {
  const [txtMsg, setTxtMsg] = useState('');

  const [userList, setUserList] = useState([]);
  const [userListUnreadNum, setUserListUnreadNum] = useState([]);

  const [msgList, setMsgList] = useState([]);
  const [msgLimit, setMsgLimit] = useState(10);
  const [selectedUser, setSelectedUser] = useState('');
  const [currentUser, setCurrentUser] = useState('');
  
  const [loadingMore, setLoadingMore] = useState(false);
  const [existMoreToLoad, setExistsMoreToLoad] = useState(true);

  const messagesEndRef = useRef(null);

  // Authentication and navigation
  const location = useLocation();
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
    userList.forEach((user) => getNumberOfUnreadDms(user));
  }, [userList])

  // Listening for new messages
  useEffect(() => {
    const eventSource = new EventSource('http://localhost:3001/sse');

    eventSource.onmessage = (event) => {
        const newMessage = JSON.parse(event.data);
        if(newMessage.to === auth.name) {
          userList.forEach((user) => getNumberOfUnreadDms(user));
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
        const response = await fetch('http://localhost:3001/get-user', {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const data = await response.json();
            
            // Setting user list
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
      } else {
      
          
      }
    } catch (error) {
  
    }
  }

  const markCurrMessagesAsRead = async () => {
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
      } else {
      
          
      }
    } catch (error) {
  
    }
  }

  // Communicating Email and password to server
  const getNumberOfUnreadDms = async (user) => {
    const parties = {
      to: currentUser,
      from: user.anon_username
    };
    
    try {
      const response = await fetch('http://localhost:3001/get-number-of-unread-dms', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(parties)
      });

      if (response.ok) {
        const data = await response.json();

        setUserListUnreadNum(prevState => [...prevState, { from: user.anon_username, number: data.number }]);
      } else {
        console.log("response was not ok");
          
      }
    } catch (error) {
      console.log("error here>0");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
  };

  const messageComponent = (msg) => {
    if (msg.read_by_to == false && msg.to == auth.name) {
      return (<div style={{ color: "red" }}>
        To: {msg.to} From: {msg.from} {msg.timestamp} <br></br>
        {msg.message}
      </div>)
    }
    return (<div>
      To: {msg.to} From: {msg.from} {msg.timestamp} <br></br>
      {msg.message}
    </div>)
  }

  return (
    <div className="App-header">
      <div className="direct-messages-block" ref={messagesEndRef}>
        {existMoreToLoad && <button onClick={() => setMsgLimit(msgLimit + 10)}> Load More </button>}
        {msgList.slice().reverse().map((msg) => messageComponent(msg))}
      </div>
      <div className="textbox-msg-block">
        <input 
          type="text" 
          value={txtMsg} 
          onChange={handleTxtChange} 
          placeholder={msgLimit}
        />
        <button onClick={() => sendMessage()}>Send</button>
        <button onClick={() => {console.log(userListUnreadNum)}}>Mark</button>
      </div>
      <div className="select-user-block">
        {userList.map((user) => (
          <div onClick={() => 
            { 
              markCurrMessagesAsRead();
              getNumberOfUnreadDms(selectedUser);
              setSelectedUser(user.anon_username);
            }} style={{ cursor: 'pointer' }}>
            {user.anon_username} + ({userListUnreadNum.find(item => item.from === user.anon_username)?.number})
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