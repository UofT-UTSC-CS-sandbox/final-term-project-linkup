import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

import TestPage from './pages/TestPage.js';
import HomePage from './pages/HomePage.js';
import LoginPage from './pages/Login.js';
import SignUpPage from './pages/SignUp.js';
import VerificationPage from "./pages/VerificationPage.js";
import PreferencesPage from './pages/PreferencesPage.js'; 
import ResumeUpload from './pages/ResumeUpload';
import Profile from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';
import AboutForm from "./pages/AboutYourself.js";
import CheckEmail from "./pages/CheckEmail.js";
import CheckUserLoggedIn  from "./pages/CheckUserLoggedIn";

import TrendingResumes from './pages/TrendingResumes.js';


// React Auth Kit
import createStore from 'react-auth-kit/createStore';
import AuthProvider from 'react-auth-kit';
const store = createStore({
  authName:'_auth',
  authType:'cookie',
  cookieDomain: window.location.hostname,
  cookieSecure: window.location.protocol === 'https:'
});

function App() {
  return (
    <AuthProvider store={store}>
      <BrowserRouter>
        <div className="App">
            <Routes>
              <Route path="/" element={<CheckUserLoggedIn/>} />
              <Route path="/swiping/:userId" element={<LandingPage/>} />
              <Route path="/upload-first-resume" element={<ResumeUpload/>} />
              <Route path="/test-page" element={<TestPage/>} />
              <Route path="/login-page" element={<LoginPage/>} />
              <Route path="/signup-page" element={<SignUpPage/>} />
              <Route path="/about-form" element={<AboutForm/>} />
              <Route path="/check-email" element={<CheckEmail />} />
              <Route path="/verification/:token" element={<VerificationPage/>} />
              <Route path="/preferences" element={<PreferencesPage />} />
              <Route path="/profile" element={<Profile/>} />
              <Route path="/TrendingResumes" element={<TrendingResumes/>} />
            </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

export default App;
