/* 
  Try to organize imports by category
*/

// Component imports
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Outlet, Link } from "react-router-dom";
import Button from '@mui/material/Button';


// Image imports
import logo from './images/linkup_logo.png';
import './App.css';

// Page imports
import TestPage from './pages/TestPage.js';
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/Login.js';
import SignUpPage from './pages/SignUp.js';
import VerificationPage from "./pages/VerificationPage.js";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/test-page" element={<TestPage/>} />
            <Route path="/login-page" element={<LoginPage/>} />
            <Route path="/signup-page" element={<SignUpPage/>} />
            <Route path="/verification/:token" element={<VerificationPage/>} />
          </Routes>
      </div>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

export default App;
