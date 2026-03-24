import React, { useEffect } from 'react';

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'medium', 
  showFooter = true,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm = null,
  confirmButtonClass = 'primary',
  hideCloseButton = false
}) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Handle modal size
  const getModalSize = () => {
    switch (size) {
      case 'small': return 'modal-sm';
      case 'large': return 'modal-lg';
      case 'xlarge': return 'modal-xl';
      default: return '';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal-custom ${getModalSize()}`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h5 className="modal-title">{title}</h5>
          {!hideCloseButton && (
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              aria-label="Close"
            ></button>
          )}
        </div>
        <div className="modal-body">
          {children}
        </div>
        {showFooter && (
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-outline-secondary" 
              onClick={onClose}
            >
              {cancelText}
            </button>
            {onConfirm && (
              <button 
                type="button" 
                className={`btn btn-${confirmButtonClass}`} 
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;