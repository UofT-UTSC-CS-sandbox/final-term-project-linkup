import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

import TestPage from './pages/TestPage.js';
import HomePage from './pages/HomePage.js';
import ResumeUpload from './pages/ResumeUpload';
import Profile from './pages/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/test-page" element={<TestPage/>} />
            <Route path="/upload" element={<ResumeUpload/>} />
            <Route path="/profile" element={<Profile/>} />
          </Routes>
      </div>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

export default App;
