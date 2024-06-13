// Component imports
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useNavigate, Link } from "react-router-dom";
import Button from '@mui/material/Button';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'

// Image imports
import logo from '../images/linkup_logo.png';

function HomePage() {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  
  // Redirecting if already authenticated
  useEffect(() => {
    if(isAuthenticated) {
      navigate('/test-page');
    }
  });

  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <p>
        Edit <code>src/App.js</code> and save to reload.
      </p>
      
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>

      <Button component={Link} to="/login-page" variant="contained">Go to Login Page</Button>
      {/* <Link to="/upload"><button>Go to Resume Upload</button></Link> */}

      {/* <Button variant="contained" onClick={addObjectToDatabase}>Add Object to Database</Button> */}
    </header>
  );
}

export default HomePage;