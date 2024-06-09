import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import Button from '@mui/material/Button';

const SignUp = () => {
  const [txtEmail, setTxtEmail] = useState('');
  const [txtPassword, setTxtPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [existsErrors, setThereExistsErrors] = useState(false);

  // Validating email exists

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
    <div>
      <h1> LinkUp Sign Up Page </h1>
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
          {/* This line will only appear if there exists objects in passwordErrors*/}
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
      </div>
      {existsErrors && <span style={{ color: 'red' }}>Unable to sign up</span>}
      <div>
        <Button component={Link} to="/login-page" variant="contained"> Have an account? Login </Button>
      </div>
    </div>
  );
};

export default SignUp;