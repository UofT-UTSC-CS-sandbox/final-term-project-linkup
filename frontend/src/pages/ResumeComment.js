import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { useParams, useNavigate } from 'react-router-dom';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';

import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import '@react-pdf-viewer/core/lib/styles/index.css';
import './ResumeComment.css';
import HatefulCommentModal from '../components/MsgFilter';

const ResumeComment = () => {
    const { resumeId } = useParams();
    const navigate = useNavigate();
    const isAuthenticated = useIsAuthenticated();
    const auth = useAuthUser();
    const userId = auth.id; // Get user ID from auth
    const userName = auth.name; // Get user name from auth
    const [resume, setResume] = useState(null);
    const [uploaderName, setUploaderName] = useState('');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [highlightedText, setHighlightedText] = useState('');
    const [commentPosition, setCommentPosition] = useState(null);
    const [selectionRange, setSelectionRange] = useState(null);
    const [commentBoxVisible, setCommentBoxVisible] = useState(false);
    const [highlights, setHighlights] = useState([]);
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const [isModalOpen, setModalOpen] = useState(false);

    const viewerRef = useRef(null);
    const commentBoxRef = useRef(null);

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

                if (resumeData.uploader_id) {
                    const uploaderResponse = await axios.get(`http://localhost:3001/api/get-uploader-name/${resumeData.uploader_id}`);
                    setUploaderName(uploaderResponse.data.uploaderName);
                }
            } catch (error) {
                console.error('Failed to fetch resume or uploader name', error);
            }
        };

        const getComments = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/resume/${resumeId}/comments`);
                const userComments = response.data.filter(comment => comment.user === userName);
                setComments(userComments);
                const fetchedHighlights = userComments.map(comment => ({
                    position: comment.position,
                    highlightedText: comment.highlightedText,
                }));
                setHighlights(fetchedHighlights);
                console.log('Fetched highlights:', fetchedHighlights);
            } catch (error) {
                console.error('Failed to fetch comments', error);
            }
        };

        getResumeAndUploaderName();
        getComments();
    }, [resumeId, userName]);

    const handleCommentSubmit = async () => {
        if (!highlightedText || !commentPosition || !userId) return;

        const commentData = {
            user: userName,
            comment: newComment,
            highlightedText,
            position: {
                top: commentPosition.top,
                left: commentPosition.left,
                width: commentPosition.width,
                height: commentPosition.height
            }
        };

        try {
            const response = await axios.post(`http://localhost:3001/api/resume/${resumeId}/comments`, commentData);
            setComments(prevComments => [...prevComments, response.data]);
            setNewComment('');
            setHighlightedText('');
            setCommentPosition(null);
            setSelectionRange(null);
            setCommentBoxVisible(false);
            setHighlights(prevHighlights => [...prevHighlights, { position: commentPosition, highlightedText }]);
        } catch (error) {
            console.error('Error adding comment:', error);
            if (error.response && error.response.data.error === 'Your comment contains inappropriate language.') {
                setModalOpen(true); // Open the modal on error
            }
        }
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleTextSelection = useCallback(() => {
        const selection = window.getSelection();
        const selectedText = selection.toString();
        if (!selectedText) {
            return;
        }

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const viewerRect = viewerRef.current.getBoundingClientRect();
        const position = {
            top: ((rect.top - viewerRect.top) / viewerRect.height) * 100,
            left: ((rect.left - viewerRect.left) / viewerRect.width) * 100,
            width: (rect.width / viewerRect.width) * 100,
            height: (rect.height / viewerRect.height) * 100
        };

        console.log('Selected position:', position);

        setHighlightedText(selectedText);
        setCommentPosition(position);
        setCommentBoxVisible(true);
        setSelectionRange(range);

        // Add overlay immediately without duplicating
        if (!highlights.some(highlight => highlight.position.top === position.top && highlight.position.left === position.left)) {
            setHighlights(prevHighlights => [...prevHighlights, { position, highlightedText: selectedText }]);
        }
    }, [highlights]);

    const handleMouseUp = useCallback(() => {
        if (viewerRef.current.contains(window.getSelection().anchorNode)) {
            handleTextSelection();
        }
    }, [handleTextSelection]);

    const handleDismissCommentBox = useCallback(() => {
        setNewComment('');
        setHighlightedText('');
        setCommentPosition(null);
        setSelectionRange(null);
        setCommentBoxVisible(false);
        // Remove the last added highlight if comment is not submitted
        setHighlights(prevHighlights => prevHighlights.slice(0, -1));
    }, []);

    const handleClickOutside = useCallback((event) => {
        if (commentBoxRef.current && !commentBoxRef.current.contains(event.target)) {
            handleDismissCommentBox();
        }
    }, [handleDismissCommentBox]);

    const handleInputFocus = () => {
        if (selectionRange) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(selectionRange);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleClickOutside, handleMouseUp]);

    const handleFinishCommenting = async () => {
        try {
            if (!uploaderName) {
                console.error('Uploader name not found');
                return;
            }
            
            const messageText = `${userName} left ${comments.length} comments on your resume. Click to view comments.`;
            const messageContent = JSON.stringify({
                resumeUrl: `http://localhost:3001/bucket/files/${resume.file_path}`,
                resumeId: resume._id,  // Include resumeId
                commenter: userName,  
                text: messageText
            });
            const dmData = {
                to: uploaderName, // Adjust as per your data structure
                from: userName,
                timestamp: new Date().toLocaleString(),
                message: messageContent,
            };

            console.log('Sending DM with data:', dmData); // Debugging log

            await axios.post('http://localhost:3001/send-message', dmData);
            navigate('/swiping');
        } catch (error) {
            console.error('Error sending DM:', error);
        }
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
                    {commentBoxVisible && commentPosition && (
                        <div
                            className="comment-input-box"
                            style={{ top: `${commentPosition.top}%`, left: `${commentPosition.left + commentPosition.width + 1}%` }}
                            ref={commentBoxRef}
                        >
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                onFocus={handleInputFocus}
                            />
                            <button onClick={handleCommentSubmit}>Add Comment</button>
                        </div>
                    )}
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
            <button onClick={handleFinishCommenting} className="finish-commenting-button">Finish Commenting</button>
            <HatefulCommentModal
                isOpen={isModalOpen}
                onClose={closeModal}
            />
        </div>
    );
};

export default ResumeComment;
