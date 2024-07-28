import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { useNavigate } from 'react-router-dom';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import '@react-pdf-viewer/core/lib/styles/index.css';
import Sidebar from '../components/Sidebar';
import './ReviewedResumes.css';

const ReviewedResumes = () => {
    const navigate = useNavigate();
    const isAuthenticated = useIsAuthenticated();
    const auth = useAuthUser();
    const [resumeUserComments, setResumeUserComments] = useState([]);
    const [selectedResumeIndex, setSelectedResumeIndex] = useState(0);
    const [selectedCommenter, setSelectedCommenter] = useState('');
    const [comments, setComments] = useState([]);
    const [highlights, setHighlights] = useState([]);
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const pdfViewerRef = useRef(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login-page');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const fetchResumesWithComments = async () => {
            try {
                const userId = auth.id;
                const response = await axios.get(`http://localhost:3001/resumes/${userId}/reviewed`);
                const resumesWithComments = response.data.filter(resume => resume.comments.length > 0);
                setResumeUserComments(resumesWithComments);
            } catch (error) {
                console.error('Failed to fetch resumes with comments', error);
            }
        };

        fetchResumesWithComments();
    }, [auth]);

    useEffect(() => {
        if (resumeUserComments.length > 0) {
            const selectedResume = resumeUserComments[selectedResumeIndex];
            const commenters = [...new Set(selectedResume.comments.map(comment => comment.user))];
            setSelectedCommenter(commenters[0]);

            const userComments = selectedResume.comments.filter(comment => comment.user === commenters[0]);
            setComments(userComments);

            const fetchedHighlights = userComments.map(comment => ({
                position: comment.position,
                highlightedText: comment.highlightedText,
            }));
            setHighlights(fetchedHighlights);
        }
    }, [resumeUserComments, selectedResumeIndex]);

    const handleResumeChange = (direction) => {
        setSelectedResumeIndex(prevIndex => {
            const newIndex = prevIndex + direction;
            return (newIndex + resumeUserComments.length) % resumeUserComments.length;
        });
    };

    const handleCommenterChange = (direction) => {
        const selectedResume = resumeUserComments[selectedResumeIndex];
        const commenters = [...new Set(selectedResume.comments.map(comment => comment.user))];
        const currentIndex = commenters.indexOf(selectedCommenter);
        const newIndex = (currentIndex + direction + commenters.length) % commenters.length;
        setSelectedCommenter(commenters[newIndex]);

        const userComments = selectedResume.comments.filter(comment => comment.user === commenters[newIndex]);
        setComments(userComments);

        const fetchedHighlights = userComments.map(comment => ({
            position: comment.position,
            highlightedText: comment.highlightedText,
        }));
        setHighlights(fetchedHighlights);
    };

    if (!resumeUserComments.length) {
        return <div>No resumes with comments found.</div>;
    }

    const selectedResume = resumeUserComments[selectedResumeIndex];

    return (
        <div className="resume-comment-container-2">
            <Sidebar />
            <div className="main-content-2">
                <div className="navigation-bar-2">
                    <button className="nav-button-2" onClick={() => handleResumeChange(-1)}>&lt;</button>
                    <span className="nav-text-2">Select Resume to View</span>
                    <button className="nav-button-2" onClick={() => handleResumeChange(1)}>&gt;</button>
                </div>
                <div className="commenter-navigation-bar-2">
                    <button className="nav-button-2" onClick={() => handleCommenterChange(-1)}>&lt;</button>
                    <span className="nav-text-2">Comments by: {selectedCommenter}</span>
                    <button className="nav-button-2" onClick={() => handleCommenterChange(1)}>&gt;</button>
                </div>
                {selectedResume && selectedResume.file_path && (
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                        <div className="pdf-viewer-container-2" ref={pdfViewerRef}>
                            <Viewer
                                fileUrl={`http://localhost:3001/bucket/files/${selectedResume.file_path}`}
                                defaultScale={SpecialZoomLevel.PageWidth}
                            />
                            {highlights.map((highlight, index) => (
                                <div
                                    key={index}
                                    className={`highlight-overlay-2 ${selectedCommentId === index ? 'selected-highlight-2' : ''}`}
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
                )}
                <div className="comments-section-2">
                    <ul>
                        {comments.map((comment, index) => (
                            <li
                                key={comment._id}
                                className={`comment-box-2 ${selectedCommentId === index ? 'selected-comment-2' : ''}`}
                                style={{ top: `${comment.position.top}%`}}
                                onClick={() => {
                                    const highlight = highlights.find(h => h.highlightedText === comment.highlightedText);
                                    if (highlight) {
                                        const highlightElement = document.querySelector(`.highlight-overlay-2:nth-child(${highlights.indexOf(highlight) + 1})`);
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
                                <div className="comment-user-2">
                                    <div className="avatar-2">{comment.user[0]}</div>
                                    {comment.user}
                                </div>
                                <div className="comment-text-2">{comment.comment}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ReviewedResumes;
