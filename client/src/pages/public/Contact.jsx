import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { leadAPI } from '../../services/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage('');
    
    try {
      await leadAPI.createCallback({
        name: formData.name,
        phoneNumber: formData.phone || 'Phone not provided',
        email: formData.email,
        subject: formData.subject,
        source: 'contact_page',
        primaryConcern: `${formData.subject ? `[${formData.subject}] ` : ''}${formData.message}`
      });
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (err) {
      console.error('Contact form error:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to send message. Please contact us directly at 9716129129.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="mb-3">Contact <span className="text-gradient">Us</span></h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Have questions or need support? We're here to help. Reach out to our psychological care team through any of the channels below.
          </p>
        </div>

        <div className="row mb-5">
          <div className="col-md-5 mb-4 mb-md-0">
            <div className="card contact-info-card h-100 shadow-sm border-0">
              <div className="card-body p-4">
                <div className="d-flex align-items-start mb-4">
                  <div className="contact-icon me-3 mt-1">
                    <i className="bi bi-geo-alt-fill text-primary fs-4"></i>
                  </div>
                  <div>
                    <h5 className="mb-2 fw-bold">Our Consultation Branches</h5>
                    <p className="mb-2 text-dark">
                      <strong className="text-primary">Main Branch:</strong><br />
                      A15 Second Floor LIC Colony, Paschim Vihar, 110087<br />
                      <span className="small text-muted">(Near St Marks School Meerabagh)</span>{' '}
                      <a 
                        href="https://share.google/pWEO0c1h3q46el5zY" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="badge bg-primary-subtle text-primary text-decoration-none ms-1"
                        title="Open in Google Maps"
                      >
                        <i className="bi bi-geo-alt-fill me-1"></i>Google Maps ↗
                      </a>
                    </p>
                    <p className="mb-2 text-dark">
                      <strong className="text-primary">Dwarka Branch:</strong><br />
                      Flat No 30A DDA Flat Pocket 2, Dr Lean, Dwarka Sector 6 - 110075
                    </p>
                    <p className="mb-0 text-dark">
                      <strong className="text-primary">South Delhi Branch:</strong><br />
                      Harcharan Bagh, 773, Sector A Main Rd, near BSES Office, Desu Colony, Vasant Kunj, New Delhi - 110070
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-4">
                  <div className="contact-icon me-3">
                    <i className="bi bi-telephone-fill text-primary fs-4"></i>
                  </div>
                  <div>
                    <h5 className="mb-1 fw-bold">Direct Helpline Numbers</h5>
                    <p className="mb-1">
                      <a href="tel:9716129129" className="text-dark fw-semibold text-decoration-none">
                        <i className="bi bi-telephone me-1 text-primary"></i> 9716129129
                      </a>
                    </p>
                    <p className="mb-0">
                      <a href="tel:9899555507" className="text-dark fw-semibold text-decoration-none">
                        <i className="bi bi-telephone me-1 text-primary"></i> 9899555507
                      </a>
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-4">
                  <div className="contact-icon me-3">
                    <i className="bi bi-envelope-fill text-primary fs-4"></i>
                  </div>
                  <div>
                    <h5 className="mb-1 fw-bold">Clinic Email</h5>
                    <p className="mb-0">
                      <a href="mailto:sspsychological5@gmail.com" className="text-dark fw-semibold text-decoration-none">
                        sspsychological5@gmail.com
                      </a>
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-center">
                  <div className="contact-icon me-3">
                    <i className="bi bi-clock-fill text-primary fs-4"></i>
                  </div>
                  <div>
                    <h5 className="mb-1 fw-bold">Working Hours</h5>
                    <p className="mb-0 text-muted">7 Days a Week (Starting 9:00 AM Daily)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-7">
            <div className="card contact-form-card h-100 shadow-sm border-0">
              <div className="card-body p-4">
                <h4 className="mb-3 fw-bold">Send us a Message / Enquiry</h4>
                <p className="text-muted small mb-4">
                  Fill out your details below. Your enquiry will be received directly by our clinic team in the admin portal.
                </p>

                {submitted && (
                  <div className="alert alert-success d-flex align-items-center">
                    <i className="bi bi-check-circle-fill me-2 fs-5"></i>
                    <div>Thank you for your message! Our clinical team has received your enquiry and will respond promptly.</div>
                  </div>
                )}

                {errorMessage && (
                  <div className="alert alert-danger d-flex align-items-center">
                    <i className="bi bi-exclamation-circle-fill me-2 fs-5"></i>
                    <div>{errorMessage}</div>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          placeholder="Your Name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="name">Your Full Name *</label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          placeholder="Your Email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="email">Your Email *</label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input
                          type="tel"
                          className="form-control"
                          id="phone"
                          name="phone"
                          placeholder="Your Phone Number"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="phone">Phone / WhatsApp Number *</label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="subject"
                          name="subject"
                          placeholder="Subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        />
                        <label htmlFor="subject">Subject / Primary Concern *</label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <textarea
                          className="form-control"
                          id="message"
                          name="message"
                          placeholder="Your Message"
                          style={{ height: '140px' }}
                          value={formData.message}
                          onChange={handleChange}
                          required
                        ></textarea>
                        <label htmlFor="message">Your Message / Brief Details</label>
                      </div>
                    </div>

                    <div className="col-12">
                      <button 
                        type="submit" 
                        className="btn btn-primary px-4 py-2.5"
                        disabled={submitting}
                      >
                        {submitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Sending Message...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-send-fill me-2"></i>Send Message
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="card map-card mb-5 border-0 shadow-sm overflow-hidden">
          <div className="card-header bg-white py-3 border-0 d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              
              <h5 className="mb-1 fw-bold">
                <i className="bi bi-geo-alt-fill text-danger me-2"></i>
                SS Psychological Life Care Center — Main Branch
              </h5>
              <p className="small text-muted mb-0">
                A15, Second Floor, Jeevan Niketan (LIC Colony), Paschim Vihar, New Delhi - 110087 (Near St. Mark's School, Meera Bagh)
              </p>
            </div>
            <a 
              href="https://share.google/pWEO0c1h3q46el5zY" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center shadow-sm"
              style={{ fontSize: '0.875rem' }}
            >
              <i className="bi bi-google me-2"></i>
              Open in Google Maps / Directions
              <i className="bi bi-box-arrow-up-right ms-2 small"></i>
            </a>
          </div>
          <div className="card-body p-0">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3500.911933007253!2d77.082426!3d28.6623524!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d05909056b4eb%3A0x8062831ac8ae440d!2sSS%20Psychological%20Life%20Care%20Center!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              width="100%" 
              height="430" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="SS Psychological Life Care Center Location - Paschim Vihar"
            ></iframe>
          </div>
        </div>

        {/* Quick Contact Cards */}
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card quick-contact-card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="quick-contact-icon mb-3 text-primary fs-1">
                  <i className="bi bi-headset"></i>
                </div>
                <h5 className="card-title fw-bold mb-2">Helpline & Support</h5>
                <p className="card-text text-muted small mb-3">Need guidance with consultation booking? Call our clinic desk directly.</p>
                <a href="tel:9716129129" className="btn btn-outline-primary w-100">
                  <i className="bi bi-telephone-fill me-2"></i>Call 9716129129
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card quick-contact-card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="quick-contact-icon mb-3 text-success fs-1">
                  <i className="bi bi-calendar-check"></i>
                </div>
                <h5 className="card-title fw-bold mb-2">Book a Consultation</h5>
                <p className="card-text text-muted small mb-3">Schedule your confidential therapy session with our qualified counsellors.</p>
                <Link to="/consilar" className="btn btn-primary w-100">
                  <i className="bi bi-calendar-plus me-2"></i>Book Consultation Calendar
                </Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card quick-contact-card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="quick-contact-icon mb-3 text-info fs-1">
                  <i className="bi bi-envelope-paper"></i>
                </div>
                <h5 className="card-title fw-bold mb-2">Email Desk</h5>
                <p className="card-text text-muted small mb-3">Send your detailed questions or reports directly to our clinical email.</p>
                <a href="mailto:sspsychological5@gmail.com" className="btn btn-outline-primary w-100">
                  <i className="bi bi-envelope me-2"></i>sspsychological5@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;