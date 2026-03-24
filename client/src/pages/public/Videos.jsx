import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cmsAPI } from '../../services/api';

const Videos = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState(['all']);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchVideos();
    fetchCategories();
  }, [activeFilter]);

  const fetchVideos = async () => {
    try {
      const params = {};
      if (activeFilter !== 'all') params.category = activeFilter;
      const res = await cmsAPI.getVideos(params);
      console.log('Videos response:', res.data);
      setVideos(res.data.data || []);
    } catch (err) {
      console.error('Failed to load videos:', err);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await cmsAPI.getVideoCategories();
      setCategories(['all', ...(res.data.data || [])]);
    } catch (err) {
      console.error('Failed to load categories:', err);
      setCategories(['all']);
    }
  };

  const filteredVideos = videos;

  const openVideoModal = (video) => {
    setSelectedVideo(video);
    setShowModal(true);
  };

  const closeVideoModal = () => {
    setShowModal(false);
    setSelectedVideo(null);
  };

  return (
    <div className="videos-page py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="mb-3">Educational <span className="text-gradient">Videos</span></h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Explore our collection of educational videos on various mental health topics, 
            created by our expert counsellors to help you understand and manage your mental wellbeing.
          </p>
        </div>

        {/* Video Filters */}
        <div className="video-filter-container mb-5">
          {categories.map((category, index) => (
            <button 
              key={index}
              className={`video-filter-btn ${activeFilter === category ? 'active' : ''}`}
              onClick={() => setActiveFilter(category)}
            >
              {category === 'all' ? 'All Videos' : category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        {/* Video Grid */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : filteredVideos.length > 0 ? (
          <div className="row g-4">
            {filteredVideos.map(video => (
              <div className="col-md-6 col-lg-4" key={video._id}>
                <div className="card h-100" style={{ cursor: 'pointer', overflow: 'hidden' }} onClick={() => openVideoModal(video)}>
                  <div style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#000' }}>
                    {video.videoUrl && (
                      <video 
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                        muted
                      >
                        <source src={video.videoUrl} type="video/mp4" />
                      </video>
                    )}
                    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.4)' }}>
                      <i className="bi bi-play-circle-fill" style={{ fontSize: '64px', color: 'white' }}></i>
                    </div>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{video.title}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <p className="text-muted">No videos available.</p>
          </div>
        )}


      </div>

      {/* Video Modal */}
      {showModal && selectedVideo && (
        <div className="modal-overlay" onClick={closeVideoModal} style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="modal-custom" onClick={e => e.stopPropagation()} style={{ width: '90%', maxWidth: '900px', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' }}>
            <div className="modal-header" style={{ padding: '15px 20px', borderBottom: '1px solid #dee2e6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h5 className="modal-title" style={{ margin: 0 }}>{selectedVideo.title}</h5>
              <button type="button" className="btn-close" onClick={closeVideoModal}></button>
            </div>
            <div className="modal-body p-0">
              {selectedVideo.videoUrl && (
                <video 
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                  controls
                  autoPlay
                >
                  <source src={selectedVideo.videoUrl} type="video/mp4" />
                </video>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Videos;