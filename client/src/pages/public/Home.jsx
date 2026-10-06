import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { clientAPI } from '../../services/api';
import { TESTIMONIALS, CARE_OPTIONS, WHY_CHOOSE_US, FEATURES } from '../../constants';
import { ASSESSMENTS_LIST } from '../../constants/assessmentsData';
import SectionHeader from '../../components/ui/SectionHeader';
import TestimonialCard from '../../components/ui/TestimonialCard';
import FeatureCard from '../../components/ui/FeatureCard';
import CareOptionCard from '../../components/ui/CareOptionCard';
import IconCard from '../../components/ui/IconCard';
import ConditionsSection from '../../components/home/ConditionsSection';
import GalleryCarousel from '../../components/home/GalleryCarousel';
import WelcomePopup from '../../components/shared/WelcomePopup';
import OffersSection from '../../components/home/OffersSection';
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
    if (counsellor?._id) {
      navigate(`/consilar?counsellor=${counsellor._id}`);
    } else {
      navigate('/consilar');
    }
  };
  
  const handleCloseModal = () => {
    setShowBookingModal(false);
  };
  
  const handleCheckAvailability = () => {
    setBookingStep(2);
    setTimeout(() => {
      setIsAvailable(true);
      setBookingStep(3);
    }, 1000);
  };
  
  const handleConfirmBooking = () => {
    alert(`Booking confirmed with ${selectedCounsellor.name} on ${bookingDate} at ${bookingTime}`);
    setShowBookingModal(false);
  };

  const featuredAssessments = ASSESSMENTS_LIST && ASSESSMENTS_LIST.length > 0 
    ? ASSESSMENTS_LIST.slice(0, 6) 
    : [];

  return (
    <>
      <WelcomePopup />
      {/* Hero Section */}
      <section 
        className="hero-section hero-mobile-adjusted" 
        style={{ 
          backgroundImage: `url(${HeroBg})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          position: 'relative' 
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255, 255, 255, 0.55)', zIndex: 0 }}></div>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="row align-items-center">
            {/* Headline and CTAs first on mobile so user sees value & actions without scrolling */}
            <div className="col-lg-6 order-1 order-lg-1">
              <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-bold text-uppercase mb-3 d-inline-block">
                Registered Psychological Healthcare
              </span>
              <h1 className="display-4 fw-bold mb-3 mobile-h1" style={{ color: '#1b3c59', lineHeight: 1.2 }}>
                Trust S S Psych Life Care with your mental health
              </h1>
              <p className="lead mb-3" style={{ color: '#2a3441', fontWeight: 500 }}>
                Our mission is simple: to help you feel better, get better and stay better.
              </p>
              <p className="mb-4 text-muted" style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                We bring together self-care tools, certified clinical psychologists, psychiatrists, and personalized treatment plans to deliver compassionate, confidential mental healthcare.
              </p>
              
              <div className="d-grid gap-2 d-sm-flex justify-content-sm-start mb-4 hero-action-buttons">
                <Link to="/consilar" className="btn btn-primary btn-lg px-4 shadow-sm">
                  <i className="bi bi-calendar-check me-2"></i>Book Consultation
                </Link>
                <a href="#clinical-assessments" className="btn btn-outline-primary btn-lg px-4">
                  <i className="bi bi-clipboard-pulse me-2"></i>Take Assessment
                </a>
              </div>
              
              <div className="hero-features d-flex flex-wrap gap-3 gap-md-4 mt-2">
                <div className="feature-item d-flex align-items-center">
                  <div className="feature-icon me-2 text-success">
                    <i className="bi bi-shield-check fs-5"></i>
                  </div>
                  <span className="small fw-semibold">RCI Verified Professionals</span>
                </div>
                <div className="feature-item d-flex align-items-center">
                  <div className="feature-icon me-2 text-primary">
                    <i className="bi bi-camera-video fs-5"></i>
                  </div>
                  <span className="small fw-semibold">Secure Video & Clinic</span>
                </div>
                <div className="feature-item d-flex align-items-center">
                  <div className="feature-icon me-2 text-teal">
                    <i className="bi bi-calendar-check fs-5"></i>
                  </div>
                  <span className="small fw-semibold">Flexible Scheduling</span>
                </div>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="col-lg-6 order-2 order-lg-2 mb-4 mb-lg-0 mt-4 mt-lg-0">
              <div className="hero-image-container text-center">
                <img 
                  src={HeroImage} 
                  alt="Mental Health Psychologist Consultation" 
                  className="img-fluid hero-image rounded-4 shadow"
                  style={{ maxHeight: '420px', width: 'auto', objectFit: 'cover' }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marquee Banner */}
      <MarqueeBanner 
        items={[
          { icon: 'bi bi-star-fill', text: 'Online Sessions Starting from ₹850 per Hour' },
          { icon: 'bi bi-geo-alt-fill', text: 'Main Branch: Paschim Vihar | Branches in Dwarka & Vasant Kunj' },
          { icon: 'bi bi-shield-check', text: '100% Confidential Clinical Well-Being Screeners' }
        ]} 
        speed={25} 
      />

      {/* ========================================================
          Clinical Self-Assessment Section (First Page Section)
          ======================================================== */}
      <section id="clinical-assessments" className="py-5 clinical-assessments-home-section">
        <div className="container">
          <div className="text-center mb-4">
            <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill fw-bold text-uppercase mb-2" style={{ fontSize: '0.78rem', letterSpacing: '0.05em' }}>
              <i className="bi bi-patch-check-fill me-1"></i> Standardized Clinical Tools
            </span>
            <h2 className="display-6 fw-bold mb-2" style={{ color: '#1b3c59' }}>
              Free & Confidential Psychological Assessments
            </h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '720px', fontSize: '1rem', lineHeight: 1.6 }}>
              Take 2-to-4 minute evidence-based clinical screeners curated by licensed psychologists to gain immediate clarity on your symptoms and emotional well-being.
            </p>
          </div>

          {/* Featured Assessments Grid */}
          <div className="row g-3 g-md-4 mb-4">
            {featuredAssessments.map((test) => (
              <div className="col-12 col-md-6 col-lg-4" key={test.id}>
                <div className="card h-100 border-0 shadow-sm assessment-home-card bg-white" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-4 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="badge bg-light text-primary border px-2.5 py-1 rounded-pill" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                        {test.scaleName || test.category?.toUpperCase()}
                      </span>
                      <span className="text-muted small">
                        <i className="bi bi-clock me-1"></i>{test.duration}
                      </span>
                    </div>
                    
                    <h5 className="card-title fw-bold mt-2 mb-2" style={{ color: '#1b3c59', fontSize: '1.125rem' }}>
                      {test.title}
                    </h5>
                    
                    <p className="card-text text-muted small mb-3 flex-grow-1" style={{ lineHeight: 1.6 }}>
                      {test.description}
                    </p>
                    
                    <div className="mb-3 text-muted small p-2 rounded bg-light">
                      <strong className="text-dark">Measures:</strong> {test.measures}
                    </div>
                    
                    <Link
                      to={test.id === 'wellness-game' ? '/game' : `/assessments/${test.id}`}
                      className="btn btn-outline-success w-100 fw-bold d-flex align-items-center justify-content-center gap-2 py-2 mt-auto"
                      style={{ borderRadius: '10px' }}
                    >
                      <span>Start Assessment</span>
                      <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Clinical Assessment Disclaimer Box */}
          <div className="card border-0 shadow-sm mb-4" style={{ backgroundColor: '#ffffff', borderRadius: '14px', borderLeft: '4px solid #10b981' }}>
            <div className="card-body p-3 p-md-4 d-flex align-items-start gap-3">
              <i className="bi bi-shield-check text-success fs-3 flex-shrink-0 mt-1"></i>
              <div>
                <h6 className="fw-bold text-success mb-1">Clinical Assessment & Diagnostic Disclaimer</h6>
                <p className="mb-0 text-muted small" style={{ lineHeight: 1.6 }}>
                  The online psychological screening assessments provided here are evidence-informed self-evaluation tools designed solely for informational, reflective, and educational purposes. <strong>They do not constitute a clinical psychiatric diagnosis, formal medical evaluation, or treatment plan.</strong> A formal mental health diagnosis can only be determined by a qualified clinical psychologist or licensed medical psychiatrist through a comprehensive diagnostic consultation. If your results suggest elevated stress or emotional distress, we warmly invite you to book a confidential consultation with our certified clinical team.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="text-center">
            <Link to="/assessments" className="btn btn-primary btn-lg px-4 me-sm-3 mb-2">
              <i className="bi bi-grid-3x3-gap me-2"></i>Explore All 10+ Assessments
            </Link>
            <Link to="/consilar" className="btn btn-outline-primary btn-lg px-4 mb-2">
              <i className="bi bi-calendar-check me-2"></i>Book Consultation
            </Link>
          </div>
        </div>
      </section>

       {/* JustDial Section */}
      <section className="py-4 bg-light">
        <div className="container">
          <div className="text-center">
            <img src={JustDialImage} alt="JustDial" className="img-fluid" style={{ maxWidth: '800px', width: '100%' }} />
          </div>
        </div>
      </section>

      {/* Offers & Schemes Section */}
      <OffersSection />
      
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
      <AppointmentRequestSection />

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
                  <h5 className="text-primary mb-3">Our Clinic Locations</h5>
                  <div className="mb-3">
                    <div className="d-flex align-items-start mb-2">
                      <i className="bi bi-geo-alt-fill text-primary me-2 mt-1 fs-5"></i>
                      <div>
                        <strong className="text-dark">Main Branch - Paschim Vihar</strong>
                        <p className="mb-0 text-muted">A15 Second Floor LIC Colony, Paschim Vihar, 110087<br/><span className="text-secondary">(Near St Marks School Meerabagh)</span></p>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex align-items-start mb-2">
                      <i className="bi bi-geo-alt-fill text-success me-2 mt-1 fs-5"></i>
                      <div>
                        <strong className="text-dark">Dwarka Branch</strong>
                        <p className="mb-0 text-muted">Flat No 30A DDA Flat Pocket 2, Dr Lean, Dwarka Sector 6 - 110075</p>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex align-items-start mb-2">
                      <i className="bi bi-geo-alt-fill text-info me-2 mt-1 fs-5"></i>
                      <div>
                        <strong className="text-dark">South Delhi Branch - Vasant Kunj</strong>
                        <p className="mb-0 text-muted">Harcharan Bagh, 773, Sector A Main Rd, near BSES Office, Desu Colony, Vasant Kunj, New Delhi, Delhi 110070</p>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="d-flex align-items-center flex-wrap gap-3">
                    <div className="d-flex align-items-center">
                      <i className="bi bi-telephone-fill text-primary me-2"></i>
                      <a href="tel:9716129129" className="fw-bold text-decoration-none text-dark">+91 97161 29129</a>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-telephone-fill text-success me-2"></i>
                      <a href="tel:9899555507" className="fw-bold text-decoration-none text-dark">+91 98995 55507</a>
                    </div>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-envelope-fill text-primary me-2"></i>
                      <a href="mailto:sspsychological5@gmail.com" className="fw-bold text-decoration-none text-dark">sspsychological5@gmail.com</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why SS Psych Life Care Section */}
      <section className="why-section">
        <div className="container">
          <SectionHeader 
            subtitle="WHY CHOOSE US" 
            title="Why SS Psych Life Care" 
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
            <Link to="/about" className="btn btn-outline-primary">
              <i className="bi bi-chat-quote me-2"></i>Learn More About Our Clinic & Team
            </Link>
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