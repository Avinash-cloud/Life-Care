import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cmsAPI } from '../../services/api';

const Gallery = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [galleryItems, setGalleryItems] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchGallery();
    fetchCategories();
  }, [activeFilter]);

  const fetchGallery = async () => {
    try {
      const params = {};
      if (activeFilter !== 'all') params.category = activeFilter;
      const res = await cmsAPI.getGallery(params);
      setGalleryItems(res.data.data || []);
    } catch (err) {
      console.error('Failed to load gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await cmsAPI.getGalleryCategories();
      setCategories(['all', ...(res.data.data || [])]);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const filteredItems = galleryItems;

  const openLightbox = (item) => {
    setSelectedImage(item);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <div className="gallery-page py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="mb-3">Our <span className="text-gradient">Gallery</span></h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Take a visual tour of our facilities, team, and events. Get to know us better through these images.
          </p>
        </div>

        {/* Gallery Filters */}
        <div className="filter-container mb-5">
          {categories.map((category, index) => (
            <button 
              key={index}
              className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
              onClick={() => setActiveFilter(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="gallery-grid">
            {filteredItems.map(item => (
              <div className="gallery-item" key={item._id} onClick={() => openLightbox(item)}>
                <img src={item.imageUrl} alt={item.title} />
                <div className="gallery-overlay">
                  <div className="gallery-info">
                    <h5>{item.title}</h5>
                    <div className="gallery-category">{item.category}</div>
                  </div>
                </div>
                <button className="gallery-zoom">
                  <i className="bi bi-zoom-in"></i>
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <p className="text-muted">No gallery images available.</p>
          </div>
        )}


      </div>

      {/* Lightbox */}
      {lightboxOpen && selectedImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox}>
              <i className="bi bi-x-lg"></i>
            </button>
            <img src={selectedImage.imageUrl} alt={selectedImage.title} />
            <div className="lightbox-caption">
              <h5>{selectedImage.title}</h5>
              <p>{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;