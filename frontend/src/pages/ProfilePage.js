import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import logo from '../images/linkup_logo_highquality.png';
import ResumeUploadModal from './UploadPopUp';
import useZoomModal from '../hooks/useZoomModal';
import './ProfilePage.css'; 

// Routing and authentication
import { useNavigate } from "react-router-dom";
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const Profile = () => {
// State management for resumes, modal visibility, selected resume for deletion, and user preferences
  const [resumes, setResumes] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [preferences, setPreferences] = useState({});
  const pdfContainerRef = useRef(null);
  //const userId = "6668b379930f4bfc3a165935";
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser();
  const userId = auth.id;
  const [openZoomModal, ZoomModal] = useZoomModal();

    // Fetch resumes from the server for the logged-in user
    const fetchResumes = async () => {
        if (!userId) return;  
        try {
            const response = await axios.get(`http://localhost:3001/resumes/${userId}`);
            setResumes(response.data);
        } catch (error) {
            console.error('Error fetching resumes:', error);
        }
    };

    // Redirect to login if not authenticated and fetch data on component mount
    useEffect(() => {
        if(!isAuthenticated) {
            navigate('/login-page');
        }retrievePreferences();
        fetchResumes();
    }, [userId]);

    // Handle horizontal scrolling of PDF container via mouse wheel
    useEffect(() => {
    const container = pdfContainerRef.current;
    const handleWheel = (e) => {
        e.preventDefault();
        container.scrollLeft += e.deltaX;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
        container.removeEventListener('wheel', handleWheel);
    };
    }, []);
  
  // Refresh resumes on successful upload
  const handleResumeUploadSuccess = (newResume) => {
    console.log('Adding new resume:', newResume);
    fetchResumes();
  };

  // Open/close modals for resume upload and deletion
  const handleAddResumeClick = () => {
      setIsUploadModalOpen(true);
  };

  const closeModal = () => {
      setIsUploadModalOpen(false);
  };

  const openDeleteModal = (resume) => {
      setResumeToDelete(resume);
      setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
      setIsDeleteModalOpen(false);
      setResumeToDelete(null);
  };

  // Delete a resume from the server and update UI accordingly
  const handleDeleteResume = async () => {
    if (!resumeToDelete) {
        console.log('No resume selected for deletion');
        return;
    }

    const currentResumeToDelete = resumeToDelete;
    setResumes(prevResumes => prevResumes.filter(resume => resume._id !== currentResumeToDelete._id));
    closeDeleteModal();
    try {
        const response = await axios.post(`http://localhost:3001/delete-resumes`, {
            resumeIds: [currentResumeToDelete._id]
        });
        if (response.status !== 200) {
            console.error('Delete failed, reverting UI', response.status);
            setResumes(prevResumes => [...prevResumes, currentResumeToDelete]); // Re-add the deleted item
        }
    } catch (error) {
        console.error('Error deleting resume:', error);
        setResumes(prevResumes => [...prevResumes, currentResumeToDelete]);
    }
  };

  // Communicating Email and password to server
  const retrievePreferences = async () => {

      try {
        const response = await fetch('http://localhost:3001/getPreferences', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({email : auth.email})
        });
  
        if (response.ok) {
          const retrievedPref = await response.json();
          setPreferences(retrievedPref);

        } else {
          console.error('Error retrieving');
        }
      } catch (error) {
        console.error('Error:', error);
      }
  };

    return (
        <div className="profile-container">
            <header className="profile-header">
                <img src={logo} alt="LinkUp Logo" className="profile-logo" />
            </header>
            <div className="profile-content">
                <div className="blue-header"></div>
                <div className="profile-icon-section">
                    <div className="profile-icon-placeholder"></div>
                    <div className="username"> {auth.name} </div>
                    <button className="settings-button">
                        <SettingsIcon />
                        Settings
                    </button>
                </div>
                <div className="horizontal-container">
                    <div className="vertical-line"></div>
                    <div className="fields-container">
                        <div className="profile-info">MY INFORMATION</div>
                        <div className="field-label">Industry: {preferences.field_of_interest}</div>
                        <div className="field-label">Location: {preferences.location} </div>
                        <div className="field-label">Education: {preferences.education} </div>
                        <div className="field-label">Public Resume:</div>
                    </div>
                </div>
                <div className="uploads-container">
                    <div className="uploads-info">MY UPLOADS</div>
                    <hr className="uploads-divider" />
                    <div className="horizontal-scroll" ref={pdfContainerRef}>
                        {resumes.map((resume) => (
                            <div key={resume._id} className="pdf-item" onClick={() => openZoomModal(resume)}>
                                <embed className="pdf-embed" src={`http://localhost:3001/bucket/files/${resume.file_path}`} type="application/pdf" />
                                <DeleteIcon 
                                    className="delete-icon"
                                    onClick={(e) => { e.stopPropagation(); openDeleteModal(resume); }}
                                />
                            </div>
                            
                        ))}
                        <div className="pdf-item add-resume" onClick={handleAddResumeClick}>
                            <span className="plus-sign">+</span>
                        </div>
                    </div>
                </div>
            </div>
            {isUploadModalOpen && (<ResumeUploadModal closeModal={closeModal} onUploadSuccess={handleResumeUploadSuccess} />
      )}
            {isDeleteModalOpen && (
            <div className="modal-overlay-delete">
                <div className="modal-content-delete">
                    <h2 className="modal-header-delete">Are you sure you want to delete this resume?</h2>
                    <p>This item will be deleted immediately with the data (comments, conversations, etc.) related to it. <br /> You can’t undo this action.</p>
                    <div className="modal-buttons-delete">
                        <button className="cancel-button-delete modal-button-delete" onClick={closeDeleteModal}>Cancel</button>
                        <button className="delete-button-delete modal-button-delete" onClick={handleDeleteResume}>Delete</button>
                    </div>
                </div>
            </div>
        )}
        <ZoomModal />
        </div>
    );
};

export default Profile;
