import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Accordion } from 'react-bootstrap';
import SEOHead from '../../components/shared/SEOHead';

const FAQ = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const faqs = [
    {
      category: 'general',
      q: 'What is SS Psych Life Care?',
      a: 'SS Psych Life Care is a premier clinical psychology and mental health platform led by RCI-registered psychologists with over 20 years of counselling and clinical experience. We provide individual psychotherapy, couples counselling, child/adolescent guidance, clinical assessments, and professional internship training.'
    },
    {
      category: 'general',
      q: 'Where are your clinical consultation centres located?',
      a: 'We offer in-person consultations at our three New Delhi centres: Dwarka Sector 6, Paschim Vihar (A15), and Vasant Kunj (773, Sector A). We also offer online video sessions accessible worldwide.'
    },
    {
      category: 'sessions',
      q: 'How long does a therapy session last?',
      a: 'A standard individual counselling session typically lasts 45 to 50 minutes. Couples and family therapy sessions are generally 60 to 75 minutes.'
    },
    {
      category: 'sessions',
      q: 'How does an online video session work?',
      a: 'Once you book an online appointment, you will receive a secure video call link in your client dashboard and via email/SMS. At the scheduled time, click the link to enter our encrypted, private video room with your therapist.'
    },
    {
      category: 'confidentiality',
      q: 'Is my therapy completely confidential?',
      a: 'Yes, 100%. All personal discussions, test scores, and session notes are strictly confidential in accordance with medical ethics and Rehabilitation Council of India (RCI) guidelines. No information is disclosed without your explicit consent, except under rare legal mandates involving imminent physical danger.'
    },
    {
      category: 'booking',
      q: 'What is your cancellation and rescheduling policy?',
      a: 'We require at least 24 hours notice to cancel or reschedule an appointment without penalty. This allows us to offer the slot to others in need of support.'
    },
    {
      category: 'booking',
      q: 'How do I book an appointment?',
      a: 'You can book directly on our website by visiting our "Counsellors" or "Talk to a Counsellor" page, selecting your preferred psychologist, date, and time slot, or by calling our care coordinators at +91 9716129129.'
    },
    {
      category: 'emergency',
      q: 'What should I do in a psychiatric emergency?',
      a: 'SS Psych Life Care is a scheduled therapy service and does NOT provide emergency or acute suicide crisis support. If you or someone you know is in immediate crisis, please call national emergency helpline 112, the KIRAN mental health helpline at 1800-599-0019, or visit the nearest hospital emergency room immediately.'
    }
  ];

  const filteredFaqs = activeCategory === 'all' 
    ? faqs 
    : faqs.filter(f => f.category === activeCategory);

  return (
    <div className="faq-page py-5" style={{ backgroundColor: '#fcfcfd' }}>
      <SEOHead
        title="Frequently Asked Questions"
        description="Find answers to common questions about mental health counselling, appointments, confidentiality, and services at SS Psych Life Care."
        url="/faq"
      />

      <div className="container">
        {/* Breadcrumb Navigation */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-muted">
                <i className="bi bi-house-door me-1"></i>Home
              </Link>
            </li>
            <li className="breadcrumb-item active text-dark fw-semibold" aria-current="page">
              FAQs
            </li>
          </ol>
        </nav>

        {/* Hero Header */}
        <div className="text-center mb-5">
          <span className="badge bg-primary-light text-primary px-3 py-2 rounded-pill fw-semibold mb-3">
            Got Questions? We're Here to Help
          </span>
          <h1 className="fw-bold display-5 mb-3 text-dark">Frequently Asked Questions</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '700px' }}>
            Everything you need to know about starting therapy, our counsellors, confidentiality, and session logistics.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'general', label: 'General & Clinics' },
            { id: 'sessions', label: 'Therapy Sessions' },
            { id: 'confidentiality', label: 'Confidentiality' },
            { id: 'booking', label: 'Booking & Policies' },
            { id: 'emergency', label: 'Crisis Support' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`btn rounded-pill px-4 py-2 ${
                activeCategory === tab.id ? 'btn-primary' : 'btn-outline-secondary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-9">
            <Accordion defaultActiveKey="0" className="shadow-sm rounded-4 overflow-hidden border-0">
              {filteredFaqs.map((faq, index) => (
                <Accordion.Item eventKey={index.toString()} key={index} className="border-0 border-bottom">
                  <Accordion.Header>
                    <span className="fw-semibold text-dark py-1">{faq.q}</span>
                  </Accordion.Header>
                  <Accordion.Body className="text-muted leading-relaxed pb-4">
                    {faq.a}
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </div>
        </div>

        {/* Still Have Questions CTA */}
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 rounded-4 shadow-sm p-4 p-md-5 text-center bg-white">
              <div className="icon-box bg-primary-light text-primary mx-auto mb-3">
                <i className="bi bi-question-diamond"></i>
              </div>
              <h4 className="fw-bold mb-2">Have a Question Not Listed Here?</h4>
              <p className="text-muted mb-4">
                Our care coordinators are happy to assist you with any questions about counsellors, appointment availability, or fees.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <a
                  href="https://wa.me/9716129129"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-success rounded-pill px-4 py-2"
                >
                  <i className="bi bi-whatsapp me-2"></i> WhatsApp Us
                </a>
                <a href="tel:9716129129" className="btn btn-outline-primary rounded-pill px-4 py-2">
                  <i className="bi bi-telephone me-2"></i> Call +91 9716129129
                </a>
                <Link to="/contact" className="btn btn-primary rounded-pill px-4 py-2">
                  Send a Message
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FAQ;
