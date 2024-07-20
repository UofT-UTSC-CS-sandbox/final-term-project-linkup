import React, {useEffect, useState, useRef} from "react";
import axios from "axios";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { useNavigate} from "react-router-dom";
import logo from '../images/linkup_logo_highquality.png';
import Sidebar from '../components/Sidebar.js'
import useZoomModal from '../hooks/useZoomModal';
import './LandingPage.css';
import link from '../images/link.png';
import unlink from '../images/unlink.png';


// Routing and authentication
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'; 

const LandingPage = () => {
    const navigate = useNavigate();
    const isAuthenticated = useIsAuthenticated();
    const auth = useAuthUser();
    console.log(auth);
    const userId = auth.id;

    const [swipingResumes, setSwipingResumes] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [openZoomModal, ZoomModal] = useZoomModal();

    const checkIfAtLeastOneUploadedFile = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/resumes/${userId}`);
            const fetchedUserResumes = response.data;
            if (fetchedUserResumes.length == 0){
                navigate('/upload-first-resume');
            }
        } catch (error) {
            console.error('Failed to fetch resumes', error);
        }
    };

    const fetchSwipingResumes = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/api/swiping-resumes/${userId}`);
            const fetchedUserResumes = response.data;
            setSwipingResumes(fetchedUserResumes);
            setCurrentIndex(0);
        } catch (error) {
            console.error('Failed to fetch resumes', error);
        }
    };

    const handleSwipe = async (accept) => {
        if (currentIndex >= swipingResumes.length) {
            return;
        }
        
        const currentResume = swipingResumes[currentIndex];

        
        console.log('Current Resume:', JSON.stringify(currentResume, null, 2)); // Log current resume
    
    if (!currentResume || !currentResume._id || !currentResume.uploader_id) {
        console.error('Invalid current resume structure:', currentResume);
        return;
    }
        
        try {
            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            await axios.post(`http://localhost:3001/api/swipes/${userId}`, {
                user_id: userId,
                resume_id: currentResume._id,
                uploader_id: currentResume.uploader_id,
                accept: accept
            }, axiosConfig);

            setCurrentIndex(prevIndex => prevIndex + 1);
            await checkMatches(userId, currentResume.uploader_id._id, currentResume._id);
        } catch (error) {
            console.error('Failed to swipe resume', error);
        }
    };

    const checkMatches = async (currentUserId, swipedResumeUploaderId, swipedResumeId) => {
        try {
            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };
            const response = await axios.post(`http://localhost:3001/api/match/${userId}`, {
                currId: currentUserId,
                otherId: swipedResumeUploaderId
            }, axiosConfig);
            const hasMatch = response.data.hasMatch;
            if (hasMatch) {
                navigate(`/match-found/${swipedResumeId}`); // Redirect to match found page
            }
        } catch (error) {
            console.error('Failed to check for matches', error);
        }
    }

    
    useEffect(() =>  {
        const initialize = async () => {
            await checkIfAtLeastOneUploadedFile();
            await fetchSwipingResumes();
        };
        initialize();
    }, [userId, navigate]);

    const currentResume = swipingResumes[currentIndex];

    return (
    <div className="container">
        <div className="app-logo-container"> 
        <a href="/">
            <img src={logo} className="logo" alt="LinkUp Logo" />
        </a> 
        </div>
        <Sidebar/>
        <ZoomModal/>
        {currentResume ? (
            <div className="swiping">
                <div className="text-button-container">
                    <p>
                        Click <span className="roboto-condensed">LINK</span> to swipe right (accept) or <span className="roboto-condensed">UNLINK</span> to swipe left (reject).
                        </p>
                    <div className="accept-reject-container">
                        <button onClick={() => handleSwipe(true)}>
                            LINK
                            <img src={link} alt="link" className="link-img"/>
                        </button>
                        <button onClick={() => handleSwipe(false)}>
                            UNLINK
                            <img src={unlink} alt="unlink" className="unlink-img"/>
                        </button>
                    </div>
                </div>
                <div className="swiping-pdf-item" onClick={() => openZoomModal(currentResume)}>
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js">
                        <Viewer
                            fileUrl={`http://localhost:3001/bucket/files/${currentResume.file_path}`}
                            defaultScale={1.0}
                        />
                    </Worker>
                </div>
            </div>
        ) : (
            <div className="no-results">
                <p>No Resumes Found</p>
                <br></br>
                <p>Consider changing your swiping preferences to allow for more results.</p> 
            </div>
        )}
    </div>
    );
}
export default LandingPage;