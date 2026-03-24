import React, { useState } from 'react';

const RatingStars = ({ initialRating = 0, totalStars = 5, onRatingChange, readOnly = false, size = 'medium' }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (selectedRating) => {
    if (readOnly) return;
    setRating(selectedRating);
    if (onRatingChange) {
      onRatingChange(selectedRating);
    }
  };

  const handleMouseEnter = (hoveredRating) => {
    if (readOnly) return;
    setHoverRating(hoveredRating);
  };

  const handleMouseLeave = () => {
    if (readOnly) return;
    setHoverRating(0);
  };

  const getStarSize = () => {
    switch (size) {
      case 'small': return 'star-small';
      case 'large': return 'star-large';
      default: return '';
    }
  };

  return (
    <div className="rating-stars">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        const isActive = starValue <= (hoverRating || rating);
        
        return (
          <span
            key={index}
            className={`star ${getStarSize()} ${isActive ? 'active' : ''} ${readOnly ? 'readonly' : ''}`}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
          >
            <i className={`bi ${isActive ? 'bi-star-fill' : 'bi-star'}`}></i>
          </span>
        );
      })}
      {!readOnly && (
        <span className="rating-value">{hoverRating || rating || ''}</span>
      )}
    </div>
  );
};

export default RatingStars;