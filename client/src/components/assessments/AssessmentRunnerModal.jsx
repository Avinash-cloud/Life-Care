import React, { useState, useEffect } from 'react';
import { Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  HeartHandshake, 
  RotateCcw, 
  X,
  Send,
  CalendarCheck,
  FileCheck
} from 'lucide-react';
import { assessmentAPI } from '../../services/api';
import './AssessmentRunnerModal.css';

const AssessmentRunnerModal = ({ show, onHide, assessment }) => {
  const navigate = useNavigate();

  // Test state
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [resultBand, setResultBand] = useState(null);

  // Lead capture form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Reset when assessment changes or modal opens
  useEffect(() => {
    if (show && assessment) {
      setCurrentStep(0);
      setAnswers({});
      setIsCompleted(false);
      setFinalScore(0);
      setResultBand(null);
      setSaveSuccess(false);
      setSaveError('');
    }
  }, [show, assessment]);

  if (!assessment || !assessment.questions || assessment.questions.length === 0) {
    return null;
  }

  const questions = assessment.questions;
  const options = assessment.options || [];
  const currentQuestion = questions[currentStep];
  const progressPercentage = Math.round(((currentStep + 1) / questions.length) * 100);

  const handleSelectOption = (score) => {
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: score
    };
    setAnswers(updatedAnswers);

    // Auto-advance after small timeout for smooth UX
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        // Complete the test
        calculateResults(updatedAnswers);
      }
    }, 240);
  };

  const calculateResults = (finalAnswers) => {
    let totalScore = 0;
    questions.forEach((q) => {
      let scoreVal = finalAnswers[q.id] || 0;
      if (q.reverse) {
        // Reverse scoring if question is reverse-keyed (e.g. PSS-10)
        const maxVal = options.length - 1;
        scoreVal = maxVal - scoreVal;
      }
      totalScore += scoreVal;
    });

    setFinalScore(totalScore);

    // Find band
    let matchedBand = null;
    if (assessment.bands && assessment.bands.length > 0) {
      matchedBand = assessment.bands.find(
        (b) => totalScore >= b.min && totalScore <= b.max
      );
      if (!matchedBand) {
        matchedBand = assessment.bands[assessment.bands.length - 1];
      }
    }

    setResultBand(matchedBand);
    setIsCompleted(true);
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
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
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
      className="assessment-runner-modal"
    >
      <div className="assessment-modal-container">
        {/* Header */}
        <div className="assessment-modal-header">
          <div className="header-meta">
            <span className="scale-pill">{assessment.scaleName}</span>
            <div className="duration-pill">
              <Clock size={13} />
              <span>{assessment.duration}</span>
            </div>
          </div>
          <button className="close-btn" onClick={onHide} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="assessment-modal-body">
          {!isCompleted ? (
            /* Active Question View */
            <div className="assessment-question-view">
              {/* Title & Progress */}
              <div className="progress-section">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <h3 className="assessment-runner-title">{assessment.title}</h3>
                  <span className="step-counter">
                    Question <strong>{currentStep + 1}</strong> of {questions.length}
                  </span>
                </div>
                
                <div className="custom-progress-track">
                  <div 
                    className="custom-progress-fill" 
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {/* Instructions banner */}
              <div className="instruction-box">
                <span className="instruction-icon"><AlertCircle size={15} /></span>
                <span>
                  Over the <strong>last 2 weeks</strong>, how often have you been bothered by the following problem?
                </span>
              </div>

              {/* Question Text */}
              <div className="question-content-box">
                <span className="question-number-badge">#{currentStep + 1}</span>
                <h4 className="question-prompt-text">{currentQuestion.text}</h4>
              </div>

              {/* Options */}
              <div className="options-stack">
                {options.map((opt) => {
                  const isSelected = answers[currentQuestion.id] === opt.score;
                  return (
                    <button
                      key={opt.score}
                      type="button"
                      onClick={() => handleSelectOption(opt.score)}
                      className={`option-btn ${isSelected ? 'selected' : ''}`}
                    >
                      <div className="option-label-wrapper">
                        <span className="option-label-text">{opt.text}</span>
                        {opt.score !== undefined && (
                          <span className="option-points-hint">{opt.score} pts</span>
                        )}
                      </div>
                      <div className={`option-check-circle ${isSelected ? 'checked' : ''}`}>
                        {isSelected && <CheckCircle2 size={18} />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Footer Controls */}
              <div className="question-controls">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="control-btn prev-btn"
                >
                  <ArrowLeft size={16} />
                  <span>Previous</span>
                </button>

                <div className="control-right">
                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={answers[currentQuestion.id] === undefined}
                    className="control-btn next-btn"
                  >
                    <span>{currentStep === questions.length - 1 ? 'View Report' : 'Next'}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Results View */
            <div className="assessment-results-view">
              {/* Result Summary Card */}
              <div className="results-summary-card">
                <div className="results-header-tag">
                  <ShieldCheck size={18} className="me-1 text-success" />
                  <span>Validated Clinical Screener Result</span>
                </div>

                <h3 className="results-title">{assessment.title}</h3>

                <div className="score-metric-banner">
                  <div className="score-number-box">
                    <span className="score-val">{finalScore}</span>
                    <span className="score-max">/ {assessment.maxScore}</span>
                  </div>
                  <div className="score-tier-details">
                    <div className="tier-indicator">
                      <span className={`severity-badge ${resultBand ? getSeverityBadgeClass(resultBand.level) : ''}`}>
                        {resultBand?.label || 'Assessment Complete'}
                      </span>
                    </div>
                    <p className="tier-description">
                      {resultBand?.description || 'Your assessment score has been computed according to standard clinical diagnostic thresholds.'}
                    </p>
                  </div>
                </div>

                {/* Recommendations */}
                {resultBand?.recommendation && (
                  <div className="recommendations-box">
                    <h5 className="recommendations-heading">
                      <HeartHandshake size={18} className="me-2 text-primary" />
                      Psychological Guidance & Recommendations
                    </h5>
                    <p className="recommendations-body">{resultBand.recommendation}</p>
                  </div>
                )}
              </div>

              {/* Lead Save Form */}
              <div className="report-delivery-card">
                <div className="delivery-card-header">
                  <FileCheck size={20} className="text-primary me-2" />
                  <div>
                    <h5 className="mb-0 fw-bold">Receive Your Full Confidential Report</h5>
                    <p className="text-muted small mb-0">
                      Save your score breakdown and get actionable wellness exercises sent to WhatsApp & Email.
                    </p>
                  </div>
                </div>

                {saveSuccess ? (
                  <Alert variant="success" className="mt-3 text-center border-0 shadow-sm">
                    <CheckCircle2 size={24} className="mb-1 text-success d-block mx-auto" />
                    <strong>Report Saved Successfully!</strong>
                    <div className="small mt-1">
                      Our psychologists are available if you wish to review these findings together during a session.
                    </div>
                  </Alert>
                ) : (
                  <Form onSubmit={handleSaveResult} className="mt-3">
                    {saveError && (
                      <Alert variant="danger" className="py-2 small mb-3">
                        {saveError}
                      </Alert>
                    )}

                    <div className="row g-2">
                      <div className="col-12 col-md-4">
                        <Form.Group>
                          <Form.Label className="small fw-semibold">Your Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="e.g. Riya Sharma"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="custom-input"
                          />
                        </Form.Group>
                      </div>

                      <div className="col-12 col-md-4">
                        <Form.Group>
                          <Form.Label className="small fw-semibold">Phone / WhatsApp *</Form.Label>
                          <Form.Control
                            type="tel"
                            placeholder="e.g. 9876543210"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="custom-input"
                          />
                        </Form.Group>
                      </div>

                      <div className="col-12 col-md-4">
                        <Form.Group>
                          <Form.Label className="small fw-semibold">Email Address</Form.Label>
                          <Form.Control
                            type="email"
                            placeholder="e.g. riya@gmail.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="custom-input"
                          />
                        </Form.Group>
                      </div>
                    </div>

                    <div className="mt-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
                      <span className="privacy-pill-notice">
                        <ShieldCheck size={13} className="me-1 text-success" />
                        100% Confidential • No spam • Encrypted
                      </span>

                      <button
                        type="submit"
                        disabled={isSaving}
                        className="btn-submit-report"
                      >
                        {isSaving ? (
                          <>
                            <Spinner animation="border" size="sm" className="me-2" />
                            Saving Report...
                          </>
                        ) : (
                          <>
                            <Send size={15} className="me-2" />
                            Send My Report
                          </>
                        )}
                      </button>
                    </div>
                  </Form>
                )}
              </div>

              {/* Next Steps CTA Actions */}
              <div className="results-cta-actions">
                <Link
                  to="/consilar"
                  onClick={onHide}
                  className="cta-book-btn"
                >
                  <CalendarCheck size={18} className="me-2" />
                  <span>Book Consultation with Psychologist</span>
                </Link>

                <a
                  href={`https://wa.me/9716129129?text=${encodeURIComponent(
                    `Hello SS Psych Life Care, I took the ${assessment.title} assessment (Score: ${finalScore}/${assessment.maxScore} - ${resultBand?.label}) and would like to speak with a psychologist.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cta-whatsapp-btn"
                >
                  <i className="bi bi-whatsapp me-2"></i>
                  <span>WhatsApp a Psychologist</span>
                </a>

                <button
                  type="button"
                  onClick={handleRestart}
                  className="cta-retake-btn"
                >
                  <RotateCcw size={16} className="me-1" />
                  <span>Retake Test</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default AssessmentRunnerModal;
