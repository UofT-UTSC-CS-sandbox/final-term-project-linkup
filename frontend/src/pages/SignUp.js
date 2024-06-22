import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
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
    if (isAuthenticated) {
      navigate('/profile');
    }
    setDisplayClasses();
  }, [isAuthenticated]);

  const setDisplayClasses = () => {
    if (existsErrors) {
      setClasses({
        signup_block: 'signup-block-valerr',
        email_text_pos: 'email-text-pos-valerr',
        email_custom_textbox: 'email-custom-textbox-valerr',
        password_text_pos: 'password-text-pos-valerr',
        password_custom_textbox: 'password-custom-textbox-valerr',
        confirmpassword_text_pos: 'confirmpassword-text-pos-valerr',
        confirmpassword_custom_textbox: 'confirmpassword-custom-textbox-valerr',
        signup_button: 'signup-button-valerr',
        login_prompt: 'login-prompt-valerr'
      });
    } else if (existsPasswordMatchErrors) {
      setClasses({
        signup_block: 'signup-block-matcherr',
        email_text_pos: 'email-text-pos-matcherr',
        email_custom_textbox: 'email-custom-textbox-matcherr',
        password_text_pos: 'password-text-pos-matcherr',
        password_custom_textbox: 'password-custom-textbox-matcherr',
        confirmpassword_text_pos: 'confirmpassword-text-pos-matcherr',
        confirmpassword_custom_textbox: 'confirmpassword-custom-textbox-matcherr',
        signup_button: 'signup-button-matcherr',
        login_prompt: 'login-prompt-matcherr'
      });
    } else {
      setClasses({
        signup_block: 'signup-block',
        email_text_pos: 'email-text-pos',
        email_custom_textbox: 'email-custom-textbox',
        password_text_pos: 'password-text-pos',
        password_custom_textbox: 'password-custom-textbox',
        confirmpassword_text_pos: 'confirmpassword-text-pos',
        confirmpassword_custom_textbox: 'confirmpassword-custom-textbox',
        signup_button: 'signup-button',
        login_prompt: 'login-prompt'
      });
    }
  }
 // Validating password input
  const validatePassword = (val) => {
    const errors = [];
    // Validating email -> semantics changed later
    if (txtEmail === '' && !val) {
      errors.push('Email and password is required');
    } else if (txtEmail === '') {
      errors.push('Email is required');
    } else if (!val) {
      errors.push('Password is required');
    } else {
      if (val.length <= 8) {
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
    if (errors.length !== 0) {
      setThereExistsErrors(true);
    }
    return errors.length === 0;
  };

  const checkPasswordMatch = () => {
    if (txtPassword !== txtConfirmPassword) {
      setExistsPasswordMatchErrors(true);
    } else {
      setExistsPasswordMatchErrors(false);
    }
  }

  const handleNext = () => {
    if (!validatePassword(txtPassword)) {
      setThereExistsErrors(true);
      return;
    }

    // checkPasswordMatch();
    // if (existsPasswordMatchErrors) {
    //   return;
    // }

    setThereExistsErrors(false);

    const newUser = {
      email: txtEmail,
      password: txtPassword
    };

    navigate('/about-form', { state: { newUser } });
  };
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
            {passwordErrors.map((error) => (
              <div key={error}>
                <p className="signup-validation-error0">{error}</p>
              </div>
            ))}
          </div>)}
        <label className={classes.confirmpassword_text_pos}> 
          Confirm Password
        </label>
        <input className={classes.confirmpassword_custom_textbox} type="text" value={txtConfirmPassword} onChange={handleChangeInConfirmPassword} />
        {existsPasswordMatchErrors &&
          <label className='signup-passwordMatch-err0'> Unable to sign up, passwords don't match </label>}
        <button className={classes.signup_button} onClick={handleNext}>Next</button>
        <label className={classes.login_prompt}>
          Already have an account?
          <a href="/login-page"> Log In </a>
        </label>
      </div>
    </header>
  );
};

export default SignUp;
