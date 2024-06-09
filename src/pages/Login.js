import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import Button from '@mui/material/Button';

const Login = () => {
  const [txtEmail, setTxtEmail] = useState('');
  const [txtPassword, setTxtPassword] = useState('');

  // Communicating Email and password to server
  const attemptLogin = async () => {
    const newUser = {
        email: txtEmail,
        password: txtPassword
      };
  
      console.log(JSON.stringify(newUser));
  
      try {
        const response = await fetch('http://localhost:3001/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newUser)
        });
  
        if (response.ok) {
          window.location.href = '/test-page';
        } else {
          console.error('Error logging in');
        }
      } catch (error) {
        console.error('Error:', error);
      }
  };

  // Handling events
  // [!!] NOTE: Need to handle changes in textboxes as well,
  //      hence why we need to have temp variable
  const handleChangeInEmail = (e) => {
    setTxtEmail(e.target.value);
  }

  const handleChangeInPassword = (e) => {
    setTxtPassword(e.target.value);
  }

  return (
    <div>
      <h1> LinkUp Login Page </h1>
      <div>
        <label>
          Email :
          <input type="email" value={txtEmail} onChange={handleChangeInEmail} />
        </label>
      </div>
      <div>
        <label>
          Password :
          <input type="text" value={txtPassword} onChange={handleChangeInPassword} />
        </label>
      </div>
      <div>
        <button onClick={attemptLogin}> Login </button>
      </div>
      <div>
        <Button component={Link} to="/signup-page" variant="contained"> Create an account </Button>
      </div>
    </div>
  );
};

export default Login;