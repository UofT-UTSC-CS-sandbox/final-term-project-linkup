// frontend/src/pages/ViewComments.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Worker, Viewer, SpecialZoomLevel } from '@react-pdf-viewer/core';
import { useParams } from 'react-router-dom';
import '@react-pdf-viewer/core/lib/styles/index.css';
import './ResumeComment.css';

const ViewComments = () => {
    const { resumeId } = useParams();
    const [resume, setResume] = useState(null);
    const [comments, setComments] = useState([]);
    const [highlights, setHighlights] = useState([]);
    const viewerRef = useRef(null);

    useEffect(() => {
        const getResume = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/resume/${resumeId}`);
                setResume(response.data);
            } catch (error) {
                console.error('Failed to fetch resume', error);
            }
        };

        const getComments = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/api/resume/${resumeId}/comments`);
                setComments(response.data);
                const fetchedHighlights = response.data.map(comment => ({
                    position: comment.position,
                }));
                setHighlights(fetchedHighlights);
                console.log('Fetched highlights:', fetchedHighlights); // Log the highlights
            } catch (error) {
                console.error('Failed to fetch comments', error);
            }
        };

        getResume();
        getComments();
    }, [resumeId]);

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
                            className="highlight-overlay"
                            style={{
                                top: highlight.position.top,
                                left: highlight.position.left,
                                width: highlight.position.width,
                                height: highlight.position.height
                            }}
                        ></div>
                    ))}
                </div>
            </Worker>
            <div className="comments-section">
                <ul>
                    {comments.map((comment) => (
                        <li key={comment._id} className="comment-box" style={{ top: comment.position.top }}>
                            <div className="comment-user">
                                <div className="avatar">{comment.user[0]}</div>
                                {comment.user}
                            </div>
                            <div className="comment-text">{comment.comment}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ViewComments;
