import { useState, useRef } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const ImagePicker = ({ show, onHide, onImageSelect, currentImage }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [crop, setCrop] = useState({ aspect: 1, width: 200, height: 200 });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imageRef, setImageRef] = useState(null);
  const fileInputRef = useRef();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedFile(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImg = () => {
    if (!imageRef || !completedCrop) return null;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    const scaleX = imageRef.naturalWidth / imageRef.width;
    const scaleY = imageRef.naturalHeight / imageRef.height;
    
    canvas.width = completedCrop.width;
    canvas.height = completedCrop.height;
    
    ctx.drawImage(
      imageRef,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      completedCrop.width,
      completedCrop.height
    );
    
    return canvas.toDataURL('image/jpeg', 0.8);
  };

  const handleSave = () => {
    const croppedImage = getCroppedImg();
    if (croppedImage) {
      onImageSelect(croppedImage);
      handleClose();
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setCrop({ aspect: 1, width: 200, height: 200 });
    setCompletedCrop(null);
    setImageRef(null);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered style={{ zIndex: 10005 }}>
      <Modal.Header closeButton>
        <Modal.Title>Select Profile Picture</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center mb-3">
          <Button variant="outline-primary" onClick={() => fileInputRef.current?.click()}>
            <i className="bi bi-upload me-2"></i>Choose Image
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
        </div>

        {selectedFile && (
          <div className="text-center">
            <ReactCrop
              crop={crop}
              onChange={(newCrop) => setCrop(newCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={1}
              circularCrop
            >
              <img
                ref={setImageRef}
                src={selectedFile}
                alt="Crop preview"
                style={{ maxWidth: '100%', maxHeight: '400px' }}
              />
            </ReactCrop>
          </div>
        )}

        {currentImage && !selectedFile && (
          <div className="text-center">
            <img
              src={currentImage}
              alt="Current profile"
              style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '50%' }}
            />
            <p className="mt-2 text-muted">Current profile picture</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSave}
          disabled={!selectedFile || !completedCrop}
        >
          Save Image
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImagePicker;