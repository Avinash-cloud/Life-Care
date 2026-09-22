import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/shared/SEOHead';

const Privacy = () => {
  return (
    <div className="privacy-page py-5" style={{ backgroundColor: '#fcfcfd' }}>
      <SEOHead
        title="Privacy Policy"
        description="Privacy Policy for SS Psych Life Care. Learn how we collect, protect, and handle confidential psychological and health data."
        url="/privacy"
      />

      <div className="container">
        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb mb-0">
            <li className="breadcrumb-item">
              <Link to="/" className="text-decoration-none text-muted">
                <i className="bi bi-house-door me-1"></i>Home
              </Link>
            </li>
            <li className="breadcrumb-item active text-dark fw-semibold" aria-current="page">
              Privacy Policy
            </li>
          </ol>
        </nav>

        {/* Hero Header */}
        <div className="text-center mb-5">
          <span className="badge bg-success-light text-success px-3 py-2 rounded-pill fw-semibold mb-3">
            Client Privacy & Data Security
          </span>
          <h1 className="fw-bold display-5 mb-3 text-dark">Privacy Policy</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '720px' }}>
            Your trust and confidentiality are central to psychological therapy. Here is how SS Psych Life Care safeguards your personal and clinical records.
          </p>
          <small className="text-muted">
            <i className="bi bi-shield-lock me-1"></i> Last updated: September 2025
          </small>
        </div>

        <div className="row g-5">
          {/* Main Legal Content */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-4">
              
              <section className="mb-5">
                <h3 className="fw-bold text-dark mb-3">1. Introduction</h3>
                <p className="text-muted leading-relaxed">
                  At <strong>SS Psych Life Care</strong>, we recognize the deeply personal nature of mental health counselling. We are firmly committed to upholding the highest standards of confidentiality, patient privacy, and data protection in compliance with professional psychological codes of ethics (including Rehabilitation Council of India guidelines) and applicable data privacy regulations.
                </p>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold text-dark mb-3">2. Information We Collect</h3>
                <p className="text-muted leading-relaxed">To provide psychological care and therapy sessions, we may collect:</p>
                <ul className="text-muted ps-3">
                  <li className="mb-2"><strong>Personal Identifiers:</strong> Name, phone number, email address, age/date of birth, emergency contact details.</li>
                  <li className="mb-2"><strong>Clinical Information:</strong> Reason for seeking counselling, intake questionnaire responses, mental health assessments (e.g. Anxiety/Depression screeners), session notes, and treatment progress maintained strictly by your therapist.</li>
                  <li className="mb-2"><strong>Transaction & Billing Data:</strong> Payment transaction identifiers, appointment history, and billing records (we do NOT store complete credit/debit card numbers; transactions are handled securely via PCI-DSS compliant gateways like Razorpay).</li>
                  <li className="mb-0"><strong>Technical Information:</strong> IP address, device type, and login timestamps to maintain platform security.</li>
                </ul>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold text-dark mb-3">3. How We Use Your Information</h3>
                <ul className="text-muted ps-3">
                  <li className="mb-2">To schedule, facilitate, and manage therapy appointments with certified psychologists.</li>
                  <li className="mb-2">To provide clinical psychological assessments and personalized therapy care plans.</li>
                  <li className="mb-2">To send appointment reminders, video call links, and post-session self-care materials.</li>
                  <li className="mb-0">To ensure clinical safety and reach your emergency contact if an acute crisis arises during care.</li>
                </ul>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold text-dark mb-3">4. Clinical Confidentiality & Security</h3>
                <p className="text-muted leading-relaxed">
                  Therapy notes, assessments, and session discussions are strictly confidential between you and your licensed therapist. No session notes are ever sold, rented, or shared with third-party advertisers or insurance brokers without your explicit written authorization.
                </p>
                <div className="bg-light rounded-3 p-3 mb-3 border-start border-primary border-3">
                  <p className="mb-0 text-muted small">
                    <strong>End-to-End Encrypted Telehealth:</strong> Our video and audio sessions utilize encrypted WebRTC peer-to-peer connections. Sessions are neither monitored by clinic administrators nor recorded to any server storage.
                  </p>
                </div>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold text-dark mb-3">5. Disclosure of Data (Exceptions)</h3>
                <p className="text-muted leading-relaxed">
                  We disclose information only when strictly mandated by law or psychological safety ethics:
                </p>
                <ul className="text-muted ps-3">
                  <li className="mb-1">Imminent danger of severe harm to yourself or others.</li>
                  <li className="mb-1">Protection of minors or vulnerable dependents from active abuse.</li>
                  <li className="mb-1">Valid, enforceable court order issued by a judicial authority.</li>
                </ul>
              </section>

              <section className="mb-5">
                <h3 className="fw-bold text-dark mb-3">6. Your Rights</h3>
                <p className="text-muted leading-relaxed">
                  You have the right to request a summary of your treatment records, update personal contact details, or request account closure at any time through your client portal or by emailing our privacy desk at <strong>contact@plcc.in</strong>.
                </p>
              </section>

              <section>
                <h3 className="fw-bold text-dark mb-3">7. Contact the Privacy Officer</h3>
                <p className="text-muted leading-relaxed mb-1">
                  For privacy inquiries or records requests, please contact:
                </p>
                <p className="text-muted mb-0">
                  <strong>SS Psych Life Care</strong><br />
                  Dwarka Sector 6, New Delhi - 110075<br />
                  Email: <a href="mailto:contact@plcc.in" className="text-primary text-decoration-none">contact@plcc.in</a><br />
                  Phone: <a href="tel:9716129129" className="text-primary text-decoration-none">+91 9716129129</a>
                </p>
              </section>

            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="sticky-top" style={{ top: '100px' }}>
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                <h6 className="fw-bold mb-3 border-bottom pb-2">Related Legal Links</h6>
                <div className="d-flex flex-column gap-2">
                  <Link to="/terms" className="d-flex justify-content-between align-items-center py-2 text-decoration-none text-dark border-bottom border-light">
                    <span><i className="bi bi-file-earmark-text me-2 text-primary"></i>Terms of Service</span>
                    <i className="bi bi-chevron-right text-muted small"></i>
                  </Link>
                  <Link to="/faq" className="d-flex justify-content-between align-items-center py-2 text-decoration-none text-dark border-bottom border-light">
                    <span><i className="bi bi-question-circle me-2 text-primary"></i>Frequently Asked Questions</span>
                    <i className="bi bi-chevron-right text-muted small"></i>
                  </Link>
                  <Link to="/contact" className="d-flex justify-content-between align-items-center py-2 text-decoration-none text-dark border-bottom border-light">
                    <span><i className="bi bi-envelope me-2 text-primary"></i>Contact Us</span>
                    <i className="bi bi-chevron-right text-muted small"></i>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Privacy;
