import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clientAPI } from '../../services/api';
import './CounsellorFinder.css';

const CounsellorFinder = () => {
  const [loading, setLoading] = useState(true);
  const [counsellors, setCounsellors] = useState([]);
  const [filteredCounsellors, setFilteredCounsellors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    gender: 'all',
    expertise: 'all',
    priceRange: 'all',
    availability: 'all'
  });
  const [specializations, setSpecializations] = useState([]);

  // Mock data for fallback
  const mockCounsellors = [
    {
      _id: '101',
      user: { name: 'Dr. Sarah Johnson', avatar: '/default-avatar.png' },
      gender: 'female',
      specializations: ['Depression', 'Anxiety', 'PTSD'],
      experience: 8,
      languages: ['English', 'Hindi'],
      ratings: { average: 4.8, count: 124 },
      fees: { video: 1500 },
      bio: 'Dr. Sarah is a licensed clinical psychologist with 8 years of experience helping individuals overcome depression, anxiety, and trauma.',
      isVerified: true
    }
  ];

  useEffect(() => {
    const fetchCounsellors = async () => {
      try {
        setLoading(true);
        const response = await clientAPI.getCounsellors();
        const counsellorData = response.data.data || [];
        setCounsellors(counsellorData);
        setFilteredCounsellors(counsellorData);
        
        // Extract unique specializations for filter
        const uniqueSpecs = [...new Set(counsellorData.flatMap(c => c.specializations || []))];
        setSpecializations(uniqueSpecs);
      } catch (error) {
        console.error('Error fetching counsellors:', error);
        // Fallback to mock data if API fails
        setCounsellors(mockCounsellors);
        setFilteredCounsellors(mockCounsellors);
      } finally {
        setLoading(false);
      }
    };

    fetchCounsellors();
  }, []);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    applyFilters(e.target.value, filters);
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    applyFilters(searchQuery, newFilters);
  };

  // Apply all filters
  const applyFilters = (query, currentFilters) => {
    let results = [...counsellors];
    
    // Apply search query
    if (query) {
      const searchTerm = query.toLowerCase();
      results = results.filter(counsellor => 
        (counsellor.user?.name || counsellor.name || '').toLowerCase().includes(searchTerm) ||
        (counsellor.specializations || []).some(spec => spec.toLowerCase().includes(searchTerm)) ||
        (counsellor.bio || '').toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply gender filter
    if (currentFilters.gender !== 'all') {
      results = results.filter(counsellor => counsellor.gender === currentFilters.gender);
    }
    
    // Apply expertise filter
    if (currentFilters.expertise !== 'all') {
      results = results.filter(counsellor => 
        (counsellor.specializations || []).some(spec => spec.toLowerCase() === currentFilters.expertise.toLowerCase())
      );
    }
    
    // Apply price range filter
    if (currentFilters.priceRange !== 'all') {
      switch (currentFilters.priceRange) {
        case 'under1000':
          results = results.filter(counsellor => (counsellor.fees?.video || 0) < 1000);
          break;
        case '1000to1500':
          results = results.filter(counsellor => {
            const fee = counsellor.fees?.video || 0;
            return fee >= 1000 && fee <= 1500;
          });
          break;
        case 'over1500':
          results = results.filter(counsellor => (counsellor.fees?.video || 0) > 1500);
          break;
        default:
          break;
      }
    }
    
    setFilteredCounsellors(results);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Finding the best counsellors for you...</p>
      </div>
    );
  }

  return (
    <div className="finder-page">
      <div className="finder-header">
        <h1>Find Your Perfect Match</h1>
        <p>Browse our network of qualified mental health professionals and start your wellness journey today</p>
      </div>

      <div className="search-filter-section">
        <div className="filters-inline">
          <div className="search-bar">
            <i className="bi bi-search search-icon"></i>
            <input 
              type="text" 
              placeholder="Search by name, specialization, or expertise..." 
              value={searchQuery}
              onChange={handleSearchChange}
              className="search-input"
            />
          </div>
          
          <select 
            value={filters.gender} 
            onChange={(e) => handleFilterChange('gender', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Genders</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          
          <select 
            value={filters.expertise} 
            onChange={(e) => handleFilterChange('expertise', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Expertise</option>
            {specializations.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>
          
          <select 
            value={filters.priceRange} 
            onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Prices</option>
            <option value="under1000">Under ₹1000</option>
            <option value="1000to1500">₹1000 - ₹1500</option>
            <option value="over1500">Over ₹1500</option>
          </select>
        </div>
      </div>

      <div className="counsellors-results">
        <p className="results-count">{filteredCounsellors.length} professionals found</p>
        
        <div className="counsellors-grid">
          {filteredCounsellors.length > 0 ? (
            filteredCounsellors.map(counsellor => (
              <div key={counsellor._id} className="counsellor-card">
                <div className="counsellor-header">
                  {counsellor.user?.avatar ? (
                    <img 
                      src={counsellor.user.avatar} 
                      alt={counsellor.user?.name || 'Counsellor'} 
                      className="counsellor-photo"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="counsellor-photo-placeholder" style={{display: counsellor.user?.avatar ? 'none' : 'flex'}}>
                    <i className="bi bi-person-circle"></i>
                    <span>No Image</span>
                  </div>
                  <div className="counsellor-badges">
                    <span className="badge-item badge-experience">
                      <i className="bi bi-clock-history"></i>
                      {counsellor.experience || 0}+ Years
                    </span>
                    <span className="badge-item badge-rating">
                      <i className="bi bi-star-fill"></i>
                      {counsellor.ratings?.average || 'New'}
                    </span>
                    {counsellor.isVerified && (
                      <span className="badge-item badge-verified">
                        <i className="bi bi-patch-check-fill"></i>
                        Verified
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="counsellor-content">
                  <h3 className="counsellor-name">{counsellor.user?.name || 'Counsellor'}</h3>
                  <p className="counsellor-title">Mental Health Professional</p>
                  
                  <div className="tag-container">
                    {(counsellor.languages || []).map((lang, index) => (
                      <span key={index} className="tag tag-language">{lang}</span>
                    ))}
                  </div>
                  
                  <div className="tag-container">
                    {(counsellor.specializations || []).slice(0, 3).map((spec, index) => (
                      <span key={index} className="tag tag-expertise">{spec}</span>
                    ))}
                  </div>
                  
                  <p className="counsellor-bio">{(counsellor.bio || 'Professional counsellor ready to help you.').substring(0, 100)}...</p>
                  
                  <div className="counsellor-details">
                    <div className="fee-info">
                      <span className="fee-amount">₹{counsellor.fees?.video || 'Contact'}</span>
                      <span className="fee-label">per session</span>
                    </div>
                    <div className="availability">
                      <i className="bi bi-calendar-check"></i>
                      Available for booking
                    </div>
                  </div>
                  
                  <div className="counsellor-actions">
                    <Link 
                      to={`/client/counsellors/${counsellor._id}`} 
                      className="btn-view"
                    >
                      View Profile
                    </Link>
                    <Link 
                      to={`/client/book-appointment/${counsellor._id}`} 
                      className="btn-book"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-results">
              <i className="bi bi-search"></i>
              <h3>No counsellors found</h3>
              <p>Try adjusting your filters or search query</p>
              <button 
                className="btn-book mt-3"
                onClick={() => {
                  setSearchQuery('');
                  setFilters({
                    gender: 'all',
                    expertise: 'all',
                    priceRange: 'all',
                    availability: 'all'
                  });
                  setFilteredCounsellors(counsellors);
                }}
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CounsellorFinder;