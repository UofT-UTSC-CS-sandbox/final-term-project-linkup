import React, { useEffect, useState } from 'react';
import { useNavigate,Link, useParams } from "react-router-dom";
import axios from "axios";
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import './MatchPage.css';
function MatchPage() {
  const {resumeId} = useParams();
  const navigate = useNavigate();
  const [matchedResume, setMatchedResume] = useState(null);
 
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

  if (!matchedResume) {
      return <div>Loading...</div>; // Add a loading state while fetching data
  }

  return(
    <div className="match-container">
      <h1 className="match-title">Linked Up!</h1>
      <p>You two have swiped right on each other.</p>
      <div className="pdf-item-match">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
              <Viewer
                  fileUrl={`http://localhost:3001/bucket/files/${matchedResume.file_path}`}
                  defaultScale={0.3}
              />
          </Worker>
      </div>
      <div className="match-button-container"> 
        <button onClick={() => navigate('/swiping')}>
          Keep Swiping
        </button>
        <button onClick={() => navigate(`/resume-comment/${matchedResume._id}`)}>
            Start a Conversation
        </button>
      </div>
    </div>
  ) 
}

  export default MatchPage;
