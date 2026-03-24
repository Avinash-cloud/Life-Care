import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cmsAPI } from '../../services/api';
import Logo from '../../assets/explaning.png'

const About = () => {
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCounsellors();
  }, []);

  const fetchCounsellors = async () => {
    try {
      const res = await cmsAPI.getPublicCounsellors();
      setCounsellors(res.data.data || []);
    } catch (err) {
      console.error('Failed to load counsellors:', err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="about-page py-5">
      <div className="container">
        {/* Hero Section */}
        <div className="text-center mb-5">
          <h1 className="mb-3">About S S Psychologist Life Care</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
            We're dedicated to making mental healthcare accessible, affordable, and effective for everyone.
          </p>
        </div>

        {/* About Us Section */}
        <div className="row align-items-center mb-5">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="about-image-container">
              <img 
                // src="https://placehold.co/600x400?text=About+Us" 
                src={Logo} 
                alt="About S S Psychologist Life Care" 
                className="img-fluid rounded-4 shadow"
              />
              <div className="about-shape-1"></div>
              <div className="about-shape-2"></div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="about-content">
              <h6 className="text-primary fw-bold mb-2">OUR STORY</h6>
              <h2 className="mb-4">Bridging the Gap in Mental Healthcare</h2>
              <p className="mb-4">
                S S Psychologist Life Care was founded with a simple yet powerful mission: to make quality mental healthcare accessible to everyone. 
                Led by an RCI Registered Psychologist with 20 years of counselling experience and clinical knowledge, we provide expert mental health support.
              </p>
              <p className="mb-4">
                Our platform brings together qualified mental health professionals and individuals seeking support in a secure, 
                convenient, and confidential online environment. We believe that everyone deserves access to quality mental healthcare, 
                regardless of their location or circumstances.
              </p>
              <div className="mb-4">
                <h6 className="text-primary fw-bold mb-3">Professional Qualifications:</h6>
                <ul className="list-unstyled">
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>MA (Clinical Psychology)</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>PG Diploma in Rehabilitation Psychology</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>Diploma in Intellectual Disability</li>
                  <li className="mb-2"><i className="bi bi-check-circle-fill text-success me-2"></i>RCI Registered Psychologist</li>
                </ul>
              </div>
              <div className="d-flex align-items-center mb-4">
                <div className="me-4">
                  <h3 className="text-primary mb-0">20+</h3>
                  <p className="text-muted mb-0">Years Experience</p>
                </div>
                <div>
                  <h3 className="text-primary mb-0">1000+</h3>
                  <p className="text-muted mb-0">Clients Helped</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mission & Vision Section */}
        <div className="row mb-5">
          <div className="col-lg-6 mb-4 mb-lg-0">
            <div className="card h-100 border-0 shadow-sm card-gradient-blue">
              <div className="card-body p-4">
                <h6 className="text-primary fw-bold mb-2">OUR MISSION</h6>
                <h3 className="mb-4">What We Strive For</h3>
                <p className="mb-4">
                  Our mission is to make mental healthcare accessible, affordable, and effective for everyone. 
                  We aim to break down barriers to mental health support and create a world where seeking help 
                  for mental health concerns is as normal as seeking help for physical health.
                </p>
                <ul className="vision-list">
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-2"></i>
                    <span>Provide accessible mental healthcare to all</span>
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-2"></i>
                    <span>Connect clients with qualified professionals</span>
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-2"></i>
                    <span>Ensure confidentiality and security in all interactions</span>
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill text-primary me-2"></i>
                    <span>Promote mental health awareness and education</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card h-100 border-0 shadow-sm card-gradient-green">
              <div className="card-body p-4">
                <h6 className="text-primary fw-bold mb-2">OUR VISION</h6>
                <h3 className="mb-4">Where We're Headed</h3>
                <p className="mb-4">
                  We envision a world where mental health is prioritized as much as physical health, 
                  where seeking help is stigma-free, and where quality mental healthcare is available to everyone, 
                  regardless of their location, background, or circumstances.
                </p>
                <ul className="vision-list">
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-2"></i>
                    <span>Create a stigma-free environment for mental health</span>
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-2"></i>
                    <span>Expand our services to reach underserved communities</span>
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-check-circle-fill text-primary me-2"></i>
                    <span>Innovate in mental healthcare delivery</span>
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill text-primary me-2"></i>
                    <span>Build a global community of mental health advocates</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Our Values Section */}
        <div className="values-section py-5 rounded-4 mb-5">
          <div className="container">
            <div className="text-center mb-5">
              <h6 className="text-primary fw-bold mb-2">OUR VALUES</h6>
              <h2 className="mb-4">What Guides Us</h2>
              <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
                Our core values shape everything we do, from how we design our platform to how we interact with our clients and counsellors.
              </p>
            </div>
            <div className="row g-4">
              <div className="col-md-6 col-lg-3">
                <div className="card value-card h-100 border-0 shadow-sm">
                  <div className="card-body text-center p-4">
                    <div className="value-icon-wrapper mb-4">
                      <i className="bi bi-shield-check"></i>
                    </div>
                    <h5 className="card-title mb-3">Trust & Security</h5>
                    <p className="card-text text-muted">We prioritize the confidentiality and security of all interactions on our platform.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="card value-card h-100 border-0 shadow-sm">
                  <div className="card-body text-center p-4">
                    <div className="value-icon-wrapper mb-4">
                      <i className="bi bi-heart"></i>
                    </div>
                    <h5 className="card-title mb-3">Compassion</h5>
                    <p className="card-text text-muted">We approach every client with empathy, understanding, and genuine care.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="card value-card h-100 border-0 shadow-sm">
                  <div className="card-body text-center p-4">
                    <div className="value-icon-wrapper mb-4">
                      <i className="bi bi-stars"></i>
                    </div>
                    <h5 className="card-title mb-3">Excellence</h5>
                    <p className="card-text text-muted">We strive for excellence in all aspects of our service and continuously improve.</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="card value-card h-100 border-0 shadow-sm">
                  <div className="card-body text-center p-4">
                    <div className="value-icon-wrapper mb-4">
                      <i className="bi bi-people"></i>
                    </div>
                    <h5 className="card-title mb-3">Inclusivity</h5>
                    <p className="card-text text-muted">We welcome and respect people of all backgrounds, identities, and experiences.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Our Team Section */}
        <div className="mb-5">
          <div className="text-center mb-5">
            <h6 className="text-primary fw-bold mb-2">OUR TEAM</h6>
            <h2 className="mb-4">Meet Our Experts</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
              Our team consists of qualified and experienced mental health professionals dedicated to providing the best care.
            </p>
          </div>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : counsellors.length > 0 ? (
            <div className="row g-4">
              {counsellors.slice(0, 6).map((counsellor, index) => (
                <div className="col-md-6 col-lg-4" key={counsellor._id}>
                  <div className={`card team-card ${index % 3 === 0 ? 'card-gradient-blue' : index % 3 === 1 ? 'card-gradient-green' : 'card-gradient-purple'} border-0 shadow-sm`}>
                    <div className="team-image-wrapper">
                      <img 
                        src={counsellor.user?.avatar || 'https://placehold.co/400x400?text=Counsellor'} 
                        alt={counsellor.user?.name} 
                        className="card-img-top"
                      />
                    </div>
                    <div className="card-body text-center p-4">
                      <h5 className="card-title mb-1">{counsellor.user?.name}</h5>
                      <p className="text-primary mb-3">{counsellor.specializations?.[0] || 'Mental Health Professional'}</p>
                      <p className="card-text text-muted mb-3">
                        {counsellor.bio || `Specializes in ${counsellor.specializations?.join(', ') || 'mental health'} with ${counsellor.experience || 'several'} years of experience.`}
                      </p>
                      <div className="team-social">
                        <a href="#" className="team-social-icon"><i className="bi bi-linkedin"></i></a>
                        <a href="#" className="team-social-icon"><i className="bi bi-twitter"></i></a>
                        <a href="#" className="team-social-icon"><i className="bi bi-envelope"></i></a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <p className="text-muted">No counsellors available at the moment.</p>
            </div>
          )}
        </div>

        {/* Security Section */}
        <div className="card border-0 shadow mb-5 card-gradient-orange">
          <div className="card-body p-4">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-4 mb-lg-0">
                <h6 className="text-primary fw-bold mb-2">YOUR PRIVACY MATTERS</h6>
                <h3 className="mb-4">Security & Confidentiality</h3>
                <p className="mb-4">
                  We take your privacy and security seriously. Our platform uses end-to-end encryption for all video sessions 
                  and chats, ensuring that your conversations remain private and confidential.
                </p>
                <ul className="vision-list">
                  <li className="mb-3">
                    <i className="bi bi-shield-check text-primary me-2"></i>
                    <span>End-to-end encrypted video sessions</span>
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-shield-check text-primary me-2"></i>
                    <span>Secure data storage and handling</span>
                  </li>
                  <li className="mb-3">
                    <i className="bi bi-shield-check text-primary me-2"></i>
                    <span>Strict confidentiality policies</span>
                  </li>
                  <li>
                    <i className="bi bi-shield-check text-primary me-2"></i>
                    <span>Compliance with data protection regulations</span>
                  </li>
                </ul>
              </div>
              <div className="col-lg-6">
                <img 
                  src="https://placehold.co/600x400?text=Security" 
                  alt="Security & Confidentiality" 
                  className="img-fluid rounded-4"
                />
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
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
      </div>
    </div>
  );
};

export default About;