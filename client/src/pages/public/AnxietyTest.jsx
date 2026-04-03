import React, { useState, useEffect } from "react";
import { HeartPulse, Brain, ShieldCheck, Activity } from "lucide-react";
import { Container, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { assessmentAPI } from '../../services/api';

const OptionCard = ({ option, isSelected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(option.value)}
      className={`w-full p-4 rounded-xl transition-all duration-300 border-2 ${isSelected
        ? "bg-[#f4f7f6] border-[#3d6a5f] shadow-md transform scale-[1.02]"
        : "bg-white border-slate-200 hover:border-[#86a89f] hover:shadow-sm hover:-translate-y-1"
        } active:scale-95 group`}
    >
      <div className="flex items-start">
        <div className="text-left flex-1">
          <div className="flex items-center mb-1">
            <span
              className={`font-medium text-sm lg:text-base ${isSelected ? "text-[#2c4d44] font-semibold" : "text-slate-700"
                }`}
            >
              {option.label}
            </span>
          </div>
        </div>

        <div
          className={`flex-shrink-0 ml-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isSelected
            ? "border-[#3d6a5f] bg-[#3d6a5f]"
            : "border-slate-300 group-hover:border-[#86a89f]"
            }`}
        >
          {isSelected && (
            <span className="text-white text-xs font-bold">✓</span>
          )}
        </div>
      </div>
    </button>
  );
};

