import { useState } from 'react';

const useZoomModal = () => {
  const [selectedResume, setSelectedResume] = useState(null);

  const openZoomModal = (resume) => {
    setSelectedResume(resume);
  };

  const closeZoomModal = () => {
    setSelectedResume(null);
  };

  return {
    selectedResume,
    openZoomModal,
    closeZoomModal,
  };
};

export default useZoomModal;
