import React from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/shared/SEOHead';

const Terms = () => {
  return (
    <div className="terms-page py-5" style={{ backgroundColor: '#fcfcfd' }}>
      <SEOHead
        title="Terms of Service"
        description="Terms of Service and Conditions of Use for SS Psych Life Care. Learn about our appointment guidelines, confidentiality, and client policies."
        url="/terms"
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
              Terms of Service
            </li>
          </ol>
        </nav>

        {/* Hero Header */}
        <div className="text-center mb-5">
          <span className="badge bg-primary-light text-primary px-3 py-2 rounded-pill fw-semibold mb-3">
            Legal & Compliance
          </span>
          <h1 className="fw-bold display-5 mb-3 text-dark">Terms of Service</h1>
          <p className="text-muted mx-auto" style={{ maxWidth: '720px' }}>
            Please read these terms carefully before utilizing our psychological counselling, therapy, and assessment services.
          </p>
          <small className="text-muted">
            <i className="bi bi-clock-history me-1"></i> Last updated: September 2025
          </small>
        </div>

        {/* Emergency Notice Banner */}
        <div className="card border-0 rounded-4 shadow-sm mb-5 p-4" style={{ backgroundColor: '#fff3cd', borderLeft: '5px solid #ffc107' }}>
          <div className="d-flex align-items-start gap-3">
            <i className="bi bi-exclamation-triangle-fill text-warning fs-3 mt-1"></i>
            <div>
              <h5 className="fw-bold text-dark mb-1">Emergency & Crisis Disclaimer</h5>
              <p className="mb-0 text-muted small">
                SS Psych Life Care does <strong>NOT</strong> provide emergency or acute crisis intervention. If you or someone you know is experiencing severe psychiatric distress, thoughts of self-harm, or a life-threatening medical emergency, please call the national emergency number <strong>112</strong>, the mental health helpline <strong>KIRAN (1800-599-0019)</strong>, or visit your nearest hospital emergency department immediately.
              </p>
            </div>
          </div>
        </div>

        <div className="row g-5">
          {/* Main Legal Content */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-4">
              
              {/* Section 1 */}
              <section className="mb-5">
                <h3 className="fw-bold text-dark mb-3">1. Acceptance of Terms</h3>
                <p className="text-muted leading-relaxed">
                  By accessing or using the website, mobile services, booking tools, and therapy services provided by <strong>SS Psych Life Care</strong> (collectively referred to as "the Platform", "we", "us", or "our"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, please refrain from using our services.
                </p>
              </section>

              {/* Section 2 */}
              <section className="mb-5">
                <h3 className="fw-bold text-dark mb-3">2. Description of Services</h3>
                <p className="text-muted leading-relaxed">
                  SS Psych Life Care provides mental health counselling, psychotherapy, clinical assessments, internship programmes, and self-help educational materials. Our services are provided by certified clinical psychologists and qualified counsellors registered with recognized regulatory bodies (including the Rehabilitation Council of India - RCI where applicable).
                </p>
                <p className="text-muted leading-relaxed">
                  Services may be provided online via secure video call / chat sessions, or offline at our clinical consultation centres located in Dwarka, Paschim Vihar, and Vasant Kunj, New Delhi.
                </p>
              </section>

              {/* Section 3 */}
              <section className="mb-5">
                <h3 className="fw-bold text-dark mb-3">3. Eligibility and Account Registration</h3>
                <ul className="text-muted ps-3">
                  <li className="mb-2">You must be at least 18 years of age to independently register for an account and book therapy sessions.</li>
                  <li className="mb-2">For minors (under 18 years), explicit consent and authorization from a parent or legal guardian is mandatory before initiating therapy.</li>
                  <li className="mb-2">You agree to provide true, accurate, and current information when creating an account or scheduling an appointment.</li>
                  <li className="mb-2">You are responsible for maintaining the confidentiality of your login credentials.</li>
                </ul>
              </section>

              {/* Section 4 */}
              <section className="mb-5">
                <h3 className="fw-bold text-dark mb-3">4. Appointments, Cancellations & Rescheduling</h3>
                <p className="text-muted leading-relaxed">
                  To ensure quality of care and respect our practitioners' time, the following policies apply to all appointments:
                </p>
                <div className="bg-light rounded-3 p-3 mb-3">
                  <ul className="mb-0 text-muted ps-3 small">
                    <li className="mb-2"><strong>Advance Booking:</strong> Appointments can be scheduled online or by contacting our care coordinators.</li>
                    <li className="mb-2"><strong>Cancellation & Rescheduling Notice:</strong> Cancellations or rescheduling requests must be submitted at least <strong>24 hours</strong> prior to your scheduled session.</li>
                    <li className="mb-2"><strong>Late Cancellations / No-Shows:</strong> Sessions cancelled with less than 24 hours notice or missed appointments may be subject to forfeiture of the session fee.</li>
                    <li className="mb-0"><strong>Practitioner Rescheduling:</strong> If unforeseen medical emergencies require your therapist to reschedule, you will be notified promptly and offered the earliest convenient alternate slot or a full refund.</li>
                  </ul>
                </div>
              </section>

              {/* Section 5 */}
              <section className="mb-5">
                <h3 className="fw-bold text-dark mb-3">5. Confidentiality & Privacy</h3>
                <p className="text-muted leading-relaxed">
                  Confidentiality is the cornerstone of psychological care. All details shared during your counselling sessions, including notes, communications, and assessments, are held in strict professional confidence.
                </p>
                <p className="text-muted leading-relaxed">
                  <strong>Legal Exceptions to Confidentiality:</strong> Under Indian law and professional ethical standards, therapists are legally required to break confidentiality only in the following rare circumstances:
                </p>
                <ul className="text-muted ps-3">
                  <li className="mb-1">Clear and imminent risk of physical harm to oneself or another person.</li>
                  <li className="mb-1">Suspected ongoing abuse or neglect of a minor, elderly person, or vulnerable individual.</li>
                  <li className="mb-1">A court order or legal subpoena requiring disclosure under judicial mandate.</li>
                </ul>
              </section>

              {/* Section 6 */}
              <section className="mb-5">
                <h3 className="fw-bold text-dark mb-3">6. Telehealth / Online Therapy Protocols</h3>
                <p className="text-muted leading-relaxed">
                  For clients participating in online video sessions:
                </p>
                <ul className="text-muted ps-3">
                  <li className="mb-2">You agree to ensure a private, quiet, and confidential environment during your consultation.</li>
                  <li className="mb-2">You must possess a reliable, high-speed internet connection and compatible device with webcam and microphone.</li>
                  <li className="mb-2">Neither the client nor the therapist is permitted to audio or video record sessions without mutual, explicit written agreement.</li>
                </ul>
              </section>

              {/* Section 7 */}
              <section className="mb-5">
                <h3 className="fw-bold text-dark mb-3">7. Payments, Fees & Invoicing</h3>
                <p className="text-muted leading-relaxed">
                  Session fees must be paid in advance via our secure payment gateway (Razorpay) or through approved clinic channels. Digital invoices and receipts are issued upon payment completion and can be downloaded directly from your client dashboard.
                </p>
              </section>

              {/* Section 8 */}
              <section className="mb-5">
                <h3 className="fw-bold text-dark mb-3">8. Intellectual Property</h3>
                <p className="text-muted leading-relaxed">
                  All content, articles, logos, graphics, psychological tests, and educational materials displayed on this platform are the proprietary intellectual property of SS Psych Life Care and are protected by applicable copyright and trademark laws.
                </p>
              </section>

              {/* Section 9 */}
              <section className="mb-5">
                <h3 className="fw-bold text-dark mb-3">9. Governing Law</h3>
                <p className="text-muted leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or related to these terms shall be subject to the exclusive jurisdiction of the courts located in New Delhi, India.
                </p>
              </section>

              {/* Section 10 */}
              <section>
                <h3 className="fw-bold text-dark mb-3">10. Contact Us</h3>
                <p className="text-muted leading-relaxed">
                  If you have questions or concerns regarding our Terms of Service, please reach out to our team:
                </p>
                <ul className="list-unstyled text-muted">
                  <li className="mb-2"><i className="bi bi-envelope-fill me-2 text-primary"></i>Email: <strong>contact@plcc.in</strong></li>
                  <li className="mb-2"><i className="bi bi-telephone-fill me-2 text-primary"></i>Phone: <strong>+91 9716129129</strong> / <strong>+91 9899555507</strong></li>
                  <li><i className="bi bi-geo-alt-fill me-2 text-primary"></i>Main Clinic: <strong>Dwarka Sector 6, New Delhi - 110075</strong></li>
                </ul>
              </section>

            </div>
          </div>

          {/* Sidebar */}
          <div className="col-lg-4">
            <div className="sticky-top" style={{ top: '100px' }}>
              {/* Quick Navigation Card */}
              <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
                <h6 className="fw-bold mb-3 border-bottom pb-2">Related Legal Documents</h6>
                <div className="d-flex flex-column gap-2">
                  <Link to="/privacy" className="d-flex justify-content-between align-items-center py-2 text-decoration-none text-dark border-bottom border-light">
                    <span><i className="bi bi-shield-check me-2 text-primary"></i>Privacy Policy</span>
                    <i className="bi bi-chevron-right text-muted small"></i>
                  </Link>
                  <Link to="/faq" className="d-flex justify-content-between align-items-center py-2 text-decoration-none text-dark border-bottom border-light">
                    <span><i className="bi bi-question-circle me-2 text-primary"></i>Frequently Asked Questions</span>
                    <i className="bi bi-chevron-right text-muted small"></i>
                  </Link>
                  <Link to="/about" className="d-flex justify-content-between align-items-center py-2 text-decoration-none text-dark border-bottom border-light">
                    <span><i className="bi bi-info-circle me-2 text-primary"></i>About Us</span>
                    <i className="bi bi-chevron-right text-muted small"></i>
                  </Link>
                </div>
              </div>

              {/* Consultation Assistance Card */}
              <div className="card border-0 shadow-sm rounded-4 p-4 text-center bg-white">
                <div className="icon-box bg-primary-light text-primary mx-auto mb-3">
                  <i className="bi bi-chat-heart"></i>
                </div>
                <h5 className="fw-bold mb-2">Need Clarity on Services?</h5>
                <p className="text-muted small mb-3">
                  Our coordinators can assist you with session guidelines, therapist allocation, and fees.
                </p>
                <Link to="/consilar" className="btn btn-primary rounded-pill w-100 mb-2">
                  Book a Consultation
                </Link>
                <a href="tel:9716129129" className="btn btn-outline-secondary rounded-pill w-100 btn-sm">
                  <i className="bi bi-telephone me-1"></i> Call 9716129129
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Terms;