const ProgressBar = ({ current, total, sectionTitle }) => {
  const percentage = ((current + 1) / total) * 100;

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-bold text-[#3d6a5f]">
          {sectionTitle || "Assessment Progress"}
        </span>
        <span className="text-sm font-bold text-[#3d6a5f]">
          {Math.round(percentage)}% Complete
        </span>
      </div>

      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#3d6a5f] rounded-full transition-all duration-500 ease-out shadow-sm"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

const ResultsCard = ({ score, totalQuestions, onRestart }) => {
  const navigate = useNavigate();
  // Max possible score is totalQuestions * 3
  const maxScore = totalQuestions * 3;
  const percentage = (score / maxScore) * 100;

  let resultTier = {};
  if (percentage <= 25) {
    resultTier = {
      title: "Low Indications of Concern",
      color: "text-emerald-700",
      bg: "bg-emerald-50",
      icon: <ShieldCheck size={32} className="text-emerald-600" />,
      description: "You seem to be managing well. Everyone experiences ups and downs, but your current responses do not indicate severe psychological distress. Continue practicing good self-care and maintaining healthy routines.",
      actionText: "Explore Wellness Blogs",
      actionLink: "/blog"
    };
  } else if (percentage <= 50) {
    resultTier = {
      title: "Mild to Moderate Indications",
      color: "text-amber-600",
      bg: "bg-amber-50",
      icon: <Activity size={32} className="text-amber-500" />,
      description: "You might be experiencing some elevated stress, anxiety, or low mood. It's completely normal to feel this way sometimes, but addressing it early can be very helpful.",
      actionText: "View Our Counsellors",
      actionLink: "/client/counsellors"
    };
  } else if (percentage <= 75) {
    resultTier = {
      title: "High Indications of Distress",
      color: "text-orange-600",
      bg: "bg-orange-50",
      icon: <Brain size={32} className="text-orange-500" />,
      description: "Your responses suggest you are experiencing significant emotional or psychological challenges right now. We strongly recommend reaching out to a professional for support and guidance.",
      actionText: "Book a Session Today",
      actionLink: "/client/counsellors"
    };
  } else {
    resultTier = {
      title: "Severe Indications of Distress",
      color: "text-red-700",
      bg: "bg-red-50",
      icon: <HeartPulse size={32} className="text-red-600" />,
      description: "Your results indicate severe distress. You do not have to go through this alone. Please reach out to a mental health professional, a trusted loved one, or a crisis helpline immediately.",
      actionText: "Get Immediate Support",
      actionLink: "/client/counsellors"
    };
  }

  return (
    <div className="space-y-6 animate-fadeIn py-4">
      <div className="text-center mb-6">
        <div className={`mx-auto w-20 h-20 flex items-center justify-center rounded-full mb-4 ${resultTier.bg}`}>
          {resultTier.icon}
        </div>
        <h3 className={`text-2xl lg:text-3xl font-bold mb-2 ${resultTier.color}`}>
          Assessment Complete
        </h3>
        <p className="text-slate-500">Thank you for reflecting on your well-being.</p>
      </div>

      <div className={`p-6 rounded-2xl border border-slate-100 shadow-sm ${resultTier.bg}`}>
        <h4 className={`text-xl font-semibold mb-3 ${resultTier.color}`}>
          {resultTier.title}
        </h4>
        <p className="text-slate-700 leading-relaxed mb-0">
          {resultTier.description}
        </p>
      </div>

      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 mt-4">
        <h4 className="font-semibold text-slate-800 mb-2">Important Disclaimer</h4>
        <p className="text-sm text-slate-600 mb-0">
          This assessment is not a diagnostic tool. Mental health conditions can only be diagnosed by licensed healthcare professionals. These results are meant to provide general guidance about your current well-being.
        </p>
      </div>

      <div className="pt-6 flex flex-row gap-3 mt-4">
        <button
          onClick={() => navigate(resultTier.actionLink)}
          className="flex-1 py-3 bg-[#3d6a5f] text-white font-bold rounded-xl hover:bg-[#2c4d44] transition-all duration-300 shadow-md flex items-center justify-center gap-2"
        >
          {resultTier.actionText}
        </button>

        <button
          onClick={onRestart}
          className="flex-1 py-3 bg-white text-slate-700 font-bold rounded-xl border-2 border-slate-300 hover:bg-slate-100 transition-all duration-300 flex items-center justify-center"
        >
          Retake Assessment
        </button>
      </div>
    </div>
  );
};

const AnxietyTest = () => {
  const [assessmentData, setAssessmentData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    // Fetch the JSON file from the public folder
    const fetchAssessment = async () => {
      try {
        const response = await fetch('/mental_health_assessment.json');
        const data = await response.json();
        setAssessmentData(data.assessment);
        
        // Flatten the questions from all sections into a single array
        let flatQuestions = [];
        data.assessment.sections.forEach(section => {
          section.questions.forEach(q => {
            flatQuestions.push({
              ...q,
              sectionTitle: section.title
            });
          });
        });
        setQuestions(flatQuestions);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load assessment data:", error);
        setLoading(false);
      }
    };
    fetchAssessment();
  }, []);

  const handleOptionSelect = (value) => {
    if (isAnimating) return;

    setIsAnimating(true);
    const newAnswers = { ...answers, [currentStep]: value };
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        calculateResult(newAnswers);
      }
      setIsAnimating(false);
    }, 300);
  };

  const calculateResult = (answersMap) => {
    let totalScore = 0;
    Object.values(answersMap).forEach(val => {
      totalScore += val;
    });
    
    setFinalScore(totalScore);
    
    setTimeout(() => {
      setShowResults(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      
      // Show modal to save results automatically after a tiny delay
      setTimeout(() => setShowModal(true), 1200);
    }, 400);
  };

  const handleRestart = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentStep(0);
      setAnswers({});
      setShowResults(false);
      setFinalScore(0);
      setIsAnimating(false);
      setSaveSuccess(false);
      setSaveError('');
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name && !formData.email) {
      setSaveError('Please provide either your Name or Email Address.');
      return;
    }
    
    setIsSaving(true);
    setSaveError('');
    
    try {
      await assessmentAPI.saveResult({
        ...formData,
        score: finalScore,
        testUrl: window.location.href
      });
      setSaveSuccess(true);
      setTimeout(() => setShowModal(false), 2000);
    } catch (err) {
      setSaveError(err.response?.data?.message || 'Failed to save results. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0 && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 200);
    }
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes bounceIn {
        0% { transform: scale(0.95); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
      }
      .animate-fadeIn {
        animation: fadeIn 0.4s ease-out forwards;
      }
      .animate-bounceIn {
        animation: bounceIn 0.4s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <div className="spinner-border text-teal-600" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-slate-50">
        <p>No assessment data available.</p>
      </div>
    );
  }

  return (
    <div className="assessment-page pb-12 pt-5 mt-5 bg-slate-50 min-h-screen">
      <Container>
        <div className="text-center mb-6 pt-4">
          <h2 className="text-3xl font-bold text-slate-800 mb-3">{assessmentData?.title}</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">{assessmentData?.description}</p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div
            className={`bg-white rounded-2xl shadow-sm border border-slate-200 p-5 md:p-8 transition-all duration-300 ${isAnimating ? "opacity-60" : "opacity-100"
              }`}
          >
            {!showResults ? (
              <div className="animate-bounceIn">
                <ProgressBar
                  current={currentStep}
                  total={questions.length}
                  sectionTitle={questions[currentStep].sectionTitle}
                />

                <div className="mb-8 mt-6">
                  <h3 className="text-xl md:text-2xl font-semibold text-slate-800 leading-snug">
                    {questions[currentStep].text}
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3 md:gap-4 mb-8">
                  {questions[currentStep].options.map((option, index) => (
                    <OptionCard
                      key={index}
                      option={option}
                      isSelected={answers[currentStep] === option.value}
                      onSelect={handleOptionSelect}
                    />
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-100">
                  <button
                    onClick={handlePrev}
                    disabled={currentStep === 0 || isAnimating}
                    className={`px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${currentStep === 0
                      ? "text-slate-300 cursor-not-allowed"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`}
                  >
                    ← Previous
                  </button>

                  <div className="text-center text-sm text-slate-500">
                    Question {currentStep + 1} of {questions.length}
                  </div>

                  <button
                    onClick={() => {
                      if (currentStep === questions.length - 1 && answers[currentStep] !== undefined) {
                        calculateResult(answers);
                      } else if (answers[currentStep] !== undefined) {
                        handleOptionSelect(answers[currentStep]);
                      }
                    }}
                    disabled={answers[currentStep] === undefined || isAnimating}
                    className={`px-6 py-2.5 rounded-xl font-medium transition-all duration-300 ${answers[currentStep] === undefined
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "bg-[#3d6a5f] text-white hover:bg-[#2c4d44] shadow-sm"
                      }`}
                  >
                    {currentStep === questions.length - 1
                      ? "Get Results"
                      : "Next →"}
                  </button>
                </div>
              </div>
            ) : (
              <ResultsCard 
                score={finalScore} 
                totalQuestions={questions.length} 
                onRestart={handleRestart} 
              />
            )}
          </div>
          
          {!showResults && (
            <div className="mt-8 text-center text-slate-500 text-sm">
              <p>Your responses are completely private and are not stored permanently.</p>
              <p className="mt-1">For accurate results, please answer honestly based on how you have felt over the past two weeks.</p>
            </div>
          )}
        </div>
      </Container>
      
      {/* Save Result Modal */}
      <Modal show={showModal} onHide={() => !isSaving && !saveSuccess && setShowModal(false)} centered backdrop="static">
        <Modal.Header closeButton={!isSaving && !saveSuccess}>
          <Modal.Title>Save Your Results</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4">
          {!saveSuccess ? (
            <>
              <p className="text-slate-600 mb-4">
                Please provide your details below to save your assessment score securely to your profile.
              </p>
              
              {saveError && <Alert variant="danger">{saveError}</Alert>}
              
              <Form onSubmit={handleModalSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                  <Form.Text className="text-muted">Fill this OR your email below.</Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    required
                    placeholder="Enter your mobile number"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </Form.Group>
                
                <div className="d-grid mt-2">
                  <button 
                    type="submit" 
                    className="py-2.5 bg-[#3d6a5f] text-white font-bold rounded-lg hover:bg-[#2c4d44] transition"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" /> Saving...</>
                    ) : (
                      "Save Results"
                    )}
                  </button>
                </div>
                <div className="text-center mt-3">
                  <button 
                    type="button" 
                    className="text-slate-500 text-sm hover:text-slate-700 underline bg-transparent border-0"
                    onClick={() => setShowModal(false)}
                    disabled={isSaving}
                  >
                    Skip for now
                  </button>
                </div>
              </Form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="mb-3">
                <ShieldCheck size={48} className="text-emerald-500 mx-auto" />
              </div>
              <h4 className="text-emerald-700 font-bold">Successfully Saved!</h4>
              <p className="text-slate-600">Your results have been securely recorded.</p>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AnxietyTest;
