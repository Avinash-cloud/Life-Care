import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Form, Alert, Spinner } from 'react-bootstrap';
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  HeartHandshake, 
  RotateCcw, 
  Send, 
  CalendarCheck, 
  FileCheck,
  AlertTriangle,
  PhoneCall,
  Activity,
  Sparkles
} from 'lucide-react';
import { ASSESSMENTS_LIST } from '../../constants/assessmentsData';
import { assessmentAPI } from '../../services/api';
import './AssessmentDetail.css';

const AssessmentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the selected assessment
  const assessment = ASSESSMENTS_LIST.find((t) => t.id === id);

  // Test state
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [resultBand, setResultBand] = useState(null);

  // Lead save form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Scroll to top on mount or test change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentStep(0);
    setAnswers({});
    setIsCompleted(false);
    setFinalScore(0);
    setResultBand(null);
    setSaveSuccess(false);
    setSaveError('');
  }, [id]);

  // If assessment not found or is the game
  if (!assessment) {
    return (
      <div className="assessment-detail-page not-found-state">
        <Container className="py-5 text-center">
          <div className="not-found-card">
            <AlertCircle size={48} className="text-warning mb-3" />
            <h2 className="mb-2">Assessment Not Found</h2>
            <p className="text-muted mb-4">
              We couldn't find the assessment you were looking for. Please choose from our available clinical screeners.
            </p>
            <Link to="/assessments" className="btn btn-primary rounded-pill px-4">
              ← View All Assessments
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  // If this is the wellness game, redirect
  if (assessment.existingRoute && assessment.id === 'wellness-game') {
    navigate(assessment.existingRoute);
    return null;
  }

  const questions = assessment.questions || [];
  const currentQuestion = questions[currentStep];
  const questionOptions = currentQuestion?.options || assessment.options || [];
  const progressPercentage = Math.round(((currentStep + 1) / questions.length) * 100);

  const handleSelectOption = (score) => {
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: score
    };
    setAnswers(updatedAnswers);

    // Smooth auto advance after 220ms
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(prev => prev + 1);
        window.scrollTo({ top: 180, behavior: 'smooth' });
      } else {
        calculateResults(updatedAnswers);
      }
    }, 220);
  };

  const calculateResults = (finalAnswers) => {
    let total = 0;
    questions.forEach((q) => {
      const scoreVal = finalAnswers[q.id] !== undefined ? finalAnswers[q.id] : 0;
      total += scoreVal;
    });

    setFinalScore(total);

    let matchedBand = null;
    if (assessment.bands && assessment.bands.length > 0) {
      matchedBand = assessment.bands.find(
        (b) => total >= b.min && total <= b.max
      );
      if (!matchedBand) {
        matchedBand = assessment.bands[assessment.bands.length - 1];
      }
    }

    setResultBand(matchedBand);
    setIsCompleted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    } else {
      calculateResults(answers);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setIsCompleted(false);
    setFinalScore(0);
    setResultBand(null);
    setSaveSuccess(false);
    setSaveError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveResult = async (e) => {
    e.preventDefault();
    if (!formData.phone) {
      setSaveError('Please enter your phone number to receive your report.');
      return;
    }
    if (!formData.name && !formData.email) {
      setSaveError('Please provide your name or email address.');
      return;
    }

    setIsSaving(true);
    setSaveError('');

    try {
      await assessmentAPI.saveResult({
        ...formData,
        score: finalScore,
        testUrl: `${window.location.origin}/assessments/${assessment.id} — ${assessment.title}`
      });
      setSaveSuccess(true);
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Failed to submit report. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const getSeverityBadgeClass = (level) => {
    switch (level) {
      case 'minimal':
        return 'badge-severity-minimal';
      case 'mild':
        return 'badge-severity-mild';
      case 'moderate':
        return 'badge-severity-moderate';
      case 'severe':
        return 'badge-severity-severe';
      default:
        return 'badge-severity-mild';
    }
  };

  return (
    <div className="assessment-detail-page">
      {/* Top Banner & Breadcrumb */}
      <section className="detail-top-hero">
        <Container>
          <div className="detail-hero-content">
            <Link to="/assessments" className="detail-back-link">
              <ArrowLeft size={16} className="me-1.5" />
              <span>Back to All Assessments</span>
            </Link>

            <div className="detail-hero-meta">
              <span className="detail-scale-badge">{assessment.scaleName}</span>
              <div className="detail-duration-badge">
                <Clock size={13} className="me-1" />
                <span>{assessment.duration}</span>
              </div>
              {assessment.badge && (
                <span className={`detail-status-pill badge-${assessment.badgeColor || 'emerald'}`}>
                  {assessment.badge}
                </span>
              )}
            </div>

            <h1 className="detail-title">{assessment.title}</h1>
            <p className="detail-subtitle">{assessment.description}</p>

            {/* Quick Guarantees */}
            <div className="detail-guarantees-bar">
              <span className="guarantee-item">
                <ShieldCheck size={15} className="text-success me-1" />
                100% Confidential
              </span>
              <span className="guarantee-divider">•</span>
              <span className="guarantee-item">
                <Sparkles size={15} className="text-primary me-1" />
                Evidence-Based Scoring
              </span>
              <span className="guarantee-divider">•</span>
              <span className="guarantee-item">
                <AlertCircle size={15} className="text-amber me-1" />
                Indicative & Non-Diagnostic
              </span>
            </div>
          </div>
        </Container>
      </section>

      {/* Main Assessment Container */}
      <section className="detail-main-section">
        <Container>
          <div className="detail-content-wrapper">
            {!isCompleted ? (
              /* Active Test Taking View */
              <div className="test-runner-container">
                {/* Progress Tracker */}
                <div className="test-progress-bar-card">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="test-step-label">
                      Question <strong>{currentStep + 1}</strong> of {questions.length}
                    </span>
                    <span className="test-percent-label">{progressPercentage}% Completed</span>
                  </div>

                  <div className="progress-track">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Instruction Reminder */}
                <div className="test-instruction-box">
                  <AlertCircle size={17} className="text-primary flex-shrink-0 mt-0.5" />
                  <p className="mb-0">
                    Over the <strong>past 2 weeks</strong>, how frequently have you been bothered by this occurrence?
                  </p>
                </div>

                {/* Active Question Box */}
                <div className="question-display-card">
                  <div className="question-header d-flex align-items-center gap-2 flex-wrap mb-2">
                    <span className="question-idx">Question {currentStep + 1}</span>
                    {currentQuestion.sectionTitle && (
                      <span className="question-section-pill">{currentQuestion.sectionTitle}</span>
                    )}
                  </div>
                  <h2 className="question-prompt">{currentQuestion.text}</h2>

                  {/* Options List */}
                  <div className="options-container">
                    {questionOptions.map((opt) => {
                      const isSelected = answers[currentQuestion.id] === opt.score;
                      return (
                        <button
                          key={opt.score}
                          type="button"
                          onClick={() => handleSelectOption(opt.score)}
                          className={`detail-option-card ${isSelected ? 'selected' : ''}`}
                        >
                          <div className="option-text-group">
                            <span className="option-main-text">{opt.text}</span>
                            {opt.score !== undefined && (
                              <span className="option-sub-text">{opt.score} point{opt.score === 1 ? '' : 's'}</span>
                            )}
                          </div>

                          <div className={`option-radio-circle ${isSelected ? 'active' : ''}`}>
                            {isSelected && <CheckCircle2 size={18} />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Navigation Controls */}
                  <div className="test-navigation-footer">
                    <button
                      type="button"
                      onClick={handlePrev}
                      disabled={currentStep === 0}
                      className="btn-nav-prev"
                    >
                      <ArrowLeft size={16} />
                      <span>Previous Question</span>
                    </button>

                    <div className="test-counter-text">
                      {answers[currentQuestion.id] !== undefined ? (
                        <span className="text-success small fw-semibold">
                          <CheckCircle2 size={14} className="me-1" />
                          Answer Selected
                        </span>
                      ) : (
                        <span className="text-muted small">Please select an option to proceed</span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={handleNext}
                      disabled={answers[currentQuestion.id] === undefined}
                      className="btn-nav-next"
                    >
                      <span>{currentStep === questions.length - 1 ? 'Calculate My Score' : 'Next Question'}</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Privacy Assurance */}
                <div className="text-center mt-4 text-muted small">
                  <p className="mb-0">
                    <ShieldCheck size={14} className="me-1 text-success" />
                    All responses are confidential and handled under strict healthcare privacy standards.
                  </p>
                </div>
              </div>
            ) : (
              /* Full Page Results View (No Zoom-Out Needed!) */
              <div className="test-results-container">
                {/* Result Header & Score Metric */}
                <div className="results-hero-card">
                  <div className="results-badge-top">
                    <Activity size={18} className="me-1.5 text-primary" />
                    <span>Official Screener Results</span>
                  </div>

                  <h2 className="results-main-title">{assessment.title}</h2>
                  <p className="text-muted mb-4">
                    Based on standard clinical scoring thresholds for the <strong>{assessment.scaleName}</strong>.
                  </p>

                  <div className="results-score-row">
                    <div className="score-box-prominent">
                      <span className="score-number-large">{finalScore}</span>
                      <span className="score-scale-denom">/ {assessment.maxScore}</span>
                      <span className="score-label-caption">Total Points</span>
                    </div>

                    <div className="score-interpretation-col">
                      <div className="mb-2">
                        <span className={`severity-tag-large ${resultBand ? getSeverityBadgeClass(resultBand.level) : ''}`}>
                          {resultBand?.label || 'Assessment Complete'}
                        </span>
                      </div>
                      <p className="score-desc-para">
                        {resultBand?.description || 'Your assessment score has been computed based on standardized clinical criteria.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Personalized Recommendations Box */}
                {resultBand?.recommendation && (
                  <div className="recommendations-full-card">
                    <div className="rec-header">
                      <HeartHandshake size={22} className="text-primary me-2 flex-shrink-0" />
                      <h4 className="rec-title">Therapeutic Insights & Next Steps</h4>
                    </div>
                    <p className="rec-body">{resultBand.recommendation}</p>
                  </div>
                )}

                {/* Important Clinical Disclaimer */}
                <div className="clinical-disclaimer-box">
                  <AlertCircle size={18} className="text-muted me-2 flex-shrink-0 mt-0.5" />
                  <p className="mb-0 text-muted small leading-relaxed">
                    <strong>Clinical Note:</strong> This self-assessment is an evidence-based screening tool designed to help identify emotional distress patterns. It does not constitute a formal psychiatric or neurological diagnosis. If symptoms are interfering with your daily life, consulting a licensed psychologist or psychiatrist is highly recommended.
                  </p>
                </div>

                {/* Lead Form: Deliver Report to WhatsApp / Email */}
                <div className="lead-capture-section">
                  <div className="lead-card-header">
                    <FileCheck size={22} className="text-primary me-2.5 flex-shrink-0" />
                    <div>
                      <h4 className="mb-1 fw-bold">Receive Your Full Confidential Report</h4>
                      <p className="text-muted small mb-0">
                        Enter your contact details below to receive a detailed symptom breakdown and personalized self-care tools on WhatsApp & Email.
                      </p>
                    </div>
                  </div>

                  {saveSuccess ? (
                    <Alert variant="success" className="mt-4 p-4 text-center border-0 shadow-sm rounded-4">
                      <CheckCircle2 size={32} className="text-success mb-2 d-block mx-auto" />
                      <h5 className="fw-bold mb-1">Your Report Has Been Saved!</h5>
                      <p className="small text-muted mb-0">
                        Our psychology team has securely filed your profile. If you have chosen to speak with a counselor, we will reach out shortly.
                      </p>
                    </Alert>
                  ) : (
                    <Form onSubmit={handleSaveResult} className="lead-form-grid mt-4">
                      {saveError && (
                        <Alert variant="danger" className="py-2.5 small mb-3">
                          {saveError}
                        </Alert>
                      )}

                      <div className="row g-3">
                        <div className="col-12 col-md-4">
                          <Form.Group>
                            <Form.Label className="fw-semibold small">Full Name</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="e.g. Priya Sharma"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              className="lead-input"
                            />
                          </Form.Group>
                        </div>

                        <div className="col-12 col-md-4">
                          <Form.Group>
                            <Form.Label className="fw-semibold small">Phone / WhatsApp Number *</Form.Label>
                            <Form.Control
                              type="tel"
                              placeholder="e.g. 9876543210"
                              required
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="lead-input"
                            />
                          </Form.Group>
                        </div>

                        <div className="col-12 col-md-4">
                          <Form.Group>
                            <Form.Label className="fw-semibold small">Email Address</Form.Label>
                            <Form.Control
                              type="email"
                              placeholder="e.g. priya@gmail.com"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              className="lead-input"
                            />
                          </Form.Group>
                        </div>
                      </div>

                      <div className="lead-form-footer mt-4">
                        <span className="privacy-pill">
                          <ShieldCheck size={14} className="text-success me-1" />
                          Zero Spam • Encrypted Health Privacy
                        </span>

                        <button
                          type="submit"
                          disabled={isSaving}
                          className="btn-send-report"
                        >
                          {isSaving ? (
                            <>
                              <Spinner animation="border" size="sm" className="me-2" />
                              Saving Report...
                            </>
                          ) : (
                            <>
                              <Send size={16} className="me-2" />
                              Send My Confidential Report
                            </>
                          )}
                        </button>
                      </div>
                    </Form>
                  )}
                </div>

                {/* Primary Action Buttons (Spacious, Clear, Scroll-Friendly!) */}
                <div className="results-actions-grid">
                  <Link to="/consilar" className="btn-action-primary">
                    <CalendarCheck size={18} className="me-2" />
                    <span>Book Session with a Psychologist</span>
                  </Link>

                  <a
                    href={`https://wa.me/9716129129?text=${encodeURIComponent(
                      `Hello SS Psych Life Care, I completed the ${assessment.title} assessment (Score: ${finalScore}/${assessment.maxScore} - ${resultBand?.label}) and would like to speak with a psychologist.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-action-whatsapp"
                  >
                    <i className="bi bi-whatsapp me-2"></i>
                    <span>Discuss Report on WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleRestart}
                    className="btn-action-secondary"
                  >
                    <RotateCcw size={16} className="me-1.5" />
                    <span>Retake Assessment</span>
                  </button>

                  <Link to="/assessments" className="btn-action-secondary">
                    <span>Explore Other Tests</span>
                  </Link>
                </div>

                {/* Emergency Helplines reminder */}
                <div className="results-crisis-bar">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <AlertTriangle size={18} className="text-amber" />
                    <h6 className="mb-0 fw-bold text-amber">Need Immediate Crisis Support?</h6>
                  </div>
                  <p className="small mb-3 text-muted">
                    If you are experiencing overwhelming distress, reach out to free 24/7 helplines:
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    <a href="tel:14416" className="helpline-badge">
                      <PhoneCall size={13} className="me-1" />
                      Tele-MANAS: 14416
                    </a>
                    <a href="tel:18005990019" className="helpline-badge">
                      <PhoneCall size={13} className="me-1" />
                      KIRAN: 1800-599-0019
                    </a>
                    <a href="tel:9999666555" className="helpline-badge">
                      <PhoneCall size={13} className="me-1" />
                      Vandrevala Foundation: +91 9999 666 555
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
};

export default AssessmentDetail;
