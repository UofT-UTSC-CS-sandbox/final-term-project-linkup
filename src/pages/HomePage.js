// Component imports
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import Button from '@mui/material/Button';

// Image imports
import logo from '../images/linkup_logo.png';

function HomePage() {

    const addObjectToDatabase = async () => {
      const newObject = {
        name: "Another Jane Doe",
        email: "anotherjanedoe@linkup.com",
        age: 35
      };
  
      try {
        const response = await fetch('http://localhost:3001/test-page', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newObject)
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
  
        <Button component={Link} to="/test-page" variant="contained">Go to TestPage</Button>
  
        <Button variant="contained" onClick={addObjectToDatabase}>Add Object to Database</Button>
      </header>
    );
}

export default HomePage;