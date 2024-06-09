import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useNavigate, Link } from "react-router-dom";
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import Button from '@mui/material/Button';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'

const Login = () => {
  const [txtEmail, setTxtEmail] = useState('');
  const [txtPassword, setTxtPassword] = useState('');
  const signIn = useSignIn();
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  
  // Redirecting if already authenticated
  useEffect(() => {
    if(isAuthenticated) {
      navigate('/test-page');
    }
  });


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
          const data = await response.json();

          console.log(data);

          if (data.accessToken && data.user.email) {
            if (signIn({
              auth: {
                token: data.accessToken,
                type: 'Bearer'},
              userState: {
                  email: data.user.email
              }
            })) {
              // Redirect or perform other actions upon successful login
              navigate('/test-page');
            } else {
              console.error('Authentication failed');
            }
          } else {
            console.log('Invalid data received from backend');
          }
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