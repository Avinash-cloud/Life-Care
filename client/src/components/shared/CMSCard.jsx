import React from 'react';
import { Link } from 'react-router-dom';

const CMSCard = ({ 
  item, 
  type = 'blog', 
  onEdit, 
  onDelete, 
  onPublish, 
  showActions = true 
}) => {
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get appropriate icon based on content type
  const getTypeIcon = () => {
    switch (type) {
      case 'blog': return 'bi-file-text';
      case 'video': return 'bi-camera-video';
      case 'gallery': return 'bi-image';
      case 'faq': return 'bi-question-circle';
      default: return 'bi-file-earmark';
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'warning';
      case 'archived': return 'secondary';
      default: return 'info';
    }
  };

  return (
    <div className="cms-card">
      <div className="cms-card-media">
        {type === 'video' ? (
          <div className="cms-video-thumbnail">
            <img src={item.thumbnail || item.image} alt={item.title} />
            <div className="cms-video-play">
              <i className="bi bi-play-circle"></i>
            </div>
            {item.duration && (
              <div className="cms-video-duration">{item.duration}</div>
            )}
          </div>
        ) : (
          <img src={item.image || item.thumbnail} alt={item.title} />
        )}
        <div className="cms-card-type">
          <i className={`bi ${getTypeIcon()}`}></i>
        </div>
      </div>
      
      <div className="cms-card-content">
        <div className="cms-card-header">
          <h5 className="cms-card-title">{item.title}</h5>
          <span className={`cms-card-status status-${getStatusColor(item.status)}`}>
            {item.status}
          </span>
        </div>
        
        <p className="cms-card-excerpt">{item.excerpt || item.description}</p>
        
        <div className="cms-card-meta">
          <div className="cms-card-info">
            <span><i className="bi bi-calendar3 me-1"></i> {formatDate(item.createdAt || item.date)}</span>
            {item.author && (
              <span><i className="bi bi-person me-1"></i> {item.author}</span>
            )}
            {item.category && (
              <span><i className="bi bi-tag me-1"></i> {item.category}</span>
            )}
          </div>
          
          {showActions && (
            <div className="cms-card-actions">
              <Link to={`/${type}/${item.id}`} className="cms-card-action view">
                <i className="bi bi-eye"></i>
              </Link>
              
              {onEdit && (
                <button className="cms-card-action edit" onClick={() => onEdit(item)}>
                  <i className="bi bi-pencil"></i>
                </button>
              )}
              
              {onDelete && (
                <button className="cms-card-action delete" onClick={() => onDelete(item)}>
                  <i className="bi bi-trash"></i>
                </button>
              )}
              
              {onPublish && item.status !== 'published' && (
                <button className="cms-card-action publish" onClick={() => onPublish(item)}>
                  <i className="bi bi-cloud-arrow-up"></i>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CMSCard;