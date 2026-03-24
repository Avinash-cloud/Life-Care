import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import './Counsellors.css';

const Counsellors = () => {
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

  // Mock data for demonstration
  const mockCounsellors = [
    {
      id: 101,
      name: 'Dr. Sarah Johnson',
      photo: 'https://placehold.co/300x300?text=SJ',
      gender: 'female',
      specialization: 'Clinical Psychologist',
      expertise: ['Depression', 'Anxiety', 'PTSD'],
      experience: 8,
      languages: ['English', 'Hindi'],
      rating: 4.8,
      reviewCount: 124,
      fee: 1500,
      nextAvailable: '2023-06-15',
      about: 'Dr. Sarah is a licensed clinical psychologist with 8 years of experience helping individuals overcome depression, anxiety, and trauma.'
    },
    {
      id: 102,
      name: 'Dr. Michael Chen',
      photo: 'https://placehold.co/300x300?text=MC',
      gender: 'male',
      specialization: 'Psychiatrist',
      expertise: ['Bipolar Disorder', 'Schizophrenia', 'Medication Management'],
      experience: 12,
      languages: ['English', 'Mandarin'],
      rating: 4.9,
      reviewCount: 98,
      fee: 1800,
      nextAvailable: '2023-06-14',
      about: 'Dr. Chen specializes in medication management for severe mental health conditions with a compassionate approach to treatment.'
    },
    {
      id: 103,
      name: 'Dr. Emily Rodriguez',
      photo: 'https://placehold.co/300x300?text=ER',
      gender: 'female',
      specialization: 'Therapist',
      expertise: ['Relationship Issues', 'Self-Esteem', 'Career Counselling'],
      experience: 5,
      languages: ['English', 'Spanish'],
      rating: 4.7,
      reviewCount: 87,
      fee: 1200,
      nextAvailable: '2023-06-13',
      about: 'Emily helps clients navigate relationship challenges and build self-confidence through evidence-based therapeutic approaches.'
    },
    {
      id: 104,
      name: 'Dr. Rajesh Kumar',
      photo: 'https://placehold.co/300x300?text=RK',
      gender: 'male',
      specialization: 'Clinical Psychologist',
      expertise: ['Stress Management', 'Anxiety', 'Depression'],
      experience: 10,
      languages: ['English', 'Hindi', 'Punjabi'],
      rating: 4.6,
      reviewCount: 112,
      fee: 1400,
      nextAvailable: '2023-06-16',
      about: 'Dr. Kumar combines traditional and modern therapeutic techniques to help clients manage stress and improve mental wellbeing.'
    }
  ];

  useEffect(() => {
    fetchCounsellors();
  }, []);

  const fetchCounsellors = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cms/counsellors`);
      const data = await res.json();
      if (data.success) {
        setCounsellors(data.data);
        setFilteredCounsellors(data.data);
      } else {
        setCounsellors(mockCounsellors);
        setFilteredCounsellors(mockCounsellors);
      }
    } catch (error) {
      console.error('Error fetching counsellors:', error);
      setCounsellors(mockCounsellors);
      setFilteredCounsellors(mockCounsellors);
    } finally {
      setLoading(false);
    }
  };

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
        counsellor.name.toLowerCase().includes(searchTerm) ||
        counsellor.specialization.toLowerCase().includes(searchTerm) ||
        counsellor.expertise.some(exp => exp.toLowerCase().includes(searchTerm))
      );
    }
    
    // Apply gender filter
    if (currentFilters.gender !== 'all') {
      results = results.filter(counsellor => counsellor.gender === currentFilters.gender);
    }
    
    // Apply expertise filter
    if (currentFilters.expertise !== 'all') {
      results = results.filter(counsellor => 
        counsellor.expertise.some(exp => exp.toLowerCase() === currentFilters.expertise.toLowerCase())
      );
    }
    
    // Apply price range filter
    if (currentFilters.priceRange !== 'all') {
      switch (currentFilters.priceRange) {
        case 'under1000':
          results = results.filter(counsellor => counsellor.fee < 1000);
          break;
        case '1000to1500':
          results = results.filter(counsellor => counsellor.fee >= 1000 && counsellor.fee <= 1500);
          break;
        case 'over1500':
          results = results.filter(counsellor => counsellor.fee > 1500);
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
    <div className="counsellors-page">
      <div className="counsellors-header">
        <h1>Find Your Perfect Match</h1>
        <p>Browse our network of qualified mental health professionals and start your wellness journey today</p>
      </div>

      <div className="search-filter-section">
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
        
        <div className="filters-container">
          <div className="filter-group">
            <label>Gender</label>
            <select 
              value={filters.gender} 
              onChange={(e) => handleFilterChange('gender', e.target.value)}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Expertise</label>
            <select 
              value={filters.expertise} 
              onChange={(e) => handleFilterChange('expertise', e.target.value)}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="Depression">Depression</option>
              <option value="Anxiety">Anxiety</option>
              <option value="PTSD">PTSD</option>
              <option value="Relationship Issues">Relationship Issues</option>
              <option value="Stress Management">Stress Management</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Price Range</label>
            <select 
              value={filters.priceRange} 
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
              className="filter-select"
            >
              <option value="all">All</option>
              <option value="under1000">Under ₹1000</option>
              <option value="1000to1500">₹1000 - ₹1500</option>
              <option value="over1500">Over ₹1500</option>
            </select>
          </div>
        </div>
      </div>

      <div className="counsellors-results">
        <p className="results-count">{filteredCounsellors.length} professionals found</p>
        
        <div className="counsellors-grid">
          {filteredCounsellors.length > 0 ? (
            filteredCounsellors.map(counsellor => (
              <div key={counsellor.id} className="counsellor-card">
                <div className="counsellor-header">
                  <img 
                    src={counsellor.user?.avatar || counsellor.photo || 'https://placehold.co/300x300?text=Avatar'} 
                    alt={counsellor.user?.name || counsellor.name} 
                    className="counsellor-photo"
                  />
                  <div className="counsellor-badges">
                    <span className="badge-item badge-experience">
                      <i className="bi bi-clock-history"></i>
                      {counsellor.experience}+ Years
                    </span>
                  </div>
                </div>
                
                <div className="counsellor-content">
                  <h3 className="counsellor-name">{counsellor.user?.name || counsellor.name}</h3>
                  <p className="counsellor-title">{counsellor.specializations?.[0] || counsellor.specialization}</p>
                  
                  <div className="tag-container">
                    {(counsellor.languages || []).map((lang, index) => (
                      <span key={index} className="tag tag-language">{lang}</span>
                    ))}
                  </div>
                  
                  <div className="tag-container">
                    {(counsellor.specializations || counsellor.expertise || []).slice(0, 3).map((exp, index) => (
                      <span key={index} className="tag tag-expertise">{exp}</span>
                    ))}
                  </div>
                  
                  <p className="counsellor-bio">{(counsellor.bio || counsellor.about || '').substring(0, 100)}...</p>
                  
                  <div className="counsellor-details">
                    <div className="fee-info">
                      <span className="fee-amount">₹{counsellor.fees?.video || counsellor.fee || 1500}</span>
                      <span className="fee-label">per session</span>
                    </div>
                  </div>
                  
                  <div className="counsellor-actions">
                    <Link 
                      to={`/client/counsellors/${counsellor._id || counsellor.id}`} 
                      className="btn-view"
                    >
                      View Profile
                    </Link>
                    <Link 
                      to={`/client/book-appointment/${counsellor._id || counsellor.id}`} 
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

export default Counsellors;