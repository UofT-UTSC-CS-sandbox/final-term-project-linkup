import React from 'react';
import useZoomModal from './useZoomModal';
import ResumeZoom from '../pages/ResumeZoom'; // Import the existing component

const withZoomModal = (Component) => (props) => {
  const { selectedResume, openZoomModal, closeZoomModal } = useZoomModal();

  return (
    <>
      <Component {...props} openZoomModal={openZoomModal} />
      {selectedResume && <ResumeZoom resume={selectedResume} closeModal={closeZoomModal} />}
    </>
  );
};

export default withZoomModal;
