import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) setTimeout(onClose, 300); // Allow animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return 'bi-check-circle-fill';
      case 'error': return 'bi-x-circle-fill';
      case 'warning': return 'bi-exclamation-triangle-fill';
      case 'info': return 'bi-info-circle-fill';
      default: return 'bi-bell-fill';
    }
  };

  const handleClose = () => {
    setVisible(false);
    if (onClose) setTimeout(onClose, 300); // Allow animation to complete
  };

  return (
    <div className={`toast-container position-fixed bottom-0 end-0 p-3`}>
      <div 
        className={`toast show toast-${type} ${visible ? 'fade-in' : 'fade-out'}`} 
        role="alert" 
        aria-live="assertive" 
        aria-atomic="true"
      >
        <div className="toast-header">
          <i className={`bi ${getIcon()} me-2`}></i>
          <strong className="me-auto">{type.charAt(0).toUpperCase() + type.slice(1)}</strong>
          <button 
            type="button" 
            className="btn-close" 
            onClick={handleClose}
            aria-label="Close"
          ></button>
        </div>
        <div className="toast-body">
          {message}
        </div>
      </div>
    </div>
  );
};

export default Toast;