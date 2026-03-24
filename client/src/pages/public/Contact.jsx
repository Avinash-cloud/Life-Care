import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send the form data to the server
    console.log(formData);
    setSubmitted(true);
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
    // Show success message for 3 seconds
    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="contact-page py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h1 className="mb-3">Contact <span className="text-gradient">Us</span></h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Have questions or need support? We're here to help. Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="row mb-5">
          <div className="col-md-4 mb-4 mb-md-0">
            <div className="card contact-info-card h-100">
              <div className="card-body p-4">
                <div className="d-flex align-items-center mb-4">
                  <div className="contact-icon me-3">
                    <i className="bi bi-geo-alt"></i>
                  </div>
                  <div>
                    <h5 className="mb-1">Our Locations</h5>
                    <p className="mb-0 text-muted"><strong>Main Branch:</strong> Flat No 30A DDA Flat Pocket 2, Dr Lean, Dwarka Sector 6-110075</p>
                    <p className="mb-0 text-muted mt-2"><strong>West Delhi Branch:</strong> A15 Second Floor LIC Colony, Paschim Vihar, 110087 (Near St Marks School Meerabagh)</p>
                    <p className="mb-0 text-muted mt-2"><strong>South Delhi Branch:</strong> Harcharan Bagh, 773, Sector A Main Rd, near BSES Office, Desu Colony, Vasant Kunj, New Delhi, Delhi 110070</p>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-4">
                  <div className="contact-icon me-3">
                    <i className="bi bi-telephone"></i>
                  </div>
                  <div>
                    <h5 className="mb-1">Phone Numbers</h5>
                    <p className="mb-0">
                      <a href="tel:9716129129" className="text-muted text-decoration-none">9716129129</a>
                    </p>
                    <p className="mb-0 mt-1">
                      <a href="tel:9899555507" className="text-muted text-decoration-none">9899555507</a>
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-center mb-4">
                  <div className="contact-icon me-3">
                    <i className="bi bi-envelope"></i>
                  </div>
                  <div>
                    <h5 className="mb-1">Email Address</h5>
                    <p className="mb-0">
                      <a href="mailto:contact@plcc.in" className="text-muted text-decoration-none">contact@plcc.in</a>
                    </p>
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  <div className="contact-icon me-3">
                    <i className="bi bi-clock"></i>
                  </div>
                  <div>
                    <h5 className="mb-1">Working Hours</h5>
                    <p className="mb-0 text-muted">24 Hours (Starting 9:00 AM Daily)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <div className="card contact-form-card h-100">
              <div className="card-body p-4">
                <h4 className="mb-4">Send us a message</h4>
                {submitted ? (
                  <div className="alert alert-success">
                    <i className="bi bi-check-circle me-2"></i>
                    Thank you for your message! We'll get back to you soon.
                  </div>
                ) : null}
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
                        <label htmlFor="name">Your Name</label>
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
                        <label htmlFor="email">Your Email</label>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input
                          type="tel"
                          className="form-control"
                          id="phone"
                          name="phone"
                          placeholder="Your Phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                        <label htmlFor="phone">Your Phone (Optional)</label>
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
                        <label htmlFor="subject">Subject</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <textarea
                          className="form-control"
                          id="message"
                          name="message"
                          placeholder="Your Message"
                          style={{ height: '150px' }}
                          value={formData.message}
                          onChange={handleChange}
                          required
                        ></textarea>
                        <label htmlFor="message">Your Message</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary">
                        <i className="bi bi-send me-2"></i>Send Message
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="card map-card mb-5">
          <div className="card-body p-0">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.2536671665396!2d77.0518!3d28.5917!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d1a9c31eec4e1%3A0x39493976c8c4c3a!2sDwarka%20Sector%206%2C%20Dwarka%2C%20Delhi%2C%20110075!5e0!3m2!1sen!2sin!4v1623825643412!5m2!1sen!2sin" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
              title="Office Location"
            ></iframe>
          </div>
        </div>

        {/* Quick Contact Cards */}
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card quick-contact-card h-100">
              <div className="card-body text-center p-4">
                <div className="quick-contact-icon mb-4">
                  <i className="bi bi-headset"></i>
                </div>
                <h5 className="card-title mb-3">Customer Support</h5>
                <p className="card-text text-muted mb-3">Need help with booking or technical issues? Our support team is ready to assist.</p>
                <a href="mailto:support@plcc.in" className="btn btn-outline-primary">
                  <i className="bi bi-envelope me-2"></i>Email Support
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card quick-contact-card h-100">
              <div className="card-body text-center p-4">
                <div className="quick-contact-icon mb-4">
                  <i className="bi bi-calendar-check"></i>
                </div>
                <h5 className="card-title mb-3">Book an Appointment</h5>
                <p className="card-text text-muted mb-3">Ready to schedule a session? Book an appointment with one of our counsellors.</p>
                <a href="/client/counsellors" className="btn btn-outline-primary">
                  <i className="bi bi-calendar-plus me-2"></i>Book Now
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card quick-contact-card h-100">
              <div className="card-body text-center p-4">
                <div className="quick-contact-icon mb-4">
                  <i className="bi bi-people"></i>
                </div>
                <h5 className="card-title mb-3">Join Our Team</h5>
                <p className="card-text text-muted mb-3">Are you a mental health professional? We're always looking for qualified counsellors.</p>
                <a href="mailto:careers@plcc.in" className="btn btn-outline-primary">
                  <i className="bi bi-person-plus me-2"></i>Apply Now
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