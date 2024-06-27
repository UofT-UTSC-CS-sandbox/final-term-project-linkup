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

    const [resumes, setResumes] = useState([]);
    const pdfContainerRef = useRef(null); 
    const [openZoomModal, ZoomModal] = useZoomModal();

    useEffect(() => {
        const fetchSwipingResumes = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/resumes/${userId}`);
                const fetchedUserResumes = response.data;
                setResumes(fetchedUserResumes);
                if (fetchedUserResumes.length == 0){
                    navigate('/upload-first-resume');
                }
            } catch (error) {
                console.error('Failed to fetch resumes', error);
            }
        };
        fetchSwipingResumes();
    }, []);


    return (
    <div className="container">
      <div className="app-logo-container"> 
        <a href="/">
          <img src={logo} className="logo" alt="LinkUp Logo" />
        </a> 
      </div>
      <Sidebar/>
      <ZoomModal />
      <div ref={pdfContainerRef}>
            {resumes.map((resume) => (
                    <div key={resume._id} className="pdf-item" onClick={() => openZoomModal(resume)} >
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                            <Viewer
                                fileUrl={`http://localhost:3001/bucket/files/${resume.file_path}`}
                                defaultScale={1.0}
                            />
                        </Worker>
                    </div>
                ))}
            </div>
    </div>
    );
}
export default LandingPage;