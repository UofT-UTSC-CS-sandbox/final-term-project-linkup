import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { useParams, useNavigate } from 'react-router-dom';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import '@react-pdf-viewer/core/lib/styles/index.css';
import './ViewResumeComments.css';

const ViewResumeComments = () => {
    const { resumeId, commenter } = useParams(); // Add `commenter` to parameters
    const navigate = useNavigate();
    const isAuthenticated = useIsAuthenticated();
    const auth = useAuthUser();
    const [resume, setResume] = useState(null);
    const [comments, setComments] = useState([]);
    const [highlights, setHighlights] = useState([]);
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const viewerRef = useRef(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login-page');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const getResumeAndUploaderName = async () => {
            try {
                const resumeResponse = await axios.get(`http://localhost:3001/api/resume/${resumeId}`);
                const resumeData = resumeResponse.data;
                setResume(resumeData);
            } catch (error) {
                console.error('Failed to fetch resume', error);
            }
        };

        const getComments = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/resume/${resumeId}/comments`);
                const userComments = response.data.filter(comment => comment.user === commenter); // Filter by commenter
                setComments(userComments);
                const fetchedHighlights = userComments.map(comment => ({
                    position: comment.position,
                    highlightedText: comment.highlightedText,
                }));
                setHighlights(fetchedHighlights);
            } catch (error) {
                console.error('Failed to fetch comments', error);
            }
        };

        getResumeAndUploaderName();
        getComments();
    }, [resumeId, commenter]);

    const handleFinishViewing = () => {
        navigate('/direct-messages');
    };

    if (!resume) {
        return <div>Loading...</div>;
    }

    return (
        <div className="resume-comment-container">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                <div className="pdf-viewer-container" ref={viewerRef}>
                    <Viewer fileUrl={`http://localhost:3001/bucket/files/${resume.file_path}`} defaultScale={SpecialZoomLevel.PageWidth} />
                    {highlights.map((highlight, index) => (
                        <div
                            key={index}
                            className={`highlight-overlay ${selectedCommentId === index ? 'selected-highlight' : ''}`}
                            style={{
                                top: `${highlight.position.top}%`,
                                left: `${highlight.position.left}%`,
                                width: `${highlight.position.width}%`,
                                height: `${highlight.position.height}%`,
                                backgroundColor: selectedCommentId === index ? 'green' : 'yellow'
                            }}
                        ></div>
                    ))}
                </div>
            </Worker>
            <div className="comments-section">
                <ul>
                    {comments.map((comment, index) => (
                        <li 
                            key={comment._id} 
                            className={`comment-box ${selectedCommentId === index ? 'selected-comment' : ''}`} 
                            style={{ top: `${comment.position.top}%` }}
                            onClick={() => {
                                const highlight = highlights.find(h => h.highlightedText === comment.highlightedText);
                                if (highlight) {
                                    const highlightElement = document.querySelector(`.highlight-overlay:nth-child(${highlights.indexOf(highlight) + 1})`);
                                    if (highlightElement) {
                                        window.scrollTo({
                                            top: highlightElement.offsetTop,
                                            behavior: 'smooth'
                                        });
                                    }
                                    setSelectedCommentId(index);
                                }
                            }}
                        >
                            <div className="comment-user">
                                <div className="avatar">{comment.user[0]}</div>
                                {comment.user}
                            </div>
                            <div className="comment-text">{comment.comment}</div>
                        </li>
                    ))}
                </ul>
            </div>
            <button onClick={handleFinishViewing} className="finish-viewing-button">Finish Viewing</button>
        </div>
    );
};

export default ViewResumeComments;
