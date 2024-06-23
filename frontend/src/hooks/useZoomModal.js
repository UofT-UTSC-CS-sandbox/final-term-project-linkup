import { useState } from 'react';
import ResumeZoom from '../pages/ResumeZoom';

const useZoomModal = () => {
  const [selectedResume, setSelectedResume] = useState(null);

  const openZoomModal = (resume) => {
    setSelectedResume(resume);
  };

  const closeZoomModal = () => {
    setSelectedResume(null);
  };

  const ZoomModal = () => (
    selectedResume ? <ResumeZoom resume={selectedResume} closeModal={closeZoomModal} /> : null
  );

  return [openZoomModal, ZoomModal];
};

export default useZoomModal;
