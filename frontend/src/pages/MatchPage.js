import React, { useEffect, useState } from 'react';
import { useNavigate,Link, useParams } from "react-router-dom";
import axios from "axios";
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import './MatchPage.css';
import message from '../images/match-message-icon.png';
import swipe from '../images/match-swiping-icon.png';

function MatchPage() {
  const {resumeId} = useParams();
  const navigate = useNavigate();
  const [matchedResume, setMatchedResume] = useState(null);
  const [matchedUsername, setMatchedUsername] = useState(null);
 
  useEffect(() => {
    const getResume = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/resume/${resumeId}`);
        const resume = response.data;
        setMatchedResume(resume);
      } catch (error) {
        console.error('Failed to fetch resume', error);
      }
    };
    getResume();
  }, [resumeId]); // Dependency array ensures useEffect runs only when resumeId changes

  useEffect(() => {
    console.log(matchedResume);
    if (matchedResume) {
      const getUsernameofMatch = async () => {
        try {
          const userResponse = await axios.get(`http://localhost:3001/api/user/${matchedResume.uploader_id}`);
          const user = userResponse.data;
          setMatchedUsername(user);
        } catch (error) {
          console.error('Failed to fetch user', error);
        }
      };
      getUsernameofMatch();
    }
  }, [matchedResume]); // Dependency array ensures useEffect runs only when matchedResume changes

  if (!matchedResume) {
      return <div>Loading...</div>; // Add a loading state while fetching data
  }

  return(
    <div className="container">
      <h1 className="match-title">Linked Up!</h1>
      <p className="match-desc">You two have swiped right on each other!</p>
      <p className="match-anon-username">{matchedUsername ? matchedUsername.anon_username : 'Loading username...'}</p>
      <div className="pdf-item-match">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
              <Viewer
                  fileUrl={`http://localhost:3001/bucket/files/${matchedResume.file_path}`}
                  defaultScale={1.0}
              />
          </Worker>
      </div>
      <div className="match-button-container"> 
        <button className="start-convo-button" onClick={() => navigate(`/resume-comment/${matchedResume._id}`)}>
            <img src={message} className="message-icon" alt="match-message-icon" />
            Start a Conversation
        </button>
        <button className="keep-swiping-button" onClick={() => navigate('/swiping')}>
          <img src={swipe} className="swiping-icon" alt="match-swiping-icon" />
          Keep Swiping
        </button>
      </div>
    </div>
  ) 
}

  export default MatchPage;
