
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import Select from 'react-select';
import './Preferences.css';
import logo from '../images/linkup_logo_highquality.png';

// Routing and authentication
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'; 

/* Gets user info and passes to backend*/
const AboutForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const newUser = location.state.newUser;
  
  const [preferences, setPreferences] = useState({
    field_of_interest: '',
    work_experience_level: '',
    location: '',
    education: '',
  });

  const [errors, setErrors] = useState({});

  const handleChange = (selectedOption, action) => {
    setPreferences(prevState => ({
      ...prevState,
      [action.name]: selectedOption ? selectedOption.value : ''
    }));
    setErrors(prevErrors => ({
      ...prevErrors,
      [action.name]: ''
    }));
  };
  /* Error messages to ensure the user fills all fields*/
  const validateFields = () => {
    const newErrors = {};

    if (!preferences.field_of_interest) {
      newErrors.field_of_interest = 'Field of Interest is required';
    }
    if (!preferences.work_experience_level) {
      newErrors.work_experience_level = 'Experience Level is required';
    }
    if (!preferences.education) {
      newErrors.education = 'Education Level is required';
    }
    if (!preferences.location) {
      newErrors.location = 'Geographic Location is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) {
      return;
    }

    const fullProfileData = { ...newUser, ...preferences };
    console.log("Submitting full user data:", fullProfileData);

    try {
      const response = await fetch('http://localhost:3001/new-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullProfileData),
      });

      if (response.ok) {
        console.log('User created and preferences updated successfully');
        navigate("/check-email");
      } else {
        console.error('Error updating preferences:', await response.text());
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
    }
  };

  const customStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '20px',
      fontSize: '14px',
      borderColor: state.isFocused ? '#blue' : '#ccc',
      boxShadow: state.isFocused ? '0 0 0 1px #blue' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#blue' : '#ccc',
      },
      width: '100%',
      marginBottom: '20px',
      borderRadius: '15px',
      backgroundColor:'#F9F9F9'
    }),
    valueContainer: (base) => ({
      ...base,
      padding: '10px',
    }),
    placeholder: (base) => ({
      ...base,
      color: '#000',
      textAlign: 'Left',
    }),
    dropdownIndicator: (base) => ({
      ...base,
      color: '#888'
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#26ACD6' : state.isFocused ? '#bfe7f6' : null,
      color: state.isSelected ? 'white' : 'black',
      cursor: 'pointer',
      color: '#000',
      textAlign: 'left',
    }),
  };
 /* All fields similar to preferences fields*/
  return (
    <div className="container">
      <img src={logo} alt="LinkUp Logo" className="logo-block" />
      <h3 className="slogan">Tell us about yourself.</h3>
      <div className="preferences-form-container">
        <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
          <Select
            name="field_of_interest"
            options={[
              { value: 'Computer Science', label: 'Computer Science' },
              { value: 'Business', label: 'Business' },
              { value: 'Biology', label: 'Biology' },
              { value: 'Economics', label: 'Economics' },
              { value: 'Law', label: 'Law' },
              { value: 'Art', label: 'Art' }
            ]}
            onChange={handleChange}
            styles={customStyles}
            placeholder="Field of Interest"
            isClearable
          />
          {errors.field_of_interest && <p className="error">{errors.field_of_interest}</p>}
          <Select
            name="work_experience_level"
            options={[
              { value: 'Entry Level', label: 'Entry Level' },
              { value: 'Intermediate Level', label: 'Intermediate Level' },
              { value: 'Senior Level', label: 'Senior Level' }
            ]}
            onChange={handleChange}
            styles={customStyles}
            placeholder="Experience Level"
            isClearable
          />
          {errors.work_experience_level && <p className="error">{errors.work_experience_level}</p>}
          <Select
            name="education"
            options={[
              { value: 'Diploma', label: 'Diploma' },
              { value: 'Bachelor', label: 'Bachelor' },
              { value: 'Master', label: 'Master' },
              { value: 'PHD', label: 'PHD' }
            ]}
            onChange={handleChange}
            styles={customStyles}
            placeholder="Education Level"
            isClearable
          />
          {errors.education && <p className="error">{errors.education}</p>}
          <Select
            name="location"
            options={[
              { value: 'USA', label: 'USA' },
              { value: 'Canada', label: 'Canada' },
              { value: 'Europe', label: 'Europe' },
              { value: 'India', label: 'India' },
              { value: 'Turkey', label: 'Turkey' },
              { value: 'Mexico', label: 'Mexico' },
              { value: 'Brazil', label: 'Brazil' },
              { value: 'Argentina', label: 'Argentina' },
              { value: 'Colombia', label: 'Colombia' },
              { value: 'United Kingdom', label: 'United Kingdom' },
            ]}
            onChange={handleChange}
            styles={customStyles}
            placeholder="Geographic Location"
            isClearable
          />
          {errors.location && <p className="error">{errors.location}</p>}
          <button type="submit" className="submit-button">Finish</button>
          <br></br>
          <div className="login-prompt">
        <span>Already have an account? <a href="/login-page">Log In</a></span>
      </div>
        </form>
      </div>
    </div>
  );
};

export default AboutForm;
