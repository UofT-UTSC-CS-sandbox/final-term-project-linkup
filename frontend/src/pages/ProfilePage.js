import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import logo from '../images/linkup_logo_highquality.png';
import ResumeUploadModal from './UploadPopUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import useZoomModal from '../hooks/useZoomModal';
import './ProfilePage.css'; 
import Sidebar from '../components/Sidebar.js';

// Profile Pics
import bearTwemoji from '../images/profilePics/bearTwemoji.png';
import bunnyTwemoji from '../images/profilePics/bunnyTwemoji.png';
import catTwemoji from '../images/profilePics/catTwemoji.png';
import cowTwemoji from '../images/profilePics/cowTwemoji.png';
import dogTwemoji from '../images/profilePics/dogTwemoji.png';
import horseTwemoji from '../images/profilePics/horseTwemoji.png';
import pigTwemoji from '../images/profilePics/pigTwemoji.png';
import tigerTwemoji from '../images/profilePics/tigerTwemoji.png';
import { extractColors } from 'extract-colors'

// Routing and authentication
import { useNavigate } from "react-router-dom";
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser';

const Profile = () => {
// State management for resumes, modal visibility, selected resume for deletion, and user bio
  const [resumes, setResumes] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [resumeToDelete, setResumeToDelete] = useState(null);
  const [bio, setBio] = useState({});
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notificationHeader, setNotificationHeader] = useState('');
  const [notificationBody, setNotificationBody] = useState('');
  const pdfContainerRef = useRef(null);
  //const userId = "6668b379930f4bfc3a165935";
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const auth = useAuthUser();
  const [currProfilePic, setCurrProfilePic] = useState('');
  var userId = null;
  const [openZoomModal, ZoomModal] = useZoomModal();

  // A dictionary that maps profile picture STRINGS to IMAGES
  const profilePicDictionary = {
      "bearTwemoji.png": bearTwemoji,
      "bunnyTwemoji.png": bunnyTwemoji,
      "catTwemoji.png": catTwemoji,
      "cowTwemoji.png": cowTwemoji,
      "dogTwemoji.png": dogTwemoji,
      "horseTwemoji.png": horseTwemoji,
      "pigTwemoji.png": pigTwemoji,
      "tigerTwemoji.png": tigerTwemoji
  };

  // Profile pic background colour
  const [bgColor, setBgColor] = useState('#D0D0D0'); // Default grey color

  function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  useEffect(() => {
    const loadImageAndExtractColor = async () => {
      try {
        const imgSrc = profilePicDictionary[currProfilePic];
        if (imgSrc) {
          const img = new Image();
          img.src = imgSrc;
          img.crossOrigin = 'anonymous';

          img.onload = async () => {
            try {
              const returnedColors = await extractColors(imgSrc);
              const colors = returnedColors.sort((a, b) => b.area - a.area); // Sorting by most prominent colors
              if (colors.length > 0) {
                const { hue, saturation, lightness } = colors[0];
                const adjustedSaturation = Math.max(0, saturation - 0.15); // Lower the saturation
                const adjustedLightness = Math.min(0.7, lightness + 0.15); // Increase the brightness
                const adjustedColor = hslToHex(
                  hue * 360, // Convert hue to degrees
                  adjustedSaturation * 100, // Convert to percentage
                  adjustedLightness * 100 // Convert to percentage
                );
                setBgColor(adjustedColor);
              }
            } catch (err) {
              console.error('Error extracting color:', err);
            }
          };

          img.onerror = (err) => {
            console.error('Error loading image:', err);
          };
        }
      } catch (err) {
        console.error('Error in loadImageAndExtractColor:', err);
      }
    };

    loadImageAndExtractColor();
  }, [currProfilePic, profilePicDictionary]);


  // Managing profile modal state
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const toggleProfileModal = () => {setIsProfileModalOpen(!isProfileModalOpen)};

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
      }
      else
      {
          userId = auth.id;
      }
      getProfilePic();
      retrieveBio();
      fetchResumes();
  }, [userId, isAuthenticated, auth.id]);

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
    setResumes(prevResumes => [...prevResumes, newResume]);
    window.location.reload();
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
  const retrieveBio = async () => {

      try {
        const response = await fetch('http://localhost:3001/getUserBio', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({email : auth.email})
        });
  
        if (response.ok) {
          const retrievedBio = await response.json();
          setBio(retrievedBio);

        } else {
          console.error('Error retrieving');
        }
      } catch (error) {
        console.error('Error:', error);
      }
  };

  const toggleResumeVisibility = async (resume) => {
    const newPublicStatus = !resume.public; // Toggle the current status

    // Check if the new status is public and there's already another public resume
    if (newPublicStatus) {
        const publicResumesCount = resumes.filter(r => r.public && r._id !== resume._id).length;
        if (publicResumesCount >= 1) {
            setNotificationHeader('Multiple Public Resumes');
            setNotificationBody("You have a public resume. You cannot have more than one public resume at a time.");
            setIsNotificationModalOpen(true);
            return; // Early return to prevent the resume status change
        }
    }

    try {
        const response = await axios.post(`http://localhost:3001/api/update-resume`, {
            _id: resume._id,
            publicStatus: newPublicStatus
        });
        if (response.status === 200) {
            setResumes(resumes.map(r => r._id === resume._id ? {...r, public: newPublicStatus} : r));
            setNotificationHeader(`Your resume has been made ${newPublicStatus ? 'Public' : 'Not Public'}.`);
            setNotificationBody(newPublicStatus 
                ? "Your resume is now set to Public and is visible to other users."
                : "Your resume is now set to Not Public and is no longer visible to other users.");
            setIsNotificationModalOpen(true);
        } else {
            throw new Error(`Failed to make resume ${newPublicStatus ? 'Public' : 'Not Public'}`);
        }
    } catch (error) {
        console.error(`Error making resume ${newPublicStatus ? 'Public' : 'Not Public'}:`, error);
        setNotificationHeader('Error');
        setNotificationBody(`Failed to make resume ${newPublicStatus ? 'Public' : 'Not Public'}. Please try again.`);
        setIsNotificationModalOpen(true);
    }
};

