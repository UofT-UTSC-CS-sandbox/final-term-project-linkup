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

function App() {
  return (
    <BrowserRouter>
      <div className="App">
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/test-page" element={<TestPage/>} />
          </Routes>
      </div>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

export default App;
