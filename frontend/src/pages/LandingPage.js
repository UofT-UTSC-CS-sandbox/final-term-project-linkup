import React, {useEffect, useState, useRef} from "react";
import axios from "axios";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { useNavigate} from "react-router-dom";
import logo from '../images/linkup_logo_highquality.png';
import Sidebar from '../components/Sidebar.js'
import useZoomModal from '../hooks/useZoomModal';


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

    const handleKeyDown = (event) => {
        if (event.key === "ArrowLeft") {
            handleSwipe(false);
        } else if (event.key === "ArrowRight") {
            handleSwipe(true);
        }
    };

    const handleSwipe = async (accept) => {
        if (currentIndex >= swipingResumes.length) {
            return;
        }
        
        const currentResume = swipingResumes[currentIndex];
        
        try {
            let axiosConfig = {
                headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                }
            };

            await axios.post(`http://localhost:3001/api/swipes/${userId}`, {
                user_id: userId,
                resume_id: currentResume._id,
                uploader_id: currentResume.uploader_id,
                accept: accept
            }, axiosConfig);

            setCurrentIndex(prevIndex => prevIndex + 1);
        } catch (error) {
            console.error('Failed to swipe resume', error);
        }
    };

    
    useEffect(() =>  {
        const initialize = async () => {
            await checkIfAtLeastOneUploadedFile();
            await fetchSwipingResumes();
        };
        initialize();
    }, [userId, navigate]);

    useEffect(() => {
        console.log("useEffect is running"); // Debugging log
        const keyPress = (event) => handleKeyDown(event);
        window.addEventListener('keydown', keyPress);
        return () => {
            window.removeEventListener('keydown', keyPress);
        };
    });

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
        <div className="pdf-item" onClick={() => openZoomModal(currentResume)}>
            <embed className="pdf-embed" src={`http://localhost:3001/bucket/files/${currentResume.file_path}`} type="application/pdf" />
        </div>
        ) : (
            <div>No more resumes to swipe</div>
        )}
</div>
    );
}
export default LandingPage;