import React, { useState, useRef } from 'react';
import './ResumeZoom.css';

const ResumeZoom = ({ resume, closeModal }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [initialPinchDistance, setInitialPinchDistance] = useState(null);
  const [initialZoomLevel, setInitialZoomLevel] = useState(1);
  const resumeRef = useRef(null);

  const startDrag = (e) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const onDrag = (e) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const endDrag = () => {
    setIsDragging(false);
  };

  const onTouchStart = (e) => {
    if (e.touches.length === 2) {
      const [touch1, touch2] = e.touches;
      const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      setInitialPinchDistance(distance);
      setInitialZoomLevel(zoomLevel);
    } else if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    }
  };

  const onTouchMove = (e) => {
    if (e.touches.length === 2 && initialPinchDistance !== null) {
      const [touch1, touch2] = e.touches;
      const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
      const scaleChange = distance / initialPinchDistance;
      setZoomLevel(Math.min(Math.max(initialZoomLevel * scaleChange, 1), 3));
    } else if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      setPosition({ x: touch.clientX - dragStart.x, y: touch.clientY - dragStart.y });
    }
  };

  const onTouchEnd = () => {
    setIsDragging(false);
    setInitialPinchDistance(null);
  };

  return (
    <div className="zoom-modal-overlay">
      <div className="zoom-modal-content">
        <button className="zoom-close-button" onClick={closeModal}>&times;</button>
        <div
          className="resume-container"
          onMouseDown={startDrag}
          onMouseMove={onDrag}
          onMouseUp={endDrag}
          onMouseLeave={endDrag}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <embed
            ref={resumeRef}
            src={`http://localhost:3001/bucket/files/${resume.file_path}`}
            type="application/pdf"
            className="pdf-embed"
            style={{
              transform: `scale(${zoomLevel}) translate(${position.x / zoomLevel}px, ${position.y / zoomLevel}px)`,
              transformOrigin: 'top left',
              cursor: isDragging ? 'grabbing' : 'grab',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ResumeZoom;
