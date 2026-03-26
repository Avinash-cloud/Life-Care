import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cmsAPI } from '../../services/api';
import SectionHeader from '../ui/SectionHeader';
// import './OffersSection.css'; // We'll just write inline styles or use existing classes instead to keep it simple, but let's use bootstrap classes

const OffersSection = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await cmsAPI.getOffers();
      setOffers(response.data.data);
    } catch (error) {
      console.error('Failed to fetch offers:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || offers.length === 0) {
    return null; // Don't show the section if no active offers
  }

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <section className="py-5 bg-white offers-section">
      <div className="container">
        <SectionHeader 
          subtitle="SPECIAL OFFERS" 
          title="Exclusive Schemes & Discounts" 
          description="Take advantage of our current special offers designed to make quality mental healthcare more accessible."
        />
        
        <div className="row g-4 justify-content-center">
          {offers.map((offer) => (
            <div key={offer._id} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm offer-card overflow-hidden">
                {offer.discountPercentage > 0 && (
                  <div className="position-absolute top-0 end-0 bg-danger text-white px-3 py-1 rounded-bl" style={{ zIndex: 1, borderBottomLeftRadius: '10px' }}>
                    <strong>{offer.discountPercentage}% OFF</strong>
                  </div>
                )}
                
                {offer.imageUrl ? (
                  <img 
                    src={offer.imageUrl} 
                    className="card-img-top" 
                    alt={offer.title} 
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="bg-primary bg-gradient d-flex align-items-center justify-content-center" style={{ height: '120px' }}>
                    <i className="bi bi-gift text-white" style={{ fontSize: '3rem' }}></i>
                  </div>
                )}
                
                <div className="card-body p-4 text-center">
                  <h5 className="card-title fw-bold mb-3">{offer.title}</h5>
                  <p className="card-text text-muted mb-4">{offer.description}</p>
                  
                  {offer.validUntil && (
                    <div className="mb-3">
                      <small className="text-danger fw-bold">
                        <i className="bi bi-clock-history me-1"></i>
                        Valid until: {formatDate(offer.validUntil)}
                      </small>
                    </div>
                  )}
                  
                  <Link to="/consilar" className="btn btn-outline-primary w-100 mt-auto">
                    Claim Offer
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OffersSection;
