import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useNavigate, Link } from "react-router-dom";
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';

// Styling
import './Login.css';
import logo from '../images/linkup_logo_highquality.png';
import loginDesign from '../images/login-design.png';


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
              navigate('/upload');
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
    <header className='App-header'>
      <img className='logo-block' src={logo} alt="logo" />
      <div className='textbox-block'>
        <h1 className='slogan-pos'> Swipe. Match. Network. </h1>
        <label className='email-text-posit'> 
          Email 
        </label>
        <input className='email-custom-textboxx' type="email" value={txtEmail} onChange={handleChangeInEmail} />
        <label className='password-text-posit'> 
          Password
        </label>
        <input className='password-custom-textboxx' type="text" value={txtPassword} onChange={handleChangeInPassword} />
        <button className='login-button' onClick={attemptLogin}> Log In </button>
        <label className='signup-prompt'>
          Don't have an account?
          <a href="/signup-page" > Create now </a>
        </label>
      </div>
      <img className='design-block' src={loginDesign} alt="logo" />
    </header>
  );
};

export default Login;