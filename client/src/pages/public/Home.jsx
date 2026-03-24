import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { clientAPI } from '../../services/api';
import { TESTIMONIALS, CARE_OPTIONS, WHY_CHOOSE_US, FEATURES } from '../../constants';
import SectionHeader from '../../components/ui/SectionHeader';
import TestimonialCard from '../../components/ui/TestimonialCard';
import FeatureCard from '../../components/ui/FeatureCard';
import CareOptionCard from '../../components/ui/CareOptionCard';
import IconCard from '../../components/ui/IconCard';
import ConditionsSection from '../../components/home/ConditionsSection';
import GalleryCarousel from '../../components/home/GalleryCarousel';
import WelcomePopup from '../../components/shared/WelcomePopup';
import CounsellorGallery from '../../components/home/CounsellorGallery';
import FounderSection from '../../components/home/FounderSection';
import ClinicGallery from '../../components/home/ClinicGallery';
import AppointmentRequestSection from '../../components/home/AppointmentRequestSection';
import MarqueeBanner from '../../components/ui/MarqueeBanner';
import HeroImage from '../../assets/woman-psychologist.jpg';
import JustDialImage from '../../assets/justdial.jpg';
import HeroBg from '../../assets/hero.jpg';

const Home = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedCounsellor, setSelectedCounsellor] = useState(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingStep, setBookingStep] = useState(1);
  const [isAvailable, setIsAvailable] = useState(false);
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchCounsellors();
  }, []);

  const fetchCounsellors = async () => {
    try {
      const { cmsAPI } = await import('../../services/api');
      const res = await cmsAPI.getPublicCounsellors();
      setCounsellors(res.data.data.slice(0, 3));
    } catch (err) {
      console.error('Failed to load counsellors:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleBookSession = (counsellor) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/consilar' } });
      return;
    }
    navigate('/client/counsellors');
  };
  
  const handleCloseModal = () => {
    setShowBookingModal(false);
  };
  
  const handleCheckAvailability = () => {
    // In a real app, this would make an API call to check availability
    // For demo purposes, we'll simulate a check with a timeout
    setBookingStep(2);
    setTimeout(() => {
      setIsAvailable(true);
      setBookingStep(3);
    }, 1000);
  };
  
  const handleConfirmBooking = () => {
    // In a real app, this would make an API call to confirm the booking
    alert(`Booking confirmed with ${selectedCounsellor.name} on ${bookingDate} at ${bookingTime}`);
    setShowBookingModal(false);
  };

  return (
    <>
      <WelcomePopup />
      {/* Hero Section */}
      <section className="hero-section" style={{ backgroundImage: `url(${HeroBg})`, backgroundSize: 'cover', backgroundPosition: 'center', position: 'relative', marginTop: '-100px', paddingTop: '180px', paddingBottom: '80px' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.5)', zIndex: 0 }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1, paddingTop: '20px' }}>
          <div className="row align-items-center">
            <div className="col-lg-6 order-2 order-lg-1">
              <h1 className="display-2 font-bold mb-4 mobile-h1" style={{ color: '#000' }}>Trust S S Psychologist Life Care with your mental health</h1>
              <p className="lead mb-4" style={{ color: '#333' }}>Our mission is simple: to help you feel better, get better and stay better.</p>
              <p className="mb-4" style={{ color: '#555' }}>We bring together self-care, support from qualified therapists and psychiatrists, as well as community access to deliver the best quality mental healthcare for your needs.</p>
              <div className="d-grid gap-3 d-md-flex justify-content-md-start mb-4">
                <Link to="/consilar" className="btn btn-primary btn-lg">Book Session</Link>
                <Link to="/about" className="btn btn-secondary btn-lg">Learn More</Link>
              </div>
              <div className="hero-features d-flex flex-wrap gap-4 mt-4">
                <div className="feature-item d-flex align-items-center">
                  <div className="feature-icon me-2">
                    <i className="bi bi-shield-check"></i>
                  </div>
                  <span>Verified Professionals</span>
                </div>
                <div className="feature-item d-flex align-items-center">
                  <div className="feature-icon me-2">
                    <i className="bi bi-camera-video"></i>
                  </div>
                  <span>Secure Video Sessions</span>
                </div>
                <div className="feature-item d-flex align-items-center">
                  <div className="feature-icon me-2">
                    <i className="bi bi-calendar-check"></i>
                  </div>
                  <span>Flexible Scheduling</span>
                </div>
              </div>
            </div>
            <div className="col-lg-6 order-1 order-lg-2 mb-4 mb-lg-0">
              <div className="hero-image-container">
                <img src={HeroImage} alt="Mental Health Support" className="img-fluid hero-image" />
                <div className="hero-shape-1"></div>
                <div className="hero-shape-2"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

     

      <MarqueeBanner 
        items={[
          { icon: 'bi bi-star-fill', text: 'Online Sessions Starting from ₹850 per Hour' }
        ]} 
        speed={25} 
      />

       {/* JustDial Section */}
      <section className="py-4 bg-light">
        <div className="container">
          <div className="text-center">
            <img src={JustDialImage} alt="JustDial" className="img-fluid" style={{ maxWidth: '800px', width: '100%' }} />
          </div>
        </div>
      </section>

      
{/* Featured Counsellors */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h6 className="text-primary fw-bold mb-2">OUR EXPERTS</h6>
            <h2 className="mb-4">Featured Counsellors</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
              Our team consists of qualified and experienced mental health professionals dedicated to providing the best care.
            </p>
          </div>
          {!loading && counsellors.length > 0 ? (
            <div className="row g-4">
              {counsellors.map((counsellor, index) => (
                <div className="col-md-6 col-lg-4" key={counsellor._id}>
                  <div className={`card team-card ${index === 0 ? 'card-gradient-blue' : index === 1 ? 'card-gradient-green' : 'card-gradient-purple'} border-0 shadow-sm`}>
                    <div className="team-image-wrapper">
                      <img 
                        src={counsellor.user?.avatar || 'https://via.placeholder.com/400'}
                        alt={counsellor.user?.name}
                        className="card-img-top"
                        style={{ 
                          height: '400px',
                          objectFit: 'cover',
                          objectPosition: 'top center'
                        }}
                      />
                    </div>
                    <div className="card-body text-center p-4">
                      <h5 className="card-title mb-1">{counsellor.user?.name}</h5>
                      <p className="text-primary mb-3">{counsellor.specializations?.join(', ') || 'Mental Health Professional'}</p>
                      <p className="card-text text-muted mb-2">
                        {counsellor.experience ? `${counsellor.experience} years of experience` : 'Experienced professional'}
                      </p>
                      <p className="fw-bold text-success mb-3">Online fees: ₹{counsellor.fees?.video || counsellor.fees || 850} per session</p>
                      <button className="btn btn-primary w-100" onClick={() => handleBookSession(counsellor)}>Book Session</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              {loading ? (
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <p className="text-muted">No counsellors available at the moment.</p>
              )}
            </div>
          )}
          <div className="text-center mt-4">
            <Link to="/consilar" className="btn btn-primary">
              <i className="bi bi-people me-2"></i>View All Counsellors
            </Link>
          </div>
        </div>
      </section>

      {/* Counsellor Gallery */}

      {/* Founder Section */}
      <FounderSection />

      {/* Appointment Request Section */}

      <CounsellorGallery />

      
      {/* Clinic Gallery */}
      <ClinicGallery />

      {/* Professional Credentials Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h6 className="section-subtitle">EXPERT CARE</h6>
              <h2 className="section-title mobile-h2">Led by <span className="text-gradient">Experienced Professionals</span></h2>
              <p className="lead mb-4">RCI Registered Psychologist with 20 years of counselling experience and clinical knowledge</p>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-award text-primary fs-3 me-3"></i>
                        <h6 className="mb-0">MA (Clinical Psychology)</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-mortarboard text-success fs-3 me-3"></i>
                        <h6 className="mb-0">PG Diploma in Rehabilitation Psychology</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-patch-check text-info fs-3 me-3"></i>
                        <h6 className="mb-0">Diploma in Intellectual Disability</h6>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-2">
                        <i className="bi bi-shield-check text-warning fs-3 me-3"></i>
                        <h6 className="mb-0">RCI Registered</h6>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card border-0 shadow-lg">
                <div className="card-body p-4">
                  <h5 className="text-primary mb-3">Our Locations</h5>
                  <div className="mb-3">
                    <div className="d-flex align-items-start mb-2">
                      <i className="bi bi-geo-alt-fill text-primary me-2 mt-1"></i>
                      <div>
                        <strong>Main Branch - Dwarka</strong>
                        <p className="mb-0 text-muted">Flat No 30A DDA Flat Pocket 2, Dr Lean, Dwarka Sector 6-110075</p>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex align-items-start mb-2">
                      <i className="bi bi-geo-alt-fill text-success me-2 mt-1"></i>
                      <div>
                        <strong>West Delhi Branch - Paschim Vihar</strong>
                        <p className="mb-0 text-muted">A15 Second Floor LIC Colony, Paschim Vihar, 110087<br/>(Near St Marks School Meerabagh)</p>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex align-items-start mb-2">
                      <i className="bi bi-geo-alt-fill text-info me-2 mt-1"></i>
                      <div>
                        <strong>South Delhi Branch - Vasant Kunj</strong>
                        <p className="mb-0 text-muted">Harcharan Bagh, 773, Sector A Main Rd, near BSES Office, Desu Colony, Vasant Kunj, New Delhi, Delhi 110070</p>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-telephone-fill text-primary me-2"></i>
                    <div>
                      <a href="tel:9716129129" className="text-decoration-none me-3">9716129129</a>
                      <a href="tel:9899555507" className="text-decoration-none">9899555507</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why S S Psychologist Life Care Section */}
      <section className="why-section">
        <div className="container">
          <SectionHeader 
            subtitle="WHY CHOOSE US" 
            title="Why S S Psychologist Life Care" 
            description="We're committed to providing comprehensive mental health support with a focus on quality, accessibility, and personalized care."
          />
          <div className="row g-4">
            {WHY_CHOOSE_US.map(item => (
              <div key={item.id} className="col-md-6 col-lg-3">
                <IconCard {...item} />
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* What are you struggling with Section */}
      <ConditionsSection />
      
      {/* Gallery Carousel */}
      <GalleryCarousel />
      
      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <SectionHeader 
            subtitle="OUR SERVICES" 
            title="How We Can Help You" 
            description="Our platform offers comprehensive mental health support through various services designed to meet your unique needs."
          />
          <div className="row g-4">
            {FEATURES.map(feature => (
              <div key={feature.id} className="col-md-4">
                <FeatureCard {...feature} />
              </div>
            ))}
          </div>
        </div>
      </section>

      

      {/* Testimonials */}
      <section className="py-5">
        <div className="container">
          <SectionHeader 
            subtitle="TESTIMONIALS" 
            title="What Our Clients Say" 
            description="Don't just take our word for it. Here's what people who have used our platform have to say about their experience."
          />
          <div className="row g-4">
            {TESTIMONIALS.map(testimonial => (
              <div key={testimonial.id} className="col-md-6 col-lg-4">
                <TestimonialCard {...testimonial} />
              </div>
            ))}
          </div>
          <div className="text-center mt-4">
            <button className="btn btn-outline-primary" onClick={(e) => e.preventDefault()}>
              <i className="bi bi-chat-quote me-2"></i>Read More Testimonials
            </button>
          </div>
        </div>
      </section>

      {/* Not sure what kind of care you need? Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <SectionHeader 
            subtitle="FIND YOUR PATH" 
            title="Not Sure What Kind of Care You Need?" 
            description="We offer different types of mental health support to meet your specific needs. Explore your options below."
          />
          <div className="row g-4">
            {CARE_OPTIONS.map(option => (
              <div key={option.id} className="col-md-4">
                <CareOptionCard {...option} />
              </div>
            ))}
          </div>
          <div className="text-center mt-5">
            <Link to="/contact" className="btn btn-primary btn-lg">
              <i className="bi bi-question-circle me-2"></i>Still Not Sure? Contact Us for Guidance
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="row align-items-center">
              <div className="col-lg-8 mb-4 mb-lg-0">
                <h2 className="mb-3 text-white">Ready to Take the First Step?</h2>
                <p className="lead mb-0 text-white">Join thousands who have improved their mental well-being with our platform.</p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <Link to="/register" className="btn btn-light btn-lg">Get Started Today</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h4>Book a Session with {selectedCounsellor?.user?.name}</h4>
              <button className="close-btn" onClick={handleCloseModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            
            <div className="modal-body p-4">
              {bookingStep === 1 && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Select Date</label>
                    <input 
                      type="date" 
                      className="form-control" 
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label">Select Time</label>
                    <select 
                      className="form-control"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      required
                    >
                      <option value="">Choose a time slot</option>
                      <option value="09:00">09:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="12:00">12:00 PM</option>
                      <option value="14:00">02:00 PM</option>
                      <option value="15:00">03:00 PM</option>
                      <option value="16:00">04:00 PM</option>
                      <option value="17:00">05:00 PM</option>
                    </select>
                  </div>
                  
                  <button 
                    className="btn btn-primary w-100" 
                    onClick={handleCheckAvailability}
                    disabled={!bookingDate || !bookingTime}
                  >
                    Check Availability
                  </button>
                </>
              )}
              
              {bookingStep === 2 && (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Checking availability...</p>
                </div>
              )}
              
              {bookingStep === 3 && (
                <>
                  {isAvailable ? (
                    <div className="text-center py-3">
                      <i className="bi bi-check-circle text-success" style={{ fontSize: '3rem' }}></i>
                      <h5 className="mt-3">Time Slot Available!</h5>
                      <p className="mb-4">The selected time slot is available for booking.</p>
                      <div className="d-flex justify-content-between">
                        <button className="btn btn-outline-secondary" onClick={() => setBookingStep(1)}>
                          Change Time
                        </button>
                        <button className="btn btn-success" onClick={handleConfirmBooking}>
                          Confirm Booking
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-3">
                      <i className="bi bi-x-circle text-danger" style={{ fontSize: '3rem' }}></i>
                      <h5 className="mt-3">Time Slot Unavailable</h5>
                      <p className="mb-4">Please select a different time or date.</p>
                      <button className="btn btn-primary" onClick={() => setBookingStep(1)}>
                        Try Another Time
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;