import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ProfilePage.css'; // Make sure to import the CSS file

const Profile = () => {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedResumes, setSelectedResumes] = useState([]);
  const userId = "6668b379930f4bfc3a165935";
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/resumes/${userId}`);
        setResumes(response.data);
      } catch (error) {
        console.error('Error fetching resumes:', error);
      }
    };

    fetchResumes();
  }, []);

  const openModal = (resume) => {
    setSelectedResume(resume);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedResume(null);
    setIsModalOpen(false);
  };

  const handleAddResumeClick = () => {
    navigate('/upload'); // Navigate to the ResumeUpload page
  };

  const toggleDeleteMode = () => {
    setIsDeleteMode(!isDeleteMode);
    setSelectedResumes([]);
  };

  const handleResumeSelect = (resumeId) => {
    setSelectedResumes(prevSelectedResumes => {
      if (prevSelectedResumes.includes(resumeId)) {
        return prevSelectedResumes.filter(id => id !== resumeId);
      } else {
        return [...prevSelectedResumes, resumeId];
      }
    });
  };

  const handleConfirmDeletion = async () => {
    try {
      // Delete resumes from backend
      await axios.post('http://localhost:3001/delete-resumes', { resumeIds: selectedResumes });

      // Update resumes state
      setResumes(prevResumes => prevResumes.filter(resume => !selectedResumes.includes(resume._id)));
      setSelectedResumes([]);
      setIsDeleteMode(false);
    } catch (error) {
      console.error('Error deleting resumes:', error);
    }
  };

  return (
    <div>
      <h2>Your Resumes</h2>
      <div className="button-container">
        <button onClick={toggleDeleteMode} className="delete-resumes-btn">
          {isDeleteMode ? 'Cancel' : 'Delete Resumes'}
        </button>
        {isDeleteMode && selectedResumes.length > 0 && (
          <button onClick={handleConfirmDeletion} className="confirm-deletion-btn">
            Confirm Deletion
          </button>
        )}
      </div>
      <div className="pdf-container">
        {resumes.map((resume) => (
          <div key={resume._id} className={`pdf-item ${isDeleteMode ? 'selectable' : ''}`} onClick={() => isDeleteMode ? handleResumeSelect(resume._id) : openModal(resume)}>
            <embed className="pdf-embed" src={`http://localhost:3001/bucket/files/${resume.file_path}`} type="application/pdf" />
            {isDeleteMode && (
              <input
                type="checkbox"
                className="resume-checkbox"
                checked={selectedResumes.includes(resume._id)}
                onChange={() => handleResumeSelect(resume._id)}
              />
            )}
          </div>
        ))}
        <div className="pdf-item add-resume" onClick={handleAddResumeClick}>
          <span className="plus-sign">+</span>
        </div>
      </div>
      
      {isModalOpen && selectedResume && (
        <div id="myModal" className="modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <embed src={`http://localhost:3001/bucket/files/${selectedResume.file_path}`} width="100%" height="600px" type="application/pdf" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
