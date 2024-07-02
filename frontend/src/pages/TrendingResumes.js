import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import logo from '../images/linkup_logo.png';
import './TrendingResumes.css';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import VisibilityIcon from '@mui/icons-material/Visibility';


function TrendingResumes() {
    const [resumes, setResumes] = useState([]);
    const pdfContainerRef = useRef(null);
    const [showInput, setShowInput] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState({});

    useEffect(() => {
        const fetchResumesTrending = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/resumes/public`);
                setResumes(response.data);
            } catch (error) {
                console.error('Failed to fetch public trending resumes', error);
            }
        };

        fetchResumesTrending();
    }, []);

    useEffect(() => {
        const container = pdfContainerRef.current;
        if (container) {
            const handleWheel = (e) => {
                e.preventDefault();
                container.scrollLeft += e.deltaX; // Horizontal scrolling
            };

            container.addEventListener('wheel', handleWheel, { passive: false });

            return () => {
                container.removeEventListener('wheel', handleWheel);
            };
        }
    }, []);

    const handleAddCommentClick = (id) => {
        setShowInput(prev => !prev);
    };

    return (
        <div className="container-trending">
            <div className="link-container">
                <a href="/profile" className="profile-link-trending">Your Profile</a>
                <a href="/TrendingResumes" className="Trending-link-trending">Trending Resumes</a>
            </div>
            <img src={logo} className="logo" alt="LinkUp Logo" />
            <div className="horizontal-scroll-trending" ref={pdfContainerRef}>
                {resumes.map((resume) => (
                    <div key={resume._id} className="pdf-and-comments-container"> 
                    <div className="resume-container">
                    <div className="resume-header">
                        <VisibilityIcon style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        <span style={{ verticalAlign: 'middle' }}>{resume.num_swipes} impressions</span>
                    </div>
                        <div className="pdf-item-trending">
                            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                                <Viewer
                                    fileUrl={`http://localhost:3001/bucket/files/${resume.file_path}`}
                                    defaultScale={1.0}
                                />
                            </Worker>
                        </div>
                    </div>
                        <div className="comments-container">
                            <button onClick={() => handleAddCommentClick(resume._id)} className="comment-button">
                                <AddIcon style={{ fontSize: 25, marginRight: 5, verticalAlign: 'middle'}} /> Leave a comment
                            </button>  
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TrendingResumes;
