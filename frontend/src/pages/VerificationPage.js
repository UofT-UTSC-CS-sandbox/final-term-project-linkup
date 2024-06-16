import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

// Styling
import './VerificationPage.css';
import logo from '../images/linkup_logo.png';

const VerificationPage = () => {
  const { token } = useParams(); // Get token from queryString in URL from email
  console.log(token);

  useEffect(() => {
    const t = {
        token: token,
    };
  
    const verifyEmail = async () => {
        try {
            const response = await fetch(`http://localhost:3001/verify-user`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(t)
            });
      
          } catch (error) {
            console.error('Error:', error);
          }
    }

    verifyEmail();

    });

  return (
    <header className="App-header">
      <img style={{width: "20%"}} src={logo} alt="logo" />
      <p className="verification-prompt">
        Your account is now verified!
        <a href="/login-page" style={{marginLeft: "5px"}} >Start Exploring</a>
      </p>
      
    </header>
  );
};

export default VerificationPage;