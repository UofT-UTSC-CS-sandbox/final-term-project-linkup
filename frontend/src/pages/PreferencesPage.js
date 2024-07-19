import React, { useEffect, useState } from 'react';
import axios from "axios";
import logo from '../images/linkup_logo_highquality.png';
import Select from 'react-select';
import './Preferences.css';
import Sidebar from '../components/Sidebar.js';

// Routing and authentication
import { useNavigate } from "react-router-dom";

// Routing and authentication
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

function PreferencesForm() {
    // Hook to get authenticated user info
    const user = useAuthUser();
    const navigate = useNavigate();
    const isAuthenticated = useIsAuthenticated();
    const auth = useAuthUser();
    var userId = null;

    // Redirect user to login page if not authenticated
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login-page');
        } else {
            userId = auth.id;
        }
    });

    const [currentUserInfo, setUser] = useState([]);

    const [preferences, setPreferences] = useState({
        preferences_edu: '',
        preferences_interest: '',
        preferences_loc: '',
        preferences_workexp: '',
    });

    // Function to get the current user info from the backend
    const getUser = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/${userId}`);
            const userInfo = response.data[0];
            setUser(userInfo);
            setPreferences({
                preferences_edu: userInfo.preferences_edu || '',
                preferences_interest: userInfo.preferences_interest || '',
                preferences_loc: userInfo.preferences_loc || '',
                preferences_workexp: userInfo.preferences_workexp || '',
            });
        } catch (error) {
            console.error('Failed to get User', error);
        }
    }

    // Handle changes in the select dropdowns
    const handleChange = (selectedOption, action) => {
        console.log("Selected Option:", selectedOption);
        console.log("Action:", action);
        setPreferences(prevState => ({
            ...prevState,
            [action.name]: selectedOption ? selectedOption.value : ''
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Ensure user is authenticated and email is available
        if (!user || !user.email) {
            console.error('User is not authenticated or email is not available');
            return;
        }

        console.log("Submitting for user:", user.email);
        console.log(preferences);
        // Send updated preferences to the backend
        try {
            const response = await fetch('http://localhost:3001/api/updatePreferences', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user.email,
                    preferences,
                }),
            });

            if (response.ok) {
                console.log('Preferences updated successfully');
                navigate('/swiping');
            } else {
                console.error('Error updating preferences:', await response.text());
            }
        } catch (error) {
            console.error('Error updating preferences:', error);
        }
    };

    // Custom styles for react-select components
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
            textAlign: 'center',
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

    // Fetch user info when component mounts
    useEffect(() =>  {
        if (userId) {
            getUser();
        }
    }, [userId]);

    return (
        <div className="container">
            <div className="app-logo-container"> 
                <a href="/">
                    <img src={logo} className="logo" alt="LinkUp Logo" />
                </a> 
            </div>
            <Sidebar></Sidebar>
            <div className="preferences-form-container">
                <h2>Select Your Preferences</h2>
                <p class="preferences-desc">Resumes shown to you will be tailored according to your preferences.</p>
                <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
                    <br></br>
                    <Select
                        name="preferences_interest"
                        options={[
                            { value: '', label: '- All -' },
                            { value: 'Computer Science', label: 'Computer Science' },
                            { value: 'Business', label: 'Business' },
                            { value: 'Biology', label: 'Biology' },
                            { value: 'Economics', label: 'Economics' },
                            { value: 'Law', label: 'Law' },
                            { value: 'Art', label: 'Art' }
                        ]}
                        onChange={handleChange}
                        styles={customStyles}
                        value={preferences.preferences_interest ? { value: preferences.preferences_interest, label: preferences.preferences_interest } : null}
                        placeholder={preferences.preferences_interest ? "" : "Field of Interest (Optional)"}
                        isClearable
                    />
                    <Select
                        name="preferences_workexp"
                        options={[
                            { value: '', label: '- All -' },
                            { value: 'Entry Level', label: 'Entry Level' },
                            { value: 'Intermediate Level', label: 'Intermediate Level' },
                            { value: 'Senior Level', label: 'Senior Level' }
                        ]}
                        onChange={handleChange}
                        styles={customStyles}
                        value={preferences.preferences_workexp ? { value: preferences.preferences_workexp, label: preferences.preferences_workexp } : null}
                        placeholder={preferences.preferences_workexp ? "" : "Experience Level (Optional)"}
                        isClearable
                    />
                    <Select
                        name="preferences_edu"
                        options={[
                            { value: '', label: '- All -' },
                            { value: 'Diploma', label: 'Diploma' },
                            { value: 'Bachelor', label: 'Bachelor' },
                            { value: 'Master', label: 'Master' },
                            { value: 'PHD', label: 'PHD' }
                        ]}
                        onChange={handleChange}
                        styles={customStyles}
                        value={preferences.preferences_edu ? { value: preferences.preferences_edu, label: preferences.preferences_edu } : null}
                        placeholder={preferences.preferences_edu ? "" : "Education Level (Optional)"}
                        isClearable
                    />
                    <Select
                        name="preferences_loc"
                        options={[
                            { value: '', label: '- All -' },
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
                        value={preferences.preferences_loc ? { value: preferences.preferences_loc, label: preferences.preferences_loc } : null}
                        placeholder={preferences.preferences_loc ? "" : "Geographic Location (Optional)"}
                        isClearable
                    />
                    <button type="submit" className="submit-button">FINISH</button>
                </form>
            </div>
        </div>
    );
}

export default PreferencesForm;
