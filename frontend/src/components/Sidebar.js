import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from '../images/linkup_logo.png';
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
            <a href="/profile" className="sidebar-link">Your Profile</a>
            <a href="/TrendingResumes" className="sidebar-link">Trending Resumes</a>
            <a href="/direct-messages" className="sidebar-link">Conversations</a>
            <a href= "/login-page" className="sidebar-link" onClick={signOutAndRedirect}>Sign Out</a>
        </div>
    );
}

export default Sidebar;