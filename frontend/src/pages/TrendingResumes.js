import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import logo from '../images/linkup_logo_highquality.png';
import './TrendingResumes.css';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import AddIcon from '@mui/icons-material/Add';
import SendIcon from '@mui/icons-material/Send';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Sidebar from '../components/Sidebar.js';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import HatefulCommentModal from '../components/MsgFilter';

function TrendingResumes() {
    const [resumes, setResumes] = useState([]);
    const pdfContainerRef = useRef(null);
    const [activeCommentInput, setActiveCommentInput] = useState(null);
    const [comments, setComments] = useState({});
    const [commentInputs, setCommentInputs] = useState({});
    const auth = useAuthUser();
    const [votes, setVotes] = useState({});
    const [voteStatus, setVoteStatus] = useState({});
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetchResumesTrending = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/resumes/public`);
                setResumes(response.data);
                response.data.forEach(resume => {
                    fetchComments(resume._id);
                });
            } catch (error) {
                console.error('Failed to fetch public trending resumes', error);
            }
        };
    
        fetchResumesTrending();
    }, []);
    
    const fetchVoteStatus = async (commentId, userId) => {
        try {
            const response = await axios.get('http://localhost:3001/comments/vote-status', {
                params: { userId, commentId }
            });
            setVoteStatus(prev => ({
                ...prev,
                [commentId]: response.data.voteType === 1 ? 'up' : response.data.voteType === -1 ? 'down' : null
            }));
        } catch (error) {
            console.error('Error fetching vote status:', error);
        }
    };
    
    const fetchComments = async (resumeId) => {
        try {
            const response = await axios.get(`http://localhost:3001/api/trending/get-comments/${resumeId}`);
            const commentsData = response.data;
            const newVotes = {};
            const userId = auth.id; // Ensure you are correctly retrieving the user's ID
            commentsData.forEach(comment => {
                newVotes[comment._id] = comment.votes;
                if (userId) {
                    fetchVoteStatus(comment._id, userId);
                }
            });

            commentsData.sort((a, b) => {
                const votesA = newVotes[a._id] || 0;
                const votesB = newVotes[b._id] || 0;
                return votesB - votesA;
            });
    
            setComments(prev => ({ ...prev, [resumeId]: commentsData }));
            setVotes(prev => ({ ...prev, ...newVotes }));
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };    
    
    const handleAddCommentClick = (resumeId) => {
        setActiveCommentInput(resumeId === activeCommentInput ? null : resumeId);
    };

    const handleCommentChange = (text, resumeId) => {
        setCommentInputs(prev => ({ ...prev, [resumeId]: text }));
    };

    const handleCommentSubmit = async (event, resumeId) => {
        event.preventDefault();
        const text = commentInputs[resumeId];
        if (!text) return;

        try {
            const username = auth.name;
            const response = await axios.post('http://localhost:3001/trending/post-comments', {
                resumeId,
                text,
                username
            });
            const updatedComments = comments[resumeId] ? [...comments[resumeId], response.data] : [response.data];
            setComments({ ...comments, [resumeId]: updatedComments });
            setCommentInputs(prev => ({ ...prev, [resumeId]: '' }));
            setActiveCommentInput(null);
        } catch (error) {
            console.error('Failed to post comment:', error);
            // Handle specific error response for inappropriate language
            if (error.response && error.response.data.error === "Your comment contains inappropriate language.") {
                setModalOpen(true); // Open the modal on error
            } else {
                console.error('Failed to post comment:', error);
            }
        }
    };

    const closeModal = () => {
        setModalOpen(false);
    };
    
    const handleVote = async (commentId, type) => {
        const userId = auth.id; // Ensure user ID is correctly retrieved
        if (!userId) {
            console.error("User ID is missing");
            alert("Please log in to vote.");
            return;
        }
    
        const currentVote = voteStatus[commentId]; // Get the current vote status for this comment
        let newVoteType = 0; // Default to no vote
        let delta = 0; // Change in vote count
    
        switch (type) {
            case 'up':
                if (currentVote === 'up') {
                    delta = -1;
                    newVoteType = 0;
                } else {
                    delta = currentVote === 'down' ? 2 : 1;
                    newVoteType = 1;
                }
                break;
            case 'down':
                if (currentVote === 'down') {
                    delta = 1;
                    newVoteType = 0;
                } else {
                    delta = currentVote === 'up' ? -2 : -1;
                    newVoteType = -1;
                }
                break;
        }
    
        console.log(`Current vote: ${currentVote}, New vote type: ${newVoteType}, Delta: ${delta}`);

        // Optimistically update UI
        setVotes(prevVotes => ({
            ...prevVotes,
            [commentId]: (prevVotes[commentId] || 0) + delta
        }));

        setVoteStatus(prevStatus => ({
            ...prevStatus,
            [commentId]: newVoteType === 0 ? null : type
        }));
    
        try {
            await axios.post('http://localhost:3001/api/comments/vote', {
                userId,
                commentId,
                voteType: newVoteType
            });
            console.log('Vote updated successfully');
        } catch (error) {
            console.error('Failed to update vote:', error);
            // Roll back optimistic updates in case of a server error
            setVotes(prevVotes => ({
                ...prevVotes,
                [commentId]: (prevVotes[commentId] || 0) - delta
            }));
            setVoteStatus(prevStatus => ({
                ...prevStatus,
                [commentId]: currentVote
            }));
        }
    };    

    return (
        <div className="container-trending">
            <div className="app-logo-container">
                <a href="/">
                    <img src={logo} className="logo" alt="LinkUp Logo" />
                </a>
            </div>
            <Sidebar />
            <div className="horizontal-scroll-trending" ref={pdfContainerRef}>
                {resumes.map((resume) => (
                    <div key={resume._id} className="pdf-and-comments-container">
                        <div className="resume-container">
                            <div className="resume-header">
                                <VisibilityIcon style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                                <span style={{ verticalAlign: 'middle' }}>{resume.num_swipes} impressions</span>
                            </div>
                            <div className="pdf-item-trending">
                                <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                                    <Viewer
                                        fileUrl={`http://localhost:3001/bucket/files/${resume.file_path}`}
                                        defaultScale={1.0}
                                    />
                                </Worker>
                            </div>
                        </div>
                        <div className="comments-container">
                            <div className="comments-list">
                                {comments[resume._id] && comments[resume._id].map((comment, index) => (
                                    <div key={index} className="comment-item">
                                        <div className="comment-details">
                                            <div className="icon-holder"></div>
                                            <div className="comment-username">{comment.username}</div>
                                            <div className="comment-text">{comment.text}</div>
                                            <div className="comment-votes">
                                                <ArrowUpwardIcon
                                                    onClick={() => handleVote(comment._id, 'up')}
                                                    style={{
                                                        cursor: 'pointer',
                                                        color: voteStatus[comment._id] === 'up' ? '#6495ED' : 'grey'
                                                    }}
                                                />
                                                <span>{votes[comment._id] || 0}</span>
                                                <ArrowDownwardIcon
                                                    onClick={() => handleVote(comment._id, 'down')}
                                                    style={{
                                                        cursor: 'pointer',
                                                        color: voteStatus[comment._id] === 'down' ? 'red' : 'grey'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {activeCommentInput === resume._id && (
                                    <form onSubmit={(e) => handleCommentSubmit(e, resume._id)} className="comment-input-container">
                                        <input
                                            type="text"
                                            className="comment-input"
                                            value={commentInputs[resume._id] || ''}
                                            onChange={(e) => handleCommentChange(e.target.value, resume._id)}
                                            placeholder="Type your comment here..."
                                        />
                                        <button type="submit" className="comment-submit-button">
                                            <SendIcon />
                                        </button>
                                    </form>
                                )}
                                <button onClick={() => handleAddCommentClick(resume._id)} className="comment-button">
                                    <AddIcon style={{ fontSize: 25, marginRight: 5, verticalAlign: 'middle' }} /> Leave a comment
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <HatefulCommentModal
                isOpen={isModalOpen}
                onClose={closeModal}
            />
        </div>
    );
}

export default TrendingResumes;
