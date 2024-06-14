import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../images/linkup_logo.png';
import uploadIcon from '../images/Upload_icon.png';
import deleteIcon from '../images/DeleteIcon.png';
import cancelIcon from '../images/Vector.png';
import './ResumeUpload.css'; // Import the CSS file

// Routing and authentication
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';

const ResumeUpload = () => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [publicFlag, setPublicFlag] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false); // State to track if uploading
  const userId = "6668b379930f4bfc3a165935";
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if(!isAuthenticated) {
      navigate('/login-page');
    }
  });

  const handleFileChange = (event) => {
    if (isUploading) return; // Prevent file selection if already uploading
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      simulateUpload(selectedFile);
    } else {
      setUploadStatus('Only PDF files are accepted');
    }
  };

  const simulateUpload = (file) => {
    setIsUploading(true); // Start uploading
    setUploadProgress(0); // Initialize progress to 0 at the start of upload
    const uploadTime = 4000; // Total time for 'fake' upload
    const stepTime = 20; // Time between each progress update

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += (stepTime / uploadTime) * 100;
      setUploadProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsUploading(false); // End uploading
        //setUploadStatus('Upload complete');
      }
    }, stepTime);
  };

  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadStatus('');
    setIsUploading(false);
    document.getElementById('file-upload').value = null; // Reset the file input
  };

  const handlePublicFlagChange = (e) => {
    setPublicFlag(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || file.type !== 'application/pdf') {
      setUploadStatus('Must be of PDF format');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('public', publicFlag);
    formData.append('uploader_id', userId);
    formData.append('num_swipes', 0);

    try {
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: progressEvent => {
          setUploadProgress((progressEvent.loaded / progressEvent.total) * 100);
        }
      });
      setUploadStatus(response.data.message);
      navigate('/profile'); // Navigate to Profile page after upload
    } catch (error) {
      console.error('Error uploading resume:', error);
      setUploadStatus('Error uploading resume');
    }
  };

  return (
    <div className="container">
      <div className="profile-link-container">
        <a href="/profile" className="profile-link">Your Profile</a>
      </div>
      <img src={logo} className="logo" alt="LinkUp Logo" />
      <h2 className="instruction-text">
        To start swiping, <br />please upload your first resume
      </h2>
      <div className="content-box">
        <h3 className="upload-header">Upload</h3>
        <div className="upload-area">
          <img src={uploadIcon} alt="Upload Icon" style={{ height: '60px', width: '70px' }} />
          <p className="upload-instructions">
            Drag & drop files or <label htmlFor="file-upload" className="file-input-label">Browse</label>
          </p>
          <input type="file" id="file-upload" className="file-input" onChange={handleFileChange} disabled={isUploading} style={{ display: 'none' }} />
          <span className="supported-formats">Supported formats: PDF</span>
        </div>
        {file && (
          <>
            <h4 className="uploading-header">{uploadProgress < 100 ? "Uploading" : "Uploaded"}</h4>
            <div className={`uploading-section ${uploadProgress === 100 ? 'upload-complete' : ''}`}>
              <span className="file-info">{file.name}</span>
              <button onClick={removeFile} className="cancel-button">
                <img src={uploadProgress === 100 ? deleteIcon : cancelIcon} alt="Icon" />
              </button>
              {uploadProgress < 100 ? (
              <div className="progress-bar">
              <div className="progress" style={{ width: `${uploadProgress}%` }}></div>
              </div>
              ) : null}
            </div>
          </>
        )}
        <label className="publicFlag-label">
          <input type="checkbox" id="publicFlag" checked={publicFlag} onChange={handlePublicFlagChange} />
          Make Public
        </label>
        <button className="upload-btn" onClick={handleSubmit} disabled={isUploading}>UPLOAD FILE</button>
      </div>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
};

export default ResumeUpload;
