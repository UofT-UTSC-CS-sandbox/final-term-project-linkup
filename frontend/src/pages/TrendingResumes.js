import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import logo from '../images/linkup_logo.png';
import './TrendingResumes.css'; // Ensure this CSS file contains appropriately named styles
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

function TrendingResumes() {
    const [resumes, setResumes] = useState([]);
    const pdfContainerRef = useRef(null); // Renamed from pdfContainerRef2 for consistency
    const userId = "6668b379930f4bfc3a165935";

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
        <div className="container-trending">
            <div className="link-container">
                <a href="/profile" className="profile-link-trending">Your Profile</a>
                <a href="/TrendingResumes" className="Trending-link-trending">Trending Resumes</a>
            </div>
            <img src={logo} className="logo" alt="LinkUp Logo" />
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

export default TrendingResumes;