// Setting Profile Pic
const setProfilePic = async (filename) => {

  const info = {
    username: auth.name,
    filename: filename
  };

  try {
    await fetch('http://localhost:3001/set-profile-pic', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(info)
    }).then(async (response) => {
      if (response.ok) {
        getProfilePic();
        console.log("Profile Pic updated");
      } else {
      
          
      }
    })

  } catch (error) {

  }
}

// Getting Profile Pic
const getProfilePic = async () => {

  const info = {
    username: auth.name
  };

  try {
    await fetch('http://localhost:3001/get-profile-pic', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(info)
    }).then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        setCurrProfilePic(data.profilePic);
      } else {
      
      }
    })

  } catch (error) {

  }
}

// Components
const NotificationModal = ({ isOpen, header, body, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay-delete">
            <div className="modal-content-delete modal-content-notification">
                <h2 className="modal-header-delete modal-header-notification">{header}</h2>
                <p>{body}</p>
                <div className="notification-buttons">
                    <button className="modal-button-delete modal-button-notification" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

const profileModal = () => {
  return (
    <div className="modal-overlay-delete" onClick={toggleProfileModal}>
      <div className='profile-pic-selection-modal-block'>
        <div className='profile-pic-selection-title'>
          Choose Icon 
        </div>
        <div className='profile-pic-selection-pic-block'>
          {Object.entries(profilePicDictionary).map(([filename, image]) => (
            <div className='profile-pic-selection-border'>
              <img
                key={filename}
                src={image}
                alt={filename}
                onClick={() => {setProfilePic(filename)}}
                style={{ cursor: 'pointer', margin: '10px', width: '75px', height: '75px' }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const profilePicDisplay = () => {
  return (
    <div>
      <img
          src={profilePicDictionary[currProfilePic]}
          style={{ cursor: 'pointer', margin: '37px', width: '125px', height: '125px'}}
        />
    </div>
  );
}

const hasPublicResume = resumes.some(resume => resume.public);

function capitalizeWords(str) {
    if (typeof str !== 'string') {  // Check if the input is a string
        return '';  // Return an empty string if the input is not a string
    }
    return str.toLowerCase().replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};
    return (
        <div className="container">
            <div className="app-logo-container"> 
                <a href="/">
                <img src={logo} className="logo" alt="LinkUp Logo" />
                </a> 
            </div>
            <Sidebar></Sidebar>
            <div className="profile-content">
                <div className="blue-header"></div>
                <div className="profile-icon-section">
                    <div className="profile-icon-placeholder" 
                          onClick={() => toggleProfileModal()}
                          style={{ backgroundColor: bgColor}}>
                        {profilePicDisplay()}
                    </div>
                    <div className="username"> {auth.name} </div>
                    <button className="edit-preferences-button" onClick={() => navigate('/edit-preferences')}>
                        Edit Preferences
                    </button>
                </div>
                <div className="horizontal-container">
                    <div className="vertical-line"></div>
                    <div className="fields-container">
                        <div className="profile-info">PROFILE</div>
                        <div className="field-label">Industry: <span className="value-normal">{capitalizeWords(bio.field_of_interest)}</span></div>
                        <div className="field-label">Location: <span className="value-normal">{capitalizeWords(bio.location)}</span></div>
                        <div className="field-label">Education: <span className="value-normal">{capitalizeWords(bio.education)}</span> </div>
                        <div className="field-label">Level of Experience: <span className="value-normal">{capitalizeWords(bio.work_experience_level)}</span></div>
                    </div>
                    <div className="fields-container">
                        <div className="profile-info">SWIPING PREFERENCES</div>
                        <div className="field-label">Industry: <span className="value-normal">{capitalizeWords(bio.preferences_interest)}</span></div>
                        <div className="field-label">Location: <span className="value-normal">{capitalizeWords(bio.preferences_loc)}</span></div>
                        <div className="field-label">Education: <span className="value-normal">{capitalizeWords(bio.preferences_edu)}</span> </div>
                        <div className="field-label">Level of Experience: <span className="value-normal">{capitalizeWords(bio.preferences_workexp)}</span></div>
                    </div>
                </div>

                <div className="uploads-container">
                    <div className="uploads-info">MY UPLOADS</div>
                    <hr className="uploads-divider" />
                    <div className="horizontal-scroll" ref={pdfContainerRef}>
                        {resumes.map((resume) => (
                            <div key={resume._id} className="pdf-item" onClick={() => openZoomModal(resume)}>
                                <embed className="pdf-embed" src={`http://localhost:3001/bucket/files/${resume.file_path}`} type="application/pdf" />
                                {resume.public ? 
                                    <VisibilityIcon className="public-icon" onClick={(e) => { e.stopPropagation(); toggleResumeVisibility(resume); }} /> : 
                                    <VisibilityOffIcon className="private-icon" onClick={(e) => { e.stopPropagation(); toggleResumeVisibility(resume); }} />
                                }
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
            {isUploadModalOpen && (<ResumeUploadModal closeModal={closeModal} onUploadSuccess={handleResumeUploadSuccess} disablePublicOption={hasPublicResume}/>
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
        {isProfileModalOpen && profileModal()}
        
        <NotificationModal
            isOpen={isNotificationModalOpen}
            header={notificationHeader}
            body={notificationBody}
            onClose={() => setIsNotificationModalOpen(false)}
        />
        <ZoomModal />
        </div>
    );
};

export default Profile;
