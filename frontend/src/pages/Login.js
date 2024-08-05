import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useNavigate, Link } from "react-router-dom";
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import { useUser } from './UserContext';
// Styling
import './Login.css';
import logo from '../images/linkup_logo_highquality.png';
import loginDesign from '../images/login-design.png';

const Login = () => {
  const [txtEmail, setTxtEmail] = useState('');
  const [txtPassword, setTxtPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState('');
  const signIn = useSignIn();
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const { updateUserData } = useUser();
  
  // Redirecting if already authenticated
  useEffect(() => {
    if(isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);


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

          if (data.accessToken && data.user.email) {
            if (signIn({
              auth: {
                token: data.accessToken,
                type: 'Bearer'},
              userState: {
                  email: data.user.email,
                  name: data.user.name,
                  id: data.user.id
              }
            })) {
              updateUserData({
                email: data.user.email,
                name: data.user.name,
                id: data.user.id
              });
              // Redirect or perform other actions upon successful login
              console.log('User data updated:', data.user);
              navigate('/');
            } else {
              console.error('Authentication failed');
              setLoginError(true);
            }
          } else {
            setLoginError(true);
          }
        } else {
          const errMsg = await response.json();
          setLoginErrorMsg(errMsg.errorMsg);
          setLoginError(true);
        }
      } catch (error) {
        console.error('Error:', error);
        setLoginError(true);
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

  // Key listeners
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      attemptLogin();
    }
  };

  return (
    <header className='App-header'>
      <img className='logo-block' src={logo} alt="logo" />
      <div className='textbox-block'>
        <h1 className='slogan-pos'> Swipe. Match. Network. </h1>
        <label className='email-text-posit'> 
          Email 
        </label>
        <input className='email-custom-textboxx' type="email" value={txtEmail} onKeyDown={handleKeyDown} onChange={handleChangeInEmail} />
        <label className='password-text-posit'> 
          Password
        </label>
        <input className='password-custom-textboxx' type="password" value={txtPassword} onKeyDown={handleKeyDown} onChange={handleChangeInPassword} />
        {loginError && (
          <div>
            <label className='login-validation-error'>  {loginErrorMsg} </label>
            <button className='login-button-validation-error' onClick={attemptLogin}> Log In </button>
            <label className='signup-prompt-validation-error0'>
              Don't have an account?
              <a href="/signup-page" > Create now </a>
            </label>
          </div>
        )}
        {!loginError && (
          <div>
            <button className='login-button' onClick={attemptLogin}> Log In </button>
            <label className='signup-prompt'>
              Don't have an account?
              <a href="/signup-page" > Create now </a>
            </label>
          </div>
        )}
      </div>
      <img className='design-block' src={loginDesign} alt="logo" />
    </header>
  );
};

export default Login;