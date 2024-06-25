import React, {useEffect, useState, useRef} from "react";
import axios from "axios";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { useNavigate} from "react-router-dom";
import logo from '../images/linkup_logo_highquality.png';
import Sidebar from '../components/Sidebar.js'

// Routing and authentication
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'; 

const LandingPage = () => {
    const navigate = useNavigate();
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

    const [resumes, setResumes] = useState([]);
    const pdfContainerRef = useRef(null); 

    useEffect(() => {
        const fetchResumesTrending = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/resumes/${userId}`);
                setResumes(response.data);
            } catch (error) {
                console.error('Failed to fetch resumes', error);
            }
        };

        fetchResumesTrending();
    }, []);

    useEffect(() => {
        const container = pdfContainerRef.current; // Corrected reference name
        const handleWheel = (e) => {
            e.preventDefault();
            container.scrollLeft += e.deltaX; // Horizontal scrolling
        };

        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, []);

    return (
    <div className="container">
      <div className="app-logo-container"> 
        <a href="/">
          <img src={logo} className="logo" alt="LinkUp Logo" />
        </a> 
      </div>
      <Sidebar></Sidebar>
      <div className="horizontal-scroll-trending" ref={pdfContainerRef}>
            {resumes.map((resume) => (
                    <div key={resume._id} className="pdf-item-trending">
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                            <Viewer
                                fileUrl={`http://localhost:3001/bucket/files/${resume.file_path}`}
                                defaultScale={1.0}
                            />
                        </Worker>
                    </div>
                ))}
            </div>
    </div>
    );
}
export default LandingPage;