import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  HeartHandshake, 
  RotateCcw, 
  Send, 
  CalendarCheck, 
  FileCheck,
  PhoneCall,
  Sparkles,
  Check
} from 'lucide-react';
import { ASSESSMENTS_LIST } from '../../constants/assessmentsData';
import { assessmentAPI } from '../../services/api';
import Logo from '../../assets/logo.png';
import './AssessmentDetail.css';

const AssessmentDetail = ({ defaultId }) => {
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const id = paramId || defaultId || 'anxiety';

  // Support aliases for IDs (e.g. phq-9 -> depression, gad7 -> gad-7)
  const idAliases = {
    'phq-9': 'depression',
    'phq9': 'depression',
    'gad7': 'gad-7'
  };
  const resolvedId = idAliases[id] || id;

  // Find the selected assessment
  const assessment = ASSESSMENTS_LIST.find((t) => t.id === resolvedId);

  // Hide Jotform agent and floating actions while taking assessment or viewing report
  useEffect(() => {
    const hideFloatingElements = () => {
      const selectors = [
        '#preact-border-shadow-host',
        '.embedded-agent-container',
        '.ai-agent-chat-avatar-container',
        '.jficc',
        '.floating-actions'
      ];
      selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          el.style.setProperty('display', 'none', 'important');
        });
      });
    };

    hideFloatingElements();
    const interval = setInterval(hideFloatingElements, 400);

    return () => {
      clearInterval(interval);
      const selectors = [
        '#preact-border-shadow-host',
        '.embedded-agent-container',
        '.ai-agent-chat-avatar-container',
        '.jficc',
        '.floating-actions'
      ];
      selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          el.style.display = '';
        });
      });
    };
  }, []);

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

  // Mobile tab state for zero-scroll on small screens ('score' | 'lead')
  const [mobileTab, setMobileTab] = useState('score');

  // Reset test state whenever assessment id changes
  useEffect(() => {
    setCurrentStep(0);
    setAnswers({});
    setIsCompleted(false);
    setFinalScore(0);
    setResultBand(null);
    setSaveSuccess(false);
    setSaveError('');
    setMobileTab('score');
  }, [id]);

  // If assessment not found or is the game
  if (!assessment) {
    return (
      <div className="zero-scroll-assessment-root">
        <div className="not-found-card text-center p-4">
          <AlertCircle size={40} className="text-warning mb-3" />
          <h3 className="mb-2">Assessment Not Found</h3>
          <p className="text-muted mb-4 small">
            We couldn't locate this assessment. Please choose from our catalog of clinical screeners.
          </p>
          <Link to="/assessments" className="btn btn-primary rounded-pill px-4">
            ← Browse All Assessments
          </Link>
        </div>
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
  };

  const handleSelectOption = useCallback((score) => {
    const updatedAnswers = {
      ...answers,
      [currentQuestion.id]: score
    };
    setAnswers(updatedAnswers);

    // Smooth auto-advance without scrolling
    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        calculateResults(updatedAnswers);
      }
    }, 200);
  }, [answers, currentQuestion, currentStep, questions.length]);

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
    setMobileTab('score');
  };

  // Keyboard shortcut listener for options (1, 2, 3, 4)
  useEffect(() => {
    if (isCompleted || !questionOptions.length) return;

    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      const num = parseInt(e.key, 10);
      if (!isNaN(num) && num >= 1 && num <= questionOptions.length) {
        const option = questionOptions[num - 1];
        if (option) {
          handleSelectOption(option.score);
        }
      } else if (e.key === 'ArrowLeft' && currentStep > 0) {
        handlePrev();
      } else if (e.key === 'ArrowRight' && answers[currentQuestion?.id] !== undefined) {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCompleted, questionOptions, answers, currentStep, currentQuestion, handleSelectOption]);

  const handleSaveResult = async (e) => {
    e.preventDefault();
    if (!formData.phone) {
      setSaveError('Please enter your phone number to receive your report.');
      return;
    }
    if (!formData.name && !formData.email) {
      setSaveError('Please provide your name or email.');
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
        return 'severity-badge-minimal';
      case 'mild':
        return 'severity-badge-mild';
      case 'moderate':
        return 'severity-badge-moderate';
      case 'severe':
        return 'severity-badge-severe';
      default:
        return 'severity-badge-mild';
    }
  };

  return (
    <div className="zero-scroll-assessment-root">
      {!isCompleted ? (
        /* ========================================================
           SCREEN 1: ASSESSMENT QUESTION TAKING VIEW (ZERO-SCROLL)
           ======================================================== */
        <div className="screener-flow-container">
          {/* Unified Compact Top Header with integrated progress line */}
          <header className="screener-top-header">
            <div className="screener-header-left">
              <Link to="/assessments" className="screener-exit-btn" title="Exit to All Assessments">
                <ArrowLeft size={16} />
                <span>Exit</span>
              </Link>
              <div className="screener-brand-lockup d-none d-sm-flex">
                <img src={Logo} alt="SS Psych Life Care" className="screener-logo-img" />
                <span className="screener-brand-name">SS Psych Life Care</span>
              </div>
            </div>

            <div className="screener-header-center">
              <span className="screener-step-chip">
                Question <strong>{currentStep + 1}</strong> of {questions.length}
              </span>
              <span className="screener-title-badge d-none d-md-inline">{assessment.title}</span>
              <span className="screener-scale-pill d-none d-md-inline">{assessment.scaleName}</span>
            </div>

            <div className="screener-header-right">
              <div className="screener-guarantee-chip d-none d-sm-inline-flex">
                <ShieldCheck size={14} className="text-success" />
                <span>100% Confidential</span>
              </div>
              <span className="screener-percent-pill">{progressPercentage}%</span>
            </div>

            {/* Seamless 3px progress line directly under header */}
            <div className="screener-header-progress-line">
              <div 
                className="screener-header-progress-fill" 
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </header>

          {/* Center Stage: Question Card */}
          <main className="screener-stage">
            <div className="screener-card">
              {/* Question Context Header */}
              <div className="screener-question-meta">
                <span className="screener-qnumber-tag">
                  {currentQuestion.sectionTitle || `Question ${currentStep + 1}`}
                </span>
                <span className="screener-context-note">
                  Over the past 2 weeks:
                </span>
              </div>

              {/* Main Prompt */}
              <h2 className="screener-prompt-text">{currentQuestion.text}</h2>

              {/* Options Grid */}
              <div className="screener-options-grid">
                {questionOptions.map((opt, idx) => {
                  const isSelected = answers[currentQuestion.id] === opt.score;
                  return (
                    <button
                      key={opt.score}
                      type="button"
                      onClick={() => handleSelectOption(opt.score)}
                      className={`screener-option-btn ${isSelected ? 'selected' : ''}`}
                    >
                      <div className="option-key-badge">{idx + 1}</div>
                      <div className="option-content-body">
                        <span className="option-label-text">{opt.text}</span>
                        {opt.score !== undefined && (
                          <span className="option-score-text">
                            {opt.score} {opt.score === 1 ? 'pt' : 'pts'}
                          </span>
                        )}
                      </div>
                      <div className={`option-check-circle ${isSelected ? 'active' : ''}`}>
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </main>

          {/* Bottom Navigation Footer */}
          <footer className="screener-nav-footer">
            <div className="screener-footer-inner">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="screener-btn-prev"
              >
                <ArrowLeft size={16} />
                <span>Prev</span>
              </button>

              <div className="screener-footer-hint d-none d-sm-block">
                {answers[currentQuestion.id] !== undefined ? (
                  <span className="status-selected">
                    <CheckCircle2 size={14} className="me-1" />
                    Answer Selected
                  </span>
                ) : (
                  <span className="status-prompt">
                    Click an option or press <kbd>1</kbd>–<kbd>{questionOptions.length}</kbd>
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleNext}
                disabled={answers[currentQuestion.id] === undefined}
                className="screener-btn-next"
              >
                <span>{currentStep === questions.length - 1 ? 'Calculate Score' : 'Next'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </footer>
        </div>
      ) : (
        /* ========================================================
           SCREEN 2: ASSESSMENT REPORT VIEW (ZERO-SCROLL DASHBOARD)
           ======================================================== */
        <div className="screener-flow-container report-view">
          {/* Top Bar: Brand, Report Title, Retake & Exit */}
          <header className="screener-top-header">
            <div className="screener-header-left">
              <Link to="/assessments" className="screener-exit-btn">
                <ArrowLeft size={16} />
                <span>All Tests</span>
              </Link>
              <div className="screener-brand-lockup d-none d-sm-flex">
                <img src={Logo} alt="SS Psych Life Care" className="screener-logo-img" />
                <span className="screener-brand-name">SS Psych Life Care</span>
              </div>
            </div>

            <div className="screener-header-center">
              <span className="screener-title-badge d-none d-sm-inline">Report: {assessment.title}</span>
              <span className="screener-title-badge d-inline d-sm-none">Report</span>
              <span className="screener-scale-pill d-none d-md-inline">{assessment.scaleName}</span>
            </div>

            <div className="screener-header-right">
              <button onClick={handleRestart} className="btn-retake-header" title="Retake this assessment">
                <RotateCcw size={15} className="me-1" />
                <span>Retake</span>
              </button>
            </div>
          </header>

          {/* Mobile Tab Switcher (Visible only on small screens for zero-scroll) */}
          <div className="report-mobile-tabs d-flex d-md-none">
            <button 
              className={`report-tab-btn ${mobileTab === 'score' ? 'active' : ''}`}
              onClick={() => setMobileTab('score')}
            >
              📊 Score & Guidance
            </button>
            <button 
              className={`report-tab-btn ${mobileTab === 'lead' ? 'active' : ''}`}
              onClick={() => setMobileTab('lead')}
            >
              📩 Full Report & Helplines
            </button>
          </div>

          {/* Main Report Dashboard (2-column layout fitted to viewport) */}
          <main className="report-dashboard-stage">
            <div className="report-dashboard-grid">
              {/* LEFT COLUMN: Clinical Score, Meter & Guidance */}
              <div className={`report-col-left ${mobileTab !== 'score' ? 'd-none d-md-flex' : 'd-flex'}`}>
                {/* Score & Severity Card */}
                <div className="report-card score-summary-card">
                  <div className="score-card-header">
                    <div className="score-figure-box">
                      <span className="score-digit">{finalScore}</span>
                      <span className="score-denom">/{assessment.maxScore}</span>
                      <span className="score-caption">Points</span>
                    </div>

                    <div className="severity-info-block">
                      <div className="severity-badge-row">
                        <span className={`severity-badge-pill ${resultBand ? getSeverityBadgeClass(resultBand.level) : ''}`}>
                          {resultBand?.label || 'Assessment Complete'}
                        </span>
                      </div>
                      <p className="score-interpretation-text mb-0">
                        {resultBand?.description || 'Your score has been computed using validated clinical scoring ranges.'}
                      </p>
                    </div>
                  </div>

                  {/* Multi-tier Severity Meter */}
                  {assessment.bands && assessment.bands.length > 0 && (
                    <div className="severity-meter-track">
                      {assessment.bands.map((band, idx) => {
                        const isCurrentBand = resultBand?.label === band.label;
                        // Clean short label for crisp display: "Minimal", "Mild", "Moderate", "Severe"
                        const shortLabel = band.level ? band.level.charAt(0).toUpperCase() + band.level.slice(1) : band.label.split(' ')[0];
                        return (
                          <div 
                            key={idx} 
                            className={`severity-meter-segment seg-${band.level || 'mild'} ${isCurrentBand ? 'active-needle' : ''}`}
                            title={`${band.label} (${band.min} - ${band.max} pts)`}
                          >
                            <span className="segment-label">{shortLabel}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Personalized Therapeutic Insights Card */}
                {resultBand?.recommendation && (
                  <div className="report-card guidance-card">
                    <div className="guidance-card-header">
                      <HeartHandshake size={16} className="text-teal me-1.5 flex-shrink-0" />
                      <h4 className="guidance-card-title">Therapeutic Insights & Next Steps</h4>
                    </div>
                    <p className="guidance-card-body mb-0">
                      {resultBand.recommendation}
                    </p>
                  </div>
                )}

                {/* Primary Action Buttons */}
                <div className="report-actions-row">
                  <Link to="/consilar" className="btn-action-consult">
                    <CalendarCheck size={15} className="me-1.5" />
                    <span>Book Session</span>
                  </Link>
                  <a
                    href={`https://wa.me/9716129129?text=${encodeURIComponent(
                      `Hello SS Psych Life Care, I completed the ${assessment.title} assessment (Score: ${finalScore}/${assessment.maxScore} - ${resultBand?.label}) and would like to speak with a psychologist.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-action-whatsapp"
                  >
                    <i className="bi bi-whatsapp me-1.5"></i>
                    <span>Discuss on WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* RIGHT COLUMN: Full Report Delivery & Crisis Helplines */}
              <div className={`report-col-right ${mobileTab !== 'lead' ? 'd-none d-md-flex' : 'd-flex'}`}>
                {/* Confidential Report Delivery Card */}
                <div className="report-card lead-capture-card">
                  <div className="lead-header-row">
                    <FileCheck size={18} className="text-primary me-2 flex-shrink-0" />
                    <div>
                      <h4 className="lead-box-title">Get Your Full Confidential Report</h4>
                      <p className="lead-box-desc mb-0">
                        Receive complete symptom analysis & self-care guide on WhatsApp / Email.
                      </p>
                    </div>
                  </div>

                  {saveSuccess ? (
                    <div className="lead-success-box">
                      <CheckCircle2 size={22} className="text-success mb-1" />
                      <h5 className="lead-success-title">Your Report Has Been Saved!</h5>
                      <p className="lead-success-desc mb-0">
                        Our psychology team will deliver your full symptom breakdown.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSaveResult} className="lead-compact-form">
                      {saveError && (
                        <div className="alert alert-danger py-1 px-2.5 small mb-1.5">{saveError}</div>
                      )}

                      <div className="lead-inputs-stack">
                        <div className="form-group mb-1.5">
                          <label className="form-label-xs">Full Name</label>
                          <input
                            type="text"
                            placeholder="e.g. Priya Sharma"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="form-control-xs"
                          />
                        </div>

                        <div className="form-group mb-1.5">
                          <label className="form-label-xs">Phone / WhatsApp Number *</label>
                          <input
                            type="tel"
                            placeholder="e.g. 9876543210"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="form-control-xs"
                          />
                        </div>

                        <div className="form-group mb-1.5">
                          <label className="form-label-xs">Email Address</label>
                          <input
                            type="email"
                            placeholder="e.g. priya@gmail.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="form-control-xs"
                          />
                        </div>
                      </div>

                      <div className="lead-submit-row">
                        <span className="privacy-chip">
                          <ShieldCheck size={12} className="text-success me-1" />
                          100% Private
                        </span>

                        <button
                          type="submit"
                          disabled={isSaving}
                          className="btn-send-report-compact"
                        >
                          {isSaving ? (
                            <span>Saving...</span>
                          ) : (
                            <>
                              <Send size={13} className="me-1" />
                              <span>Send Report</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Clinic Helplines & Non-Diagnostic Disclaimer */}
                <div className="report-card crisis-disclaimer-card">
                  <div className="crisis-title-row">
                    <PhoneCall size={13} className="text-emerald-700 me-1" />
                    <span className="crisis-title-text">Clinic Helplines & Direct Support</span>
                  </div>

                  <div className="crisis-pills-row">
                    <a href="tel:9716129129" className="helpline-compact-pill">
                      Call: <strong>+91 97161 29129</strong>
                    </a>
                    <a href="tel:9899555507" className="helpline-compact-pill">
                      Call: <strong>+91 98995 55507</strong>
                    </a>
                    <a href="mailto:sspsychological5@gmail.com" className="helpline-compact-pill">
                      Email: <strong>sspsychological5@gmail.com</strong>
                    </a>
                  </div>

                  <p className="clinical-disclaimer-text mb-0">
                    <strong>Clinical Disclaimer:</strong> This screener provides an indicative score for self-reflection and educational purposes only. It is not a clinical diagnosis or medical directive. A definitive evaluation requires a session with a licensed clinical psychologist.
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default AssessmentDetail;
