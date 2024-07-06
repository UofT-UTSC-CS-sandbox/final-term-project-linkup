import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from 'react-router-dom';
import logo from '../images/linkup_logo.png';
import './Sidebar.css';
// Routing and authentication

import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'; 
import useSignOut from 'react-auth-kit/hooks/useSignOut';

const Sidebar = () => {
    const navigate = useNavigate();
    const signOut = useSignOut();
    const isAuthenticated = useIsAuthenticated();
    const auth = useAuthUser();
    console.log(auth);
    const location = useLocation();
    const userId = auth.id;
    
    // Redirect user to login page if not authenticated
    useEffect(() => {
        if(!isAuthenticated) {
        navigate('/login-page');
        }
    });

    const signOutAndRedirect = () => {
        signOut();
    };

    return (
        <div className="upload-link-container">
            <Link to="/profile" className={`sidebar-link ${location.pathname === '/profile' ? 'active' : ''}`}>Your Profile</Link>
            <Link to="/TrendingResumes" className={`sidebar-link ${location.pathname === '/TrendingResumes' ? 'active' : ''}`}>Trending Resumes</Link>
            <Link to="/login-page" className={`sidebar-link ${location.pathname === '/login-page' ? 'active' : ''}`} onClick={signOutAndRedirect}>Sign Out</Link>
        </div>
    );
}

export default Sidebar;