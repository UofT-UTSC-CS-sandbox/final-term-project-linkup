import React, { useEffect, useState } from 'react';
import axios from 'axios';
import uploadIcon from '../images/Upload_icon.png';
import deleteIcon from '../images/DeleteIcon.png';
import cancelIcon from '../images/Vector.png';
import './UploadPopUp.css';

// Routing and authentication
import { useNavigate } from "react-router-dom";
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';

const ResumeUploadModal = ({ closeModal, onUploadSuccess }) => {
  // State to manage file selection, upload progress and status, and privacy flag
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [publicFlag, setPublicFlag] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const userId = "6668b379930f4bfc3a165935";
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();

  // Redirect if not authenticated
  useEffect(() => {
    if(!isAuthenticated) {
      navigate('/login-page');
    }
  });

  // Function to handle file selection
  const handleFileChange = (event) => {
    if (isUploading) return;
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      simulateUpload(selectedFile);
    } else {
      setUploadStatus('Only PDF files are accepted');
    }
  };

  // Simulate the upload process
  const simulateUpload = (file) => {
    setIsUploading(true);
    setUploadProgress(0);
    const uploadTime = 4000;
    const stepTime = 20;

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += (stepTime / uploadTime) * 100;
      setUploadProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
      }
    }, stepTime);
  };

  // Function to remove selected file
  const removeFile = () => {
    setFile(null);
    setUploadProgress(0);
    setUploadStatus('');
    setIsUploading(false);
    document.getElementById('file-upload').value = null;
  };

  // Function to toggle the public/private flag
  const handlePublicFlagChange = (e) => {
    setPublicFlag(e.target.checked);
  };

  // Function to handle form submission and file upload
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
        onUploadProgress: (progressEvent) => {
          setUploadProgress((progressEvent.loaded / progressEvent.total) * 100);
        }
      });

      if (response.data && response.status === 200) {
        onUploadSuccess(response.data);
        setUploadStatus(response.data.message);
        closeModal();
      } else {
        setUploadStatus('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      setUploadStatus('Error uploading resume');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-button" onClick={closeModal}>&times;</span>
        <div className="content-box">
          <h3 className="upload-header">Upload</h3>
          <div className="upload-area">
            <img src={uploadIcon} alt="Upload Icon" style={{ height: '60px', width: '70px' }} />
            <p className="upload-instructions">
              Drag & drop files or <label htmlFor="file-upload" className="file-input-label">Browse</label>
            </p>
            <input
              type="file"
              id="file-upload"
              className="file-input"
              onChange={handleFileChange}
              disabled={isUploading}
              style={{ display: 'none' }}
            />
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
    </div>
  );
};

export default ResumeUploadModal;
