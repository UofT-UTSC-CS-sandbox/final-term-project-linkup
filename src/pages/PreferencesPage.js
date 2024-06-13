import React, { useState } from 'react';
import logo from '../images/linkup_logo.png'; 
import Select from 'react-select';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import './Preferences.css'; 

function PreferencesForm() {
     // Hook to get authenticated user info
    const user = useAuthUser();
      // State to store user preferences
    const [preferences, setPreferences] = useState({
        field_of_interest: '',
        work_experience_level: '',
        education: '',
        location: '',
    });
   // Handle changes in the select dropdowns
    const handleChange = (selectedOption, action) => {
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

    return (
        <div className="preferences-container">
            <img src={logo} alt="LinkUp Logo" className="logo" />
            <div className="preferences-form-container">
                <h3>Select Your Preferences</h3>
                
                <h10>Resumes shown to you will be tailored according to your preferences.</h10>
                <br></br>
                <form onSubmit={handleSubmit} style={{ textAlign: 'center' }}>
                < br></br>
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
                        placeholder="Field of Interest (Optional)"
                        isClearable
                    />
                    <Select
                        name="work_experience_level"
                        options={[
                            { value: 'entry', label: 'Entry Level' },
                            { value: 'intermediate', label: 'Intermediate Level' },
                            { value: 'senior', label: 'Senior Level' }
                        ]}
                        onChange={handleChange}
                        styles={customStyles}
                        placeholder="Experience Level (Optional)"
                        isClearable
                    />
                    <Select
                        name="education"
                        options={[
                            { value: 'highschool', label: 'Diploma' },
                            { value: 'bachelor', label: 'Bachelor' },
                            { value: 'master', label: 'Master' },
                            { value: 'phd', label: 'PHD' }
                        ]}
                        onChange={handleChange}
                        styles={customStyles}
                        placeholder="Education Level (Optional)"
                        isClearable
                    />
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
                        placeholder="Geographic Location (Optional)"
                        isClearable
                    />
                    <button type="submit" className="submit-button">FINISH</button>
                </form>
            </div>
        </div>
    );
}

export default PreferencesForm;
