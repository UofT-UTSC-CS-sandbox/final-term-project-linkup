import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useNavigate, Link } from "react-router-dom";
import Button from '@mui/material/Button';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'

// Styling
import './SignUp.css';
import logo from '../images/linkup_logo_highquality.png';

const SignUp = () => {
  const [txtEmail, setTxtEmail] = useState('');
  const [txtPassword, setTxtPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [existsErrors, setThereExistsErrors] = useState(false);

  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  
  // Redirecting if already authenticated
  useEffect(() => {
    if(isAuthenticated) {
      navigate('/profile');
    }
  });

  // Validating password input
  const validatePassword = (val) => {
    const errors = [];

    if (!val) {
      errors.push('Password is required');
    } else {
      if(val.length <= 8) {
        errors.push('Password must be length of at least 8');
      }
      if (!/[A-Z]/.test(val)) {
        errors.push('Password must contain at least one uppercase letter');
      }
      if (!/[a-z]/.test(val)) {
        errors.push('Password must contain at least one lowercase letter');
      } 
      if (!/[$%&#]/.test(val)) {
        errors.push('Password must contain at least one special character (one of $ % & #)');
      }
    }

    setPasswordErrors(errors);
    if(!(errors.length === 0))
    {
      setThereExistsErrors(true);
    }
    // Return if the number of errors is zero
    return errors.length === 0;
  };


  // Communicating Email and password to server
  const sendNewUserToDatabase = async () => {
    if(!validatePassword(txtPassword)) {
      setThereExistsErrors(true);
      return;
    }

    const newUser = {
      email: txtEmail,
      password: txtPassword
    };

    console.log(JSON.stringify(newUser));

    try {
      const response = await fetch('http://localhost:3001/new-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        console.log('Object added successfully');
      } else {
        console.error('Error adding object');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Handling events
  // [!!] NOTE: Need to handle changes in textboxes as well,
  //      hence why we need to have temp variable
  const handleChangeInEmail = (e) => {
    setThereExistsErrors(false);
    setTxtEmail(e.target.value);
  }

  const handleChangeInPassword = (e) => {
    setThereExistsErrors(false);
    setTxtPassword(e.target.value);
    validatePassword(e.target.value);
  }

  return (
    <header className='App-header'>
      <img className='logo-block' src={logo} alt="logo" />
      <div className='slogan-block'>
        <label className='slogan'>
          Engage anonymously. Improve resumes. Make professional connections.
        </label>
      </div>
      {!existsErrors &&
        <div className='signup-block'>
          <label className='email-text-pos'> 
            Email 
          </label>
          <input className='email-custom-textbox' type="email" value={txtEmail} onChange={handleChangeInEmail} />
          <label className='password-text-pos'> 
            Password
          </label>
          <input className='password-custom-textbox' type="text" value={txtPassword} onChange={handleChangeInPassword} />
          <label className='confirmpassword-text-pos'> 
            Confirm Password
          </label>
          <input className='confirmpassword-custom-textbox' type="text" value={txtPassword} onChange={handleChangeInPassword} />
          <button className='signup-button' onClick={sendNewUserToDatabase}> Sign Up </button>
          <label className='login-prompt'>
            Already have an account?
            <a href="/login-page" > Log In </a>
          </label>
        </div>
      }
      {existsErrors &&
        <div className='signup-block-valerr'>
          <label className='email-text-pos-valerr'> 
            Email 
          </label>
          <input className='email-custom-textbox-valerr' type="email" value={txtEmail} onChange={handleChangeInEmail} />
          <label className='password-text-pos-valerr'> 
            Password
          </label>
          <input className='password-custom-textbox-valerr' type="text" value={txtPassword} onChange={handleChangeInPassword} />
          <label className='confirmpassword-text-pos-valerr'> 
            Confirm Password
          </label>
          <input className='confirmpassword-custom-textbox-valerr' type="text" value={txtPassword} onChange={handleChangeInPassword} />
          <div className='signup-validation-error-block-pos'>
            {(passwordErrors.map((error) => (
              <div>
                <p className="signup-validation-error0">{error}</p>
              </div>
            )))}
          </div>
          <button className='signup-button-valerr' onClick={sendNewUserToDatabase}> Sign Up </button>
          <label className='login-prompt-valerr'>
            Already have an account?
            <a href="/login-page" > Log In </a>
          </label>
        </div>}
      {/* <h1> LinkUp Sign Up Page </h1>
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
          {passwordErrors && 
            <span style={{ color: 'red' }}>
              {(passwordErrors.map((error) => (
                <div>
                  <p>{error}</p>
                </div>
              )))}
            </span>}
        </label>
      </div>
      <div>
        <button onClick={sendNewUserToDatabase}> Add user to database </button>
      </div> */}
      {existsErrors && <span style={{ color: 'red' }}>Unable to sign up</span>}
      {/* <div>
        <Button component={Link} to="/login-page" variant="contained"> Have an account? Login </Button>
      </div> */}
    </header>
  );
};

export default SignUp;