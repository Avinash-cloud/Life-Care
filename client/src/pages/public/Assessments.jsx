import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  HeartPulse, 
  Brain, 
  ShieldCheck, 
  Clock, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Lock, 
  AlertTriangle,
  HelpCircle,
  PhoneCall,
  CalendarCheck,
  Activity,
  Layers
} from 'lucide-react';
import { 
  ASSESSMENTS_LIST, 
  ASSESSMENT_CATEGORIES, 
  FREQUENTLY_ASKED_QUESTIONS 
} from '../../constants/assessmentsData';
import './Assessments.css';

const Assessments = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (index) => {
    setExpandedFaq(prev => (prev === index ? null : index));
  };

  // Filtered assessments
  const filteredAssessments = useMemo(() => {
    return ASSESSMENTS_LIST.filter((test) => {
      // Category filter
      const matchesCategory = 
        selectedCategory === 'all' || test.category === selectedCategory;

      // Search query filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q ||
        test.title.toLowerCase().includes(q) ||
        test.scaleName.toLowerCase().includes(q) ||
        test.description.toLowerCase().includes(q) ||
        test.whoIsItFor.toLowerCase().includes(q) ||
        test.measures.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="assessments-page-wrapper">
      {/* ========================================================
          1. Hero Section
          ======================================================== */}
      <section className="assessments-hero">
        <div className="container">
          <div className="hero-inner-container">
            {/* Pill Badge */}
            <div className="hero-top-badge">
              <Sparkles size={14} className="me-1 text-emerald-600" />
              <span>Confidential Clinical Well-Being Screeners</span>
            </div>

            {/* Main Headline */}
            <h1 className="assessments-hero-title">
              Understand Yourself Better.{' '}
              <span className="hero-title-highlight">In Just 3 Minutes.</span>
            </h1>

            {/* Subtitle */}
            <p className="assessments-hero-subtitle">
              Take free, evidence-based psychological screeners curated by registered psychologists.
              Receive instant clinical scoring, personalized guidance, and private report delivery.
            </p>

            {/* Trust highlights bar */}
            <div className="trust-pill-bar">
              <div className="trust-item">
                <ShieldCheck size={16} className="trust-icon text-success" />
                <span>100% Confidential</span>
              </div>
              <span className="trust-separator">•</span>
              <div className="trust-item">
                <Clock size={16} className="trust-icon text-primary" />
                <span>2-4 Mins Quick Screeners</span>
              </div>
              <span className="trust-separator">•</span>
              <div className="trust-item">
                <Brain size={16} className="trust-icon text-teal" />
                <span>Clinically Validated Tools</span>
              </div>
              <span className="trust-separator">•</span>
              <div className="trust-item">
                <AlertTriangle size={16} className="trust-icon text-amber" />
                <span>Indicative & Non-Diagnostic</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. Search and Category Filter Section
          ======================================================== */}
      <section className="assessments-filter-section">
        <div className="container">
          <div className="filter-controls-container">
            {/* Search Input */}
            <div className="search-bar-wrapper">
              <Search size={18} className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assessments by symptom (e.g. anxiety, worry, panic, sleep, focus, stress)..."
                className="search-input"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="clear-search-btn"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Tabs */}
            <div className="category-tabs-scroll">
              {ASSESSMENT_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`category-tab-btn ${isSelected ? 'active' : ''}`}
                  >
                    <i className={`bi ${cat.icon} me-1.5`}></i>
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. Assessment Cards Grid
          ======================================================== */}
      <section className="assessments-grid-section">
        <div className="container">
          {/* Section meta counter */}
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div>
              <h2 className="grid-heading">
                {selectedCategory === 'all' 
                  ? 'All Available Self-Assessments' 
                  : ASSESSMENT_CATEGORIES.find(c => c.id === selectedCategory)?.label || 'Assessments'}
              </h2>
              <p className="grid-subtext">
                Showing {filteredAssessments.length} evidence-based assessment{filteredAssessments.length === 1 ? '' : 's'}
              </p>
            </div>

            {(selectedCategory !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="reset-filter-btn"
              >
                Reset All Filters
              </button>
            )}
          </div>

          {/* Cards Grid */}
          {filteredAssessments.length > 0 ? (
            <div className="assessments-cards-grid">
              {filteredAssessments.map((test) => {
                return (
                  <div key={test.id} className="assessment-card group">
                    {/* Top Row: Scale Name & Duration */}
                    <div className="card-top-row">
                      <span className="scale-tag">{test.scaleName}</span>
                      <span className="duration-tag">
                        <Clock size={12} className="me-1" />
                        {test.duration}
                      </span>
                    </div>

                    {/* Badge Pill */}
                    {test.badge && (
                      <div className="card-badge-wrapper">
                        <span className={`card-badge badge-${test.badgeColor || 'emerald'}`}>
                          {test.badge}
                        </span>
                      </div>
                    )}

                    {/* Card Body */}
                    <div className="card-content-area">
                      <h3 className="card-title">{test.title}</h3>
                      <p className="card-description">{test.description}</p>

                      <div className="card-meta-list">
                        <div className="meta-item">
                          <strong className="meta-label">Measures:</strong>
                          <span className="meta-value">{test.measures}</span>
                        </div>
                        <div className="meta-item">
                          <strong className="meta-label">For:</strong>
                          <span className="meta-value">{test.whoIsItFor}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="card-actions-area">
                      {test.existingRoute && test.id === 'wellness-game' ? (
                        <Link to={test.existingRoute} className="btn-start-assessment">
                          <span>Play Wellness Game</span>
                          <ArrowRight size={16} className="ms-1" />
                        </Link>
                      ) : (
                        <>
                          <Link
                            to={`/assessments/${test.id}`}
                            className="btn-start-assessment"
                          >
                            <span>Start Assessment</span>
                            <ArrowRight size={16} className="ms-1" />
                          </Link>

                          {test.existingRoute && test.id === 'anxiety' && (
                            <Link 
                              to={test.existingRoute} 
                              className="dedicated-page-link"
                              title="Open standalone anxiety test page"
                            >
                              <span>Original Test Page ↗</span>
                            </Link>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="empty-assessments-box">
              <div className="empty-icon-circle">
                <Search size={32} className="text-muted" />
              </div>
              <h4>No assessments found</h4>
              <p className="text-muted">
                We couldn't find any assessments matching "{searchQuery}". Try searching for another symptom or browse all assessments.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="btn btn-primary rounded-pill px-4 mt-2"
              >
                Clear Search & Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          4. How Your Assessment Works Section
          ======================================================== */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-5">
            <span className="section-eyebrow">Seamless & Confidential</span>
            <h2 className="section-title">How Your Assessment Works</h2>
            <p className="section-description">
              Our standardized screeners provide clinical insights through three simple, transparent steps.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="step-card">
                <div className="step-number-bubble">1</div>
                <div className="step-icon-wrapper">
                  <Activity size={24} className="text-emerald-700" />
                </div>
                <h4 className="step-card-title">Answer Validated Questions</h4>
                <p className="step-card-desc">
                  Select responses that accurately capture your thoughts, emotions, and physical feelings over recent weeks. Takes just 2 to 4 minutes.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="step-card">
                <div className="step-number-bubble">2</div>
                <div className="step-icon-wrapper">
                  <Layers size={24} className="text-teal-700" />
                </div>
                <h4 className="step-card-title">Instant Scoring & Analysis</h4>
                <p className="step-card-desc">
                  Our system evaluates your responses against standardized clinical diagnostic scoring bands, providing immediate objective clarity.
                </p>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="step-card">
                <div className="step-number-bubble">3</div>
                <div className="step-icon-wrapper">
                  <ShieldCheck size={24} className="text-primary" />
                </div>
                <h4 className="step-card-title">Personalized Guidance</h4>
                <p className="step-card-desc">
                  Receive tailored recommendations, actionable coping tools, and confidential consultation options with our registered psychologists.
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Callout Banner */}
          <div className="privacy-pledge-banner">
            <Lock size={18} className="text-emerald-600 me-2 flex-shrink-0" />
            <span>
              <strong>Healthcare Confidentiality Promise:</strong> Your answers are encrypted and 100% confidential. We never sell, share, or disclose your assessment data to third parties.
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================
          5. FAQ Accordion Section
          ======================================================== */}
      <section className="assessments-faq-section">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-5">
            <span className="section-eyebrow">Clear Answers</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-description">
              Everything you need to know about our psychological screening tools and privacy safeguards.
            </p>
          </div>

          <div className="faq-stack max-w-3xl mx-auto">
            {FREQUENTLY_ASKED_QUESTIONS.map((faq, idx) => {
              const isExpanded = expandedFaq === idx;
              return (
                <div key={idx} className={`faq-card ${isExpanded ? 'expanded' : ''}`}>
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="faq-question-btn"
                    aria-expanded={isExpanded}
                  >
                    <span className="faq-q-text">{faq.question}</span>
                    <div className="faq-icon-pill">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="faq-answer-container">
                      <p className="faq-answer-text">{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          6. Clinical Assessment Disclaimer & Helplines Notice
          ======================================================== */}
      <section className="crisis-helpline-section">
        <div className="container">
          {/* Prominent Clinical Disclaimer */}
          <div className="assessment-disclaimer-box mb-4">
            <div className="d-flex align-items-start gap-3">
              <ShieldCheck size={28} className="text-emerald-700 flex-shrink-0 mt-1" />
              <div>
                <h5 className="disclaimer-heading">Clinical Assessment & Diagnostic Disclaimer</h5>
                <p className="disclaimer-body mb-0">
                  The online psychological screening assessments provided here are evidence-informed self-evaluation tools designed solely for informational, reflective, and educational purposes. <strong>They do not constitute a clinical psychiatric diagnosis, formal medical evaluation, or treatment plan.</strong> A formal mental health diagnosis can only be determined by a qualified clinical psychologist or licensed medical psychiatrist through a comprehensive diagnostic consultation. If your results suggest elevated stress or emotional distress, we warmly invite you to book a confidential consultation with our certified clinical team.
                </p>
              </div>
            </div>
          </div>

          <div className="crisis-card">
            <div className="crisis-icon-circle">
              <PhoneCall size={24} className="text-emerald-700" />
            </div>
            <div className="crisis-content">
              <h5 className="crisis-title">Need Immediate Psychological Support or Guidance?</h5>
              <p className="crisis-desc">
                If you or a loved one are experiencing acute distress, emotional overwhelm, or need immediate assistance, please connect directly with our clinic team:
              </p>
              <div className="crisis-numbers-row">
                <a href="tel:9716129129" className="crisis-number-pill">
                  <PhoneCall size={14} className="me-1" />
                  <strong>Helpline:</strong> +91 97161 29129
                </a>
                <a href="tel:9899555507" className="crisis-number-pill">
                  <PhoneCall size={14} className="me-1" />
                  <strong>Clinic:</strong> +91 98995 55507
                </a>
                <a href="mailto:sspsychological5@gmail.com" className="crisis-number-pill">
                  <i className="bi bi-envelope me-1"></i>
                  <strong>Email:</strong> sspsychological5@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          7. Consultation CTA Banner
          ======================================================== */}
      <section className="assessments-cta-banner">
        <div className="container">
          <div className="cta-banner-card">
            <div className="row align-items-center">
              <div className="col-12 col-lg-8">
                <span className="cta-badge">Expert Psychological Support</span>
                <h2 className="cta-title">Ready to Discuss Your Assessment with a Psychologist?</h2>
                <p className="cta-subtitle">
                  Our certified clinical psychologists provide compassionate, evidence-based therapy tailored to your unique lifestyle and goals.
                </p>
              </div>
              <div className="col-12 col-lg-4 text-lg-end mt-4 mt-lg-0">
                <div className="cta-buttons-group">
                  <Link to="/consilar" className="btn-banner-book">
                    <CalendarCheck size={18} className="me-2" />
                    <span>Book a Consultation</span>
                  </Link>
                  <a 
                    href="https://wa.me/9716129129" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-banner-whatsapp"
                  >
                    <i className="bi bi-whatsapp me-2"></i>
                    <span>WhatsApp Our Clinic</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Assessments;
