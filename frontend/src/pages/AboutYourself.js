
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
    <div className="preferences-container">
      <img src={logo} alt="LinkUp Logo" className="logo-block" />
      <h3 className="slogan">Tell us about yourself.</h3>
      <div className="preferences-form-container">
        <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
          <Select
            name="field_of_interest"
            options={[
              { value: 'computer science', label: 'Computer Science' },
              { value: 'business', label: 'Business' },
              { value: 'biology', label: 'Biology' },
              { value: 'economics', label: 'Economics' },
              { value: 'law', label: 'Law' },
              { value: 'art', label: 'Art' }
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
              { value: 'entry', label: 'Entry Level' },
              { value: 'intermediate', label: 'Intermediate Level' },
              { value: 'senior', label: 'Senior Level' }
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
              { value: 'diploma', label: 'Diploma' },
              { value: 'bachelor', label: 'Bachelor' },
              { value: 'master', label: 'Master' },
              { value: 'phd', label: 'PHD' }
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
              { value: 'usa', label: 'USA' },
              { value: 'canada', label: 'Canada' },
              { value: 'europe', label: 'Europe' },
              { value: 'india', label: 'India' },
              { value: 'turkey', label: 'Turkey' },
              { value: 'mexico', label: 'Mexico' },
              { value: 'brazil', label: 'Brazil' },
              { value: 'argentina', label: 'Argentina' },
              { value: 'colombia', label: 'Colombia' },
              { value: 'uk', label: 'United Kingdom' },
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
