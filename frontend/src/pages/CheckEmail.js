
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CheckEmail.css';

// Routing and authentication
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'; 

const CheckEmail = () => {
  
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser();
  var userId = null;

  // Redirect user to login page if not authenticated
  useEffect(() => {
    if(!isAuthenticated) {
      navigate('/login-page');
    }
    else
    {
      userId = auth.id;
    }
  });
  
  return (
    <div className="check-email-container">
      <h2>Thank you for Signing Up!</h2>
      <p>Please check your email to verify your account.</p>
    </div>
  );
};

export default CheckEmail;