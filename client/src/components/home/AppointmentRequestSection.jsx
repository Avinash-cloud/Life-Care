import { useState } from 'react';
import { leadAPI } from '../../services/api';
import './AppointmentRequestSection.css';

const AppointmentRequestSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    email: '',
    primaryConcern: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await leadAPI.createCallback({
        ...formData,
        subject: `Callback Request - ${formData.primaryConcern?.substring(0, 40) || 'General'}`,
        source: 'Homepage Callback Form'
      });
      setSuccess(true);
      setFormData({ name: '', phoneNumber: '', email: '', primaryConcern: '' });
      setTimeout(() => setSuccess(false), 6000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit callback request. Please try calling us directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="appointment-request-section py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="appointment-card">
              <div className="text-center mb-4">
                <h6 className="text-primary fw-bold mb-2">BOOK AN APPOINTMENT</h6>
                <h2 className="mb-3">Request a Callback</h2>
                <p className="text-muted">Fill out the form below and our team will get back to you shortly</p>
              </div>
              
              {success && (
                <div className="alert alert-success" role="alert">
                  <i className="bi bi-check-circle me-2"></i>
                  Thank you! We'll contact you soon.
                </div>
              )}
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="phoneNumber" className="form-label">Phone Number *</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    placeholder="Enter your 10-digit phone number"
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Email Address (Optional)</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email address"
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="primaryConcern" className="form-label">Primary Concern *</label>
                  <textarea
                    className="form-control"
                    id="primaryConcern"
                    name="primaryConcern"
                    value={formData.primaryConcern}
                    onChange={handleChange}
                    required
                    rows="4"
                    placeholder="Briefly describe your concern"
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100 btn-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-telephone me-2"></i>
                      Request Callback
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppointmentRequestSection;
