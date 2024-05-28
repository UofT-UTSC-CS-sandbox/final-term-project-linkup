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
import TestPage from './TestPage.js';

function HomePage() {
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
    </header>
  );
}

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
