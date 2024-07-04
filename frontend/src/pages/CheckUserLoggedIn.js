import React, {useEffect, useState, useRef} from "react";
import axios from "axios";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { useNavigate} from "react-router-dom";
import logo from '../images/linkup_logo_highquality.png';
import Sidebar from '../components/Sidebar.js'

// Routing and authentication
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'; 

const CheckUserLoggedIn = () => {
    const navigate = useNavigate();
    const isAuthenticated = useIsAuthenticated();
    const auth = useAuthUser();
    console.log(auth);

    
    // Redirect user to login page if not authenticated
    useEffect(() => {
        if(!isAuthenticated) {
            navigate('/login-page');
        } else {
            const userId = auth.id;
            navigate('/swiping');
        }
    }, [isAuthenticated, navigate]);
}

export default CheckUserLoggedIn;