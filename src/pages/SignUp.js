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
  const [txtConfirmPassword, setTxtConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [existsErrors, setThereExistsErrors] = useState(false);
  const [existsPasswordMatchErrors, setExistsPasswordMatchErrors] = useState(false);
  const [classes, setClasses] = useState({});

  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  
  // Redirecting if already authenticated
  useEffect(() => {
    if(isAuthenticated) {
      navigate('/profile');
    }
    setDisplayClasses();
  });

  const setDisplayClasses = () => {
    if(existsErrors)
    {
      setClasses(
        {
          signup_block: 'signup-block-valerr',
          email_text_pos: 'email-text-pos-valerr',
          email_custom_textbox: 'email-custom-textbox-valerr',
          password_text_pos: 'password-text-pos-valerr',
          password_custom_textbox: 'password-custom-textbox-valerr',
          confirmpassword_text_pos: 'confirmpassword-text-pos-valerr',
          confirmpassword_custom_textbox: 'confirmpassword-custom-textbox-valerr',
          signup_button: 'signup-button-valerr',
          login_prompt: 'login-prompt-valerr'
        }
      );
    }
    else if (existsPasswordMatchErrors) {
      setClasses(
        {
          signup_block: 'signup-block-matcherr',
          email_text_pos: 'email-text-pos-matcherr',
          email_custom_textbox: 'email-custom-textbox-matcherr',
          password_text_pos: 'password-text-pos-matcherr',
          password_custom_textbox: 'password-custom-textbox-matcherr',
          confirmpassword_text_pos: 'confirmpassword-text-pos-matcherr',
          confirmpassword_custom_textbox: 'confirmpassword-custom-textbox-matcherr',
          signup_button: 'signup-button-matcherr',
          login_prompt: 'login-prompt-matcherr'
        }
      );
    }
    else
    {
      setClasses(
        {
          signup_block: 'signup-block',
          email_text_pos: 'email-text-pos',
          email_custom_textbox: 'email-custom-textbox',
          password_text_pos: 'password-text-pos',
          password_custom_textbox: 'password-custom-textbox',
          confirmpassword_text_pos: 'confirmpassword-text-pos',
          confirmpassword_custom_textbox: 'confirmpassword-custom-textbox',
          signup_button: 'signup-button',
          login_prompt: 'login-prompt'
        }
      );
    }
  }

  // Validating password input
  const validatePassword = (val) => {
    const errors = [];

    // Validating email -> semantics changed later
    if(txtEmail == '' && !val)
    {
      errors.push('Email and password is required');
    }
    else if (txtEmail == '')
    {
      errors.push('Email is required');
    }
    else if (!val)
    {
      errors.push('Password is required');
    }
    else 
    {
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

    checkPasswordMatch();
    if(existsPasswordMatchErrors){
      return;
    }

    setThereExistsErrors(false);

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

  const checkPasswordMatch = () => {
    if (txtPassword != txtConfirmPassword)
    {
      setExistsPasswordMatchErrors(true);
    }
    else
    {
      setExistsPasswordMatchErrors(false);
    }
  }

  // Handling events
  // [!!] NOTE: Need to handle changes in textboxes as well,
  //      hence why we need to have temp variable
  const handleChangeInEmail = (e) => {
    setThereExistsErrors(false);
    setExistsPasswordMatchErrors(false);
    setTxtEmail(e.target.value);
    validatePassword(txtPassword);
  };

  const handleChangeInPassword = (e) => {
    setThereExistsErrors(false);
    setExistsPasswordMatchErrors(false);
    setTxtPassword(e.target.value);
    validatePassword(e.target.value);
    setDisplayClasses();
  };

  const handleChangeInConfirmPassword = (e) => {
    setExistsPasswordMatchErrors(false);
    setTxtConfirmPassword(e.target.value);
  };

  return (
    <header className='App-header'>
      <img className='logo-block' src={logo} alt="logo" />
      <div className='slogan-block'>
        <label className='slogan'>
          Engage anonymously. Improve resumes. Make professional connections.
        </label>
      </div>
      <div className={classes.signup_block}>
        <label className={classes.email_text_pos}> 
          Email 
        </label>
        <input className={classes.email_custom_textbox} type="email" value={txtEmail} onChange={handleChangeInEmail} />
        <label className={classes.password_text_pos}> 
          Password
        </label>
        <input className={classes.password_custom_textbox} type="text" value={txtPassword} onChange={handleChangeInPassword} />
        {existsErrors && 
          (<div className='signup-validation-error-block-pos'>
            {(passwordErrors.map((error) => (
              <div>
                <p className="signup-validation-error0">{error}</p>
              </div>
            )))}
          </div>)}
        <label className={classes.confirmpassword_text_pos}> 
          Confirm Password
        </label>
        <input className={classes.confirmpassword_custom_textbox} type="text" value={txtConfirmPassword} onChange={handleChangeInConfirmPassword} />
        {existsPasswordMatchErrors &&
          <label className='signup-passwordMatch-err0'> Unable to sign up, passwords don't match </label>}
        <button className={classes.signup_button} onClick={sendNewUserToDatabase}> Sign Up </button>
        <label className={classes.login_prompt}>
          Already have an account?
          <a href="/login-page" > Log In </a>
        </label>
      </div>
        
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