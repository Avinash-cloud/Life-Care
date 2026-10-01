// Comprehensive Mental Health Assessments Data Hub
// Standardized clinical screeners (GAD-7, PHQ-9, PSS-10, ASRS v1.1, Y-BOCS, RSS, PCL-5, Teen Scale, Games)

export const ASSESSMENT_CATEGORIES = [
  { id: 'all', label: 'All Assessments', icon: 'bi-grid-fill' },
  { id: 'anxiety', label: 'Anxiety & Panic', icon: 'bi-heart-pulse' },
  { id: 'depression', label: 'Mood & Depression', icon: 'bi-cloud-rain' },
  { id: 'stress', label: 'Stress & Burnout', icon: 'bi-fire' },
  { id: 'adhd', label: 'ADHD & Focus', icon: 'bi-lightning-charge' },
  { id: 'ocd', label: 'OCD & Obsessions', icon: 'bi-arrow-repeat' },
  { id: 'relationship', label: 'Relationships', icon: 'bi-people' },
  { id: 'trauma', label: 'Trauma & PTSD', icon: 'bi-shield-check' },
  { id: 'teen', label: 'Teen & Youth', icon: 'bi-mortarboard' },
  { id: 'wellness', label: 'Interactive Games', icon: 'bi-controller' }
];

export const FREQUENTLY_ASKED_QUESTIONS = [
  {
    question: "Are these self-assessments equivalent to a clinical medical diagnosis?",
    answer: "No. These screeners are standardized, evidence-based psychological measurement tools (such as GAD-7, PHQ-9, and PSS-10) widely used by mental health clinicians to track severity indicators. However, they do not replace a formal clinical psychiatric or psychological diagnosis. For a formal evaluation and treatment plan, we recommend scheduling an appointment with our registered psychologists."
  },
  {
    question: "Will anyone else have access to my answers and score?",
    answer: "Your privacy is strictly guarded. Your answers are processed in real-time and remain confidential. When you submit your contact details to save your report, your data is securely encrypted under strict healthcare confidentiality standards and is never shared, marketed, or sold to any third party."
  },
  {
    question: "How long does it take to complete an assessment?",
    answer: "Each assessment is designed to be quick and focused, taking between 2 to 4 minutes. There are between 5 to 10 questions per screener, allowing you to reflect without feeling overwhelmed."
  },
  {
    question: "Are these assessments completely free?",
    answer: "Yes, 100% free. SS Psych Life Care provides these screening tools freely to break mental health stigma, encourage proactive self-awareness, and help you take the first step towards emotional well-being."
  },
  {
    question: "What should I do if my score indicates moderate or severe distress?",
    answer: "A moderate or severe score indicates that you may be carrying significant emotional or psychological strain. We encourage you to reach out to one of our licensed psychologists for a compassionate, non-judgmental 1-on-1 consultation. In urgent or crisis situations, please reach out immediately to telephonic helplines like Tele-MANAS (14416) or KIRAN (1800-599-0019)."
  }
];

export const ASSESSMENTS_LIST = [
  {
    id: "anxiety",
    title: "Comprehensive Anxiety & Mental Health Assessment",
    scaleName: "25-Item Clinical Questionnaire",
    category: "anxiety",
    questionsCount: 25,
    duration: "5-7 mins",
    maxScore: 75,
    badge: "25 Questions",
    badgeColor: "emerald",
    icon: "bi-heart-pulse",
    existingRoute: "/anxiety-test",
    description: "A comprehensive 25-item assessment evaluating mood, energy, cognition, physical tension, and anxiety indicators across 5 core clinical dimensions.",
    whoIsItFor: "Individuals experiencing persistent worry, tension, low mood, sleep changes, or fatigue seeking a thorough evaluation.",
    measures: "Mood & emotions, energy & interest, thinking patterns, physical changes, and anxiety indicators.",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Occasionally / Sometimes", score: 1 },
      { text: "Frequently / Often", score: 2 },
      { text: "Almost always / Constantly", score: 3 }
    ],
    questions: [
      {
            "id": 1,
            "sectionTitle": "Mood & Emotions",
            "text": "How often do you feel low or sad?",
            "options": [
                  {
                        "text": "Not at all",
                        "score": 0
                  },
                  {
                        "text": "Occasionally",
                        "score": 1
                  },
                  {
                        "text": "Frequently",
                        "score": 2
                  },
                  {
                        "text": "Almost always",
                        "score": 3
                  }
            ]
      },
      {
            "id": 2,
            "sectionTitle": "Mood & Emotions",
            "text": "How often do you feel hopeless about the future?",
            "options": [
                  {
                        "text": "Not at all",
                        "score": 0
                  },
                  {
                        "text": "Sometimes",
                        "score": 1
                  },
                  {
                        "text": "Often",
                        "score": 2
                  },
                  {
                        "text": "Constantly",
                        "score": 3
                  }
            ]
      },
      {
            "id": 3,
            "sectionTitle": "Mood & Emotions",
            "text": "How often do you feel emotionally empty or numb?",
            "options": [
                  {
                        "text": "Not at all",
                        "score": 0
                  },
                  {
                        "text": "Rarely",
                        "score": 1
                  },
                  {
                        "text": "Often",
                        "score": 2
                  },
                  {
                        "text": "Nearly all the time",
                        "score": 3
                  }
            ]
      },
      {
            "id": 4,
            "sectionTitle": "Mood & Emotions",
            "text": "How often do you feel guilty without a clear reason?",
            "options": [
                  {
                        "text": "Not at all",
                        "score": 0
                  },
                  {
                        "text": "Occasionally",
                        "score": 1
                  },
                  {
                        "text": "Frequently",
                        "score": 2
                  },
                  {
                        "text": "Almost always",
                        "score": 3
                  }
            ]
      },
      {
            "id": 5,
            "sectionTitle": "Mood & Emotions",
            "text": "How often do you feel like you are not good enough?",
            "options": [
                  {
                        "text": "Not at all",
                        "score": 0
                  },
                  {
                        "text": "Sometimes",
                        "score": 1
                  },
                  {
                        "text": "Often",
                        "score": 2
                  },
                  {
                        "text": "Always",
                        "score": 3
                  }
            ]
      },
      {
            "id": 6,
            "sectionTitle": "Energy & Interest",
            "text": "How often do you feel tired even after rest?",
            "options": [
                  {
                        "text": "Not at all",
                        "score": 0
                  },
                  {
                        "text": "Sometimes",
                        "score": 1
                  },
                  {
                        "text": "Often",
                        "score": 2
                  },
                  {
                        "text": "Always",
                        "score": 3
                  }
            ]
      },
      {
            "id": 7,
            "sectionTitle": "Energy & Interest",
            "text": "How often do you lose interest in activities you once enjoyed?",
            "options": [
                  {
                        "text": "Not at all",
                        "score": 0
                  },
                  {
                        "text": "Slightly less interested",
                        "score": 1
                  },
                  {
                        "text": "Much less interested",
                        "score": 2
                  },
                  {
                        "text": "No interest at all",
                        "score": 3
                  }
            ]
      },
      {
            "id": 8,
            "sectionTitle": "Energy & Interest",
            "text": "How often do you struggle to start tasks?",
            "options": [
                  {
                        "text": "Not at all",
                        "score": 0
                  },
                  {
                        "text": "Occasionally",
                        "score": 1
                  },
                  {
                        "text": "Often",
                        "score": 2
                  },
                  {
                        "text": "Almost always",
                        "score": 3
                  }
            ]
      },
      {
            "id": 9,
            "sectionTitle": "Energy & Interest",
            "text": "How often do you avoid social interactions?",
            "options": [
                  {
                        "text": "Not at all",
                        "score": 0
                  },
                  {
                        "text": "Occasionally",
                        "score": 1
                  },
                  {
                        "text": "Frequently",
                        "score": 2
                  },
                  {
                        "text": "Always",
                        "score": 3
                  }
            ]
      },
      {
            "id": 10,
            "sectionTitle": "Energy & Interest",
            "text": "How often do you feel unmotivated?",
            "options": [
                  {
                        "text": "Not at all",
                        "score": 0
                  },
                  {
                        "text": "Sometimes",
                        "score": 1
                  },
                  {
                        "text": "Often",
                        "score": 2
                  },
                  {
                        "text": "Constantly",
                        "score": 3
                  }
            ]
      },
      {
            "id": 11,
            "sectionTitle": "Thinking & Self-Perception",
            "text": "How often do you have difficulty concentrating?",
            "options": [
                  {
                        "text": "Not at all",
                        "score": 0
                  },
                  {
                        "text": "Occasionally",
                        "score": 1
                  },
                  {
                        "text": "Often",
                        "score": 2
                  },
                  {
                        "text": "Almost always",
                        "score": 3
                  }
            ]
      },
      {
            "id": 12,
            "sectionTitle": "Thinking & Self-Perception",
            "text": "How often do you feel indecisive?",
            "options": [
                  {
                        "text": "Not at all",
                        "score": 0
                  },
                  {
                        "text": "Sometimes",
                        "score": 1
                  },
                  {
                        "text": "Often",
                        "score": 2
                  },
                  {
                        "text": "Always",
                        "score": 3
                  }
            ]
      },
      {
            "id": 13,
            "sectionTitle": "Thinking & Self-Perception",
            "text": "How often do you overthink negative situations?",
            "options": [
                  {
                        "text": "Not at all",
                        "score": 0
                  },
                  {
                        "text": "Sometimes",
                        "score": 1
                  },
                  {
                        "text": "Often",
                        "score": 2
                  },
                  {
                        "text": "Constantly",
                        "score": 3
                  }
            ]
      },
      {
            "id": 14,
            "sectionTitle": "Thinking & Self-Perception",
            "text": "How often do you criticize yourself?",
            "options": [
                  {
                        "text": "Not at all",
                        "score": 0
                  },
                  {
                        "text": "Occasionally",
                        "score": 1
                  },
                  {
                        "text": "Frequently",
                        "score": 2
                  },
                  {
                        "text": "Always",
                        "score": 3
                  }
            ]
      },
      {
            "id": 15,
            "sectionTitle": "Thinking & Self-Perception",
            "text": "How often do you feel like a failure?",
            "options": [
                  {
                        "text": "Not at all",
                        "score": 0
                  },
                  {
                        "text": "Sometimes",
                        "score": 1
                  },
                  {
                        "text": "Often",
                        "score": 2
                  },
                  {
                        "text": "Constantly",
                        "score": 3
                  }
            ]
      },
      {
            "id": 16,
            "sectionTitle": "Physical & Behavioral Changes",
            "text": "How has your sleep changed?",
            "options": [
                  {
                        "text": "No change",
                        "score": 0
                  },
                  {
                        "text": "Slight change",
                        "score": 1
                  },
                  {
                        "text": "Significant change",
                        "score": 2
                  },
                  {
                        "text": "Extreme change",
                        "score": 3
                  }
            ]
      },
      {
            "id": 17,
            "sectionTitle": "Physical & Behavioral Changes",
            "text": "How has your appetite changed?",
            "options": [
                  {
                        "text": "No change",
                        "score": 0
                  },
                  {
                        "text": "Slight increase/decrease",
                        "score": 1
                  },
                  {
                        "text": "Noticeable change",
                        "score": 2
                  },
                  {
                        "text": "Extreme change",
                        "score": 3
                  }
            ]
      },
      {
            "id": 18,
            "sectionTitle": "Physical & Behavioral Changes",
            "text": "How often do you feel restless or slowed down?",
            "options": [
                  {
                        "text": "Not at all",
                        "score": 0
                  },
                  {
                        "text": "Occasionally",
                        "score": 1
                  },
                  {
                        "text": "Often",
                        "score": 2
                  },
                  {
                        "text": "Almost always",
                        "score": 3
                  }
            ]
      },
      {
            "id": 19,
            "sectionTitle": "Physical & Behavioral Changes",
            "text": "How often do you feel physically exhausted?",
            "options": [
                  {
                        "text": "Not at all",
                        "score": 0
                  },
                  {
                        "text": "Sometimes",
                        "score": 1
                  },
                  {
                        "text": "Often",
                        "score": 2
                  },
                  {
                        "text": "Constantly",
                        "score": 3
                  }
            ]
      },
      {
            "id": 20,
            "sectionTitle": "Physical & Behavioral Changes",
            "text": "How often do you avoid responsibilities?",
            "options": [
                  {
                        "text": "Not at all",
                        "score": 0
                  },
                  {
                        "text": "Occasionally",
                        "score": 1
                  },
                  {
                        "text": "Often",
                        "score": 2
                  },
                  {
                        "text": "Always",
                        "score": 3
                  }
            ]
      },
      {
            "id": 21,
            "sectionTitle": "Serious Emotional Indicators",
            "text": "How often do you feel life lacks meaning?",
            "options": [
                  {
                        "text": "Not at all",
                        "score": 0
                  },
                  {
                        "text": "Occasionally",
                        "score": 1
                  },
                  {
                        "text": "Often",
                        "score": 2
                  },
                  {
                        "text": "Constantly",
                        "score": 3
                  }
            ]
      },
      {
            "id": 22,
            "sectionTitle": "Serious Emotional Indicators",
            "text": "How often do you feel disconnected from others?",
            "options": [
                  {
                        "text": "Not at all",
                        "score": 0
                  },
                  {
                        "text": "Sometimes",
                        "score": 1
                  },
                  {
                        "text": "Often",
                        "score": 2
                  },
                  {
                        "text": "Always",
                        "score": 3
                  }
            ]
      },
      {
            "id": 23,
            "sectionTitle": "Serious Emotional Indicators",
            "text": "How often do you feel overwhelmed by daily life?",
            "options": [
                  {
                        "text": "Not at all",
                        "score": 0
                  },
                  {
                        "text": "Occasionally",
                        "score": 1
                  },
                  {
                        "text": "Often",
                        "score": 2
                  },
                  {
                        "text": "Almost always",
                        "score": 3
                  }
            ]
      },
      {
            "id": 24,
            "sectionTitle": "Serious Emotional Indicators",
            "text": "How often do you feel like giving up?",
            "options": [
                  {
                        "text": "Not at all",
                        "score": 0
                  },
                  {
                        "text": "Sometimes",
                        "score": 1
                  },
                  {
                        "text": "Often",
                        "score": 2
                  },
                  {
                        "text": "Very frequently",
                        "score": 3
                  }
            ]
      },
      {
            "id": 25,
            "sectionTitle": "Serious Emotional Indicators",
            "text": "How often do you feel you need professional help?",
            "options": [
                  {
                        "text": "Not at all",
                        "score": 0
                  },
                  {
                        "text": "Occasionally",
                        "score": 1
                  },
                  {
                        "text": "Often",
                        "score": 2
                  },
                  {
                        "text": "Definitely",
                        "score": 3
                  }
            ]
      }
],
    bands: [
      {
        min: 0,
        max: 18,
        label: "Low Indications of Concern",
        level: "minimal",
        badgeClass: "badge-minimal",
        description: "You seem to be managing well. Everyone experiences ups and downs, but your current responses do not indicate severe psychological distress. Continue practicing good self-care and maintaining healthy routines.",
        recommendation: "Continue regular lifestyle practices, adequate sleep hygiene, physical movement, and mindfulness to maintain emotional balance."
      },
      {
        min: 19,
        max: 37,
        label: "Mild to Moderate Indications",
        level: "mild",
        badgeClass: "badge-mild",
        description: "You might be experiencing some elevated stress, anxiety, or low mood. It's completely normal to feel this way sometimes, but addressing it early can be very helpful.",
        recommendation: "Grounding techniques, journaling, and proactive stress-reduction can help prevent symptoms from escalating."
      },
      {
        min: 38,
        max: 56,
        label: "High Indications of Distress",
        level: "moderate",
        badgeClass: "badge-moderate",
        description: "Your responses suggest you are experiencing significant emotional or psychological challenges right now across mood, energy, or anxiety.",
        recommendation: "Structured psychological support, such as Cognitive Behavioral Therapy (CBT), is strongly recommended to unpack worry loops and restore calm."
      },
      {
        min: 57,
        max: 75,
        label: "Severe Indications of Distress",
        level: "severe",
        badgeClass: "badge-severe",
        description: "Your results indicate severe distress. You do not have to go through this alone. We strongly recommend reaching out to a mental health professional for guidance.",
        recommendation: "Please schedule an urgent consultation with our licensed clinical psychologists for a comprehensive evaluation and compassionate intervention."
      }
    ]
  },
  {
    id: "gad-7",
    title: "GAD-7 Quick Anxiety Screener",
    scaleName: "GAD-7 Clinical Scale",
    category: "anxiety",
    questionsCount: 7,
    duration: "2 mins",
    maxScore: 21,
    badge: "Quick 2-Min Screener",
    badgeColor: "teal",
    icon: "bi-activity",
    existingRoute: null,
    description: "A validated 7-item rapid clinical tool to gauge general anxiety, constant worrying, nervousness, and somatic tension over the past 2 weeks.",
    whoIsItFor: "Individuals wanting a quick 2-minute clinical check on general anxiety symptoms.",
    measures: "Generalised anxiety severity, worry loops, tension, and autonomic arousal.",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ],
    questions: [
      { id: 1, text: "Feeling nervous, anxious, or on edge" },
      { id: 2, text: "Not being able to stop or control worrying" },
      { id: 3, text: "Worrying too much about different things" },
      { id: 4, text: "Trouble relaxing" },
      { id: 5, text: "Being so restless that it is hard to sit still" },
      { id: 6, text: "Becoming easily annoyed or irritable" },
      { id: 7, text: "Feeling afraid, as if something awful might happen" }
    ],
    bands: [
      {
        min: 0,
        max: 4,
        label: "Minimal Anxiety",
        level: "minimal",
        badgeClass: "badge-minimal",
        description: "Your responses suggest minimal or baseline everyday anxiety symptoms. Your nervous system is generally in a regulated state.",
        recommendation: "Continue regular lifestyle practices, adequate sleep hygiene, and mindfulness to maintain emotional balance."
      },
      {
        min: 5,
        max: 9,
        label: "Mild Anxiety",
        level: "mild",
        badgeClass: "badge-mild",
        description: "Your score indicates mild anxiety symptoms. You may occasionally feel overwhelmed, restless, or fatigued by daily stressors.",
        recommendation: "Grounding techniques, journaling, and proactive stress-reduction can help prevent symptoms from escalating."
      },
      {
        min: 10,
        max: 14,
        label: "Moderate Anxiety",
        level: "moderate",
        badgeClass: "badge-moderate",
        description: "Your responses reflect moderate anxiety symptoms that likely interfere with daily concentration, productivity, or sleep.",
        recommendation: "Structured psychological support, such as Cognitive Behavioral Therapy (CBT), is recommended to unpack worry loops."
      },
      {
        min: 15,
        max: 21,
        label: "Severe Anxiety",
        level: "severe",
        badgeClass: "badge-severe",
        description: "Your score falls in the severe anxiety range. You may be dealing with intense emotional distress, panic sensations, or physical exhaustion.",
        recommendation: "We strongly recommend consulting with a licensed clinical psychologist for a comprehensive evaluation."
      }
    ]
  },
  {
    id: "depression",
    title: "Depression & Mood Screener",
    scaleName: "PHQ-9 Clinical Scale",
    category: "depression",
    questionsCount: 9,
    duration: "3 mins",
    maxScore: 27,
    badge: "Clinically Validated",
    badgeColor: "blue",
    icon: "bi-cloud-rain",
    existingRoute: null,
    description: "Assesses depressive symptoms, emotional exhaustion, loss of interest, and energy fluctuations experienced during the last fortnight.",
    whoIsItFor: "Anyone experiencing persistent sadness, low motivation, sleep disturbances, helplessness, or emotional numbness.",
    measures: "Depressive symptom severity, anhedonia, cognitive fatigue, and mood regulation.",
    options: [
      { text: "Not at all", score: 0 },
      { text: "Several days", score: 1 },
      { text: "More than half the days", score: 2 },
      { text: "Nearly every day", score: 3 }
    ],
    questions: [
      { id: 1, text: "Little interest or pleasure in doing things" },
      { id: 2, text: "Feeling down, depressed, or hopeless" },
      { id: 3, text: "Trouble falling or staying asleep, or sleeping too much" },
      { id: 4, text: "Feeling tired or having little energy" },
      { id: 5, text: "Poor appetite or overeating" },
      { id: 6, text: "Feeling bad about yourself — or that you are a failure or let yourself/family down" },
      { id: 7, text: "Trouble concentrating on things, such as reading or watching television" },
      { id: 8, text: "Moving or speaking slowly, or being fidgety and restless" },
      { id: 9, text: "Thoughts that you would be better off dead, or of hurting yourself in some way" }
    ],
    bands: [
      {
        min: 0,
        max: 4,
        label: "Minimal Depression",
        level: "minimal",
        badgeClass: "badge-minimal",
        description: "Your responses indicate minimal or no depressive symptoms.",
        recommendation: "Maintain your current social connections, physical movement, and self-care routines."
      },
      {
        min: 5,
        max: 9,
        label: "Mild Depression",
        level: "mild",
        badgeClass: "badge-mild",
        description: "Your score reflects mild depressive symptoms, such as occasional lack of motivation, fatigue, or low mood.",
        recommendation: "Setting gentle daily routines and engaging in behavioral activation can help restore vitality."
      },
      {
        min: 10,
        max: 14,
        label: "Moderate Depression",
        level: "moderate",
        badgeClass: "badge-moderate",
        description: "Your responses suggest moderate depression, which may be significantly impacting personal life, work, or relationships.",
        recommendation: "A formal clinical consultation with a therapist is advisable to explore cognitive reframing and emotional support."
      },
      {
        min: 15,
        max: 19,
        label: "Moderately Severe Depression",
        level: "severe",
        badgeClass: "badge-severe",
        description: "Your score suggests prominent depressive distress with substantial impairment across major life areas.",
        recommendation: "Professional psychological treatment is strongly recommended to support your recovery."
      },
      {
        min: 20,
        max: 27,
        label: "Severe Depression",
        level: "severe",
        badgeClass: "badge-severe",
        description: "Your responses reflect severe depressive symptoms requiring immediate, compassionate clinical care.",
        recommendation: "Please schedule an urgent consultation with our licensed psychologists or contact an immediate mental health helpline."
      }
    ]
  },
  {
    id: "stress",
    title: "Perceived Stress & Burnout Screener",
    scaleName: "PSS-10 Stress Scale",
    category: "stress",
    questionsCount: 10,
    duration: "3-4 mins",
    maxScore: 40,
    badge: "Workplace & Life Stress",
    badgeColor: "amber",
    icon: "bi-fire",
    existingRoute: null,
    description: "Evaluates how unpredictable, uncontrollable, and overloaded you have found your life and work demands in the past month.",
    whoIsItFor: "Professionals, students, caregivers, or anyone feeling stretched thin, fatigued, or overwhelmed.",
    measures: "Perceived coping capacity, stress overload, emotional resilience, and burnout risk.",
    options: [
      { text: "Never", score: 0 },
      { text: "Almost Never", score: 1 },
      { text: "Sometimes", score: 2 },
      { text: "Fairly Often", score: 3 },
      { text: "Very Often", score: 4 }
    ],
    questions: [
      { id: 1, text: "In the last month, how often have you been upset because of something that happened unexpectedly?" },
      { id: 2, text: "In the last month, how often have you felt that you were unable to control the important things in your life?" },
      { id: 3, text: "In the last month, how often have you felt nervous and stressed?" },
      { id: 4, text: "In the last month, how often have you felt confident about your ability to handle your personal problems?", reverse: true },
      { id: 5, text: "In the last month, how often have you felt that things were going your way?", reverse: true },
      { id: 6, text: "In the last month, how often have you found that you could not cope with all the things that you had to do?" },
      { id: 7, text: "In the last month, how often have you been able to control irritations in your life?", reverse: true },
      { id: 8, text: "In the last month, how often have you felt that you were on top of things?", reverse: true },
      { id: 9, text: "In the last month, how often have you been angered because of things that happened that were outside of your control?" },
      { id: 10, text: "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?" }
    ],
    bands: [
      {
        min: 0,
        max: 13,
        label: "Low Perceived Stress",
        level: "minimal",
        badgeClass: "badge-minimal",
        description: "Your responses indicate healthy stress coping mechanisms and adequate balance in daily life.",
        recommendation: "Maintain your positive habits, regular physical activity, and boundaries."
      },
      {
        min: 14,
        max: 26,
        label: "Moderate Stress",
        level: "moderate",
        badgeClass: "badge-moderate",
        description: "You are experiencing noticeable levels of tension that could lead to burnout if left unchecked.",
        recommendation: "Introduce regular micro-breaks, sleep consistency, and boundary-setting at work and home."
      },
      {
        min: 27,
        max: 40,
        label: "High Chronic Stress & Burnout Risk",
        level: "severe",
        badgeClass: "badge-severe",
        description: "Your score reflects severe stress overload, feeling out of control, and vulnerability to physical or mental exhaustion.",
        recommendation: "Professional counselling to build nervous system regulation and stress reduction strategies is highly advised."
      }
    ]
  },
  {
    id: "adhd",
    title: "Adult ADHD & Focus Screener",
    scaleName: "ASRS v1.1 Adult Screener",
    category: "adhd",
    questionsCount: 6,
    duration: "2 mins",
    maxScore: 24,
    badge: "Focus & Executive Function",
    badgeColor: "purple",
    icon: "bi-lightning-charge",
    existingRoute: null,
    description: "Assesses common symptoms of adult inattention, hyperactivity, impulsivity, procrastination, and executive functioning difficulties.",
    whoIsItFor: "Adults struggling with organization, time management, sustained attention, distractibility, or chronic restlessness.",
    measures: "Executive function, attention regulation, impulsivity, and cognitive pacing.",
    options: [
      { text: "Never", score: 0 },
      { text: "Rarely", score: 1 },
      { text: "Sometimes", score: 2 },
      { text: "Often", score: 3 },
      { text: "Very Often", score: 4 }
    ],
    questions: [
      { id: 1, text: "How often do you have trouble wrapping up the final details of a project once the challenging parts have been done?" },
      { id: 2, text: "How often do you have difficulty getting things in order when you have to do a task that requires organization?" },
      { id: 3, text: "How often do you have problems remembering appointments or obligations?" },
      { id: 4, text: "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?" },
      { id: 5, text: "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?" },
      { id: 6, text: "How often do you feel overly active and compelled to do things, like you were driven by a motor?" }
    ],
    bands: [
      {
        min: 0,
        max: 9,
        label: "Unlikely ADHD Characteristics",
        level: "minimal",
        badgeClass: "badge-minimal",
        description: "Your responses suggest typical organizational and attentional capacity without significant ADHD traits.",
        recommendation: "Continue using healthy planners and focus routines to optimize productivity."
      },
      {
        min: 10,
        max: 15,
        label: "Mild Executive Function Challenges",
        level: "mild",
        badgeClass: "badge-mild",
        description: "Some indications of distractibility, procrastination, or restlessness, likely aggravated by fatigue or overload.",
        recommendation: "Explore structured time-blocking tools, Pomodoro technique, and environmental decluttering."
      },
      {
        min: 16,
        max: 24,
        label: "Significant ADHD Symptom Profile",
        level: "severe",
        badgeClass: "badge-severe",
        description: "Your pattern matches clinical criteria consistent with adult Attention Deficit Hyperactivity Disorder (ADHD).",
        recommendation: "A clinical neurodevelopmental diagnostic evaluation by an ADHD-specialized psychologist is highly advised."
      }
    ]
  },
  {
    id: "ocd",
    title: "OCD & Intrusive Thoughts Screener",
    scaleName: "Y-BOCS Symptom Screener",
    category: "ocd",
    questionsCount: 10,
    duration: "3-4 mins",
    maxScore: 30,
    badge: "Clinically Validated",
    badgeColor: "emerald",
    icon: "bi-arrow-repeat",
    existingRoute: null,
    description: "Evaluates persistent intrusive thoughts, fears of contamination or harm, checking impulses, and mental or physical rituals.",
    whoIsItFor: "Individuals troubled by recurring unwanted thoughts, repetitive checking, ordering, washing, or mental neutralizing loops.",
    measures: "Obsessional frequency, distress severity, compulsive behaviors, and resistance capacity.",
    options: [
      { text: "None / Not at all", score: 0 },
      { text: "Mild / Occasional", score: 1 },
      { text: "Moderate / Frequent", score: 2 },
      { text: "Severe / Constant", score: 3 }
    ],
    questions: [
      { id: 1, text: "How much time is spent on intrusive, unwanted, or repetitive thoughts each day?" },
      { id: 2, text: "How much do these intrusive thoughts interfere with your work, study, or social functioning?" },
      { id: 3, text: "How much emotional distress or anxiety do your intrusive thoughts cause you?" },
      { id: 4, text: "How much effort do you make to resist, push away, or dismiss these thoughts?" },
      { id: 5, text: "How much control do you feel you have over stopping these thoughts once they begin?" },
      { id: 6, text: "How much time do you spend performing repetitive behaviors (checking, washing, counting, ordering)?" },
      { id: 7, text: "How much do these repetitive behaviors interfere with your daily routine or responsibilities?" },
      { id: 8, text: "How anxious would you feel if you were prevented from performing these rituals?" },
      { id: 9, text: "How strongly do you feel driven to repeat actions until they feel 'just right'?" },
      { id: 10, text: "How much control do you have over stopping or delaying compulsive urges?" }
    ],
    bands: [
      {
        min: 0,
        max: 7,
        label: "Subclinical / Minimal OCD Symptoms",
        level: "minimal",
        badgeClass: "badge-minimal",
        description: "Normal variation of occasional checking or cautious habits without clinical obsession-compulsion patterns.",
        recommendation: "Practice mindfulness and stress management to maintain mental calm."
      },
      {
        min: 8,
        max: 15,
        label: "Mild OCD Characteristics",
        level: "mild",
        badgeClass: "badge-mild",
        description: "Mild intrusive thoughts or repetitive actions that cause moderate personal friction but remain manageable.",
        recommendation: "Early psychological consultation can prevent repetitive checking rituals from hardening into habits."
      },
      {
        min: 16,
        max: 22,
        label: "Moderate OCD Distress",
        level: "moderate",
        badgeClass: "badge-moderate",
        description: "Intrusive thought cycles and rituals are consuming substantial daily energy, causing notable anxiety and delays.",
        recommendation: "Exposure and Response Prevention (ERP) therapy with a trained clinical psychologist is strongly indicated."
      },
      {
        min: 23,
        max: 30,
        label: "Severe OCD Impairment",
        level: "severe",
        badgeClass: "badge-severe",
        description: "Significant functional disruption with overwhelming distress and difficulty resisting compulsive rituals.",
        recommendation: "Urgent comprehensive psychiatric and clinical psychological care is recommended."
      }
    ]
  },
  {
    id: "relationship",
    title: "Couples & Relationship Satisfaction Screener",
    scaleName: "Relationship Satisfaction Scale",
    category: "relationship",
    questionsCount: 7,
    duration: "2-3 mins",
    maxScore: 28,
    badge: "Couples & Partners",
    badgeColor: "rose",
    icon: "bi-people",
    existingRoute: null,
    description: "Evaluates emotional closeness, trust, communication health, conflict resolution, and mutual support in romantic partnerships.",
    whoIsItFor: "Individuals or couples seeking objective insight into their relationship harmony, friction points, or growth areas.",
    measures: "Emotional intimacy, perceived equality, constructive communication, and commitment.",
    options: [
      { text: "Rarely / Disagree Strongly", score: 0 },
      { text: "Occasionally / Disagree Somewhat", score: 1 },
      { text: "Neutral / Unsure", score: 2 },
      { text: "Often / Agree Somewhat", score: 3 },
      { text: "Always / Agree Strongly", score: 4 }
    ],
    questions: [
      { id: 1, text: "My partner and I understand each other's feelings and emotional needs well." },
      { id: 2, text: "We are able to discuss disagreements calmly and resolve them constructively without lingering resentment." },
      { id: 3, text: "I feel emotionally safe, valued, and respected in this relationship." },
      { id: 4, text: "We share quality time together and enjoy each other's companionship." },
      { id: 5, text: "I trust my partner completely and feel confident in our mutual commitment." },
      { id: 6, text: "We share responsibilities and decisions equitably without feeling taken for granted." },
      { id: 7, text: "Overall, I feel fulfilled and satisfied with our relationship's trajectory." }
    ],
    bands: [
      {
        min: 0,
        max: 11,
        label: "High Relationship Strain",
        level: "severe",
        badgeClass: "badge-severe",
        description: "Your responses indicate deep emotional distance, frequent unresolved conflict, or feeling unheard in the partnership.",
        recommendation: "Couples counselling or relationship therapy can provide a safe, neutral space to rebuild trust and communication."
      },
      {
        min: 12,
        max: 19,
        label: "Moderate Relationship Friction",
        level: "moderate",
        badgeClass: "badge-moderate",
        description: "Notable communication hurdles, unmet needs, or routine stress impacting mutual intimacy.",
        recommendation: "Practicing active listening exercises and scheduling intentional quality time can prevent further drifting."
      },
      {
        min: 20,
        max: 28,
        label: "Healthy & Fulfilling Connection",
        level: "minimal",
        badgeClass: "badge-minimal",
        description: "Strong emotional foundation, mutual respect, and effective partnership dynamics.",
        recommendation: "Continue nurturing emotional openness and expressing sincere appreciation for one another."
      }
    ]
  },
  {
    id: "trauma",
    title: "Trauma & PTSD Impact Screener",
    scaleName: "PCL-5 Primary Screener",
    category: "trauma",
    questionsCount: 5,
    duration: "2 mins",
    maxScore: 15,
    badge: "Trauma-Informed",
    badgeColor: "amber",
    icon: "bi-shield-check",
    existingRoute: null,
    description: "Assesses lingering memories, hypervigilance, emotional numbness, and distress related to difficult or traumatic life events.",
    whoIsItFor: "Anyone who has survived severe physical, emotional, relational, or environmental trauma and feels stuck in emotional flashbacks.",
    measures: "Intrusive trauma recall, autonomic hyperarousal, avoidance behaviors, and emotional blunting.",
    options: [
      { text: "Not at all", score: 0 },
      { text: "A little bit", score: 1 },
      { text: "Moderately", score: 2 },
      { text: "Quite a bit / Severely", score: 3 }
    ],
    questions: [
      { id: 1, text: "Having repeated, disturbing memories, thoughts, or images of a stressful past experience" },
      { id: 2, text: "Having bad dreams or nightmares related to the stressful experience" },
      { id: 3, text: "Avoiding situations, places, or conversations that remind you of the experience" },
      { id: 4, text: "Feeling constantly on guard, watchful, easily startled, or physically tense" },
      { id: 5, text: "Feeling detached, cut off from people, or emotionally numb" }
    ],
    bands: [
      {
        min: 0,
        max: 3,
        label: "Minimal Trauma Symptomatology",
        level: "minimal",
        badgeClass: "badge-minimal",
        description: "Responses indicate healthy natural processing of past stressors without pervasive post-traumatic disruption.",
        recommendation: "Maintain grounded routines and strong support networks."
      },
      {
        min: 4,
        max: 8,
        label: "Mild-to-Moderate Traumatic Stress",
        level: "moderate",
        badgeClass: "badge-moderate",
        description: "Noticeable trauma triggers, heightened sensitivity, or avoidance patterns that affect daily peace of mind.",
        recommendation: "Trauma-informed counselling (such as EMDR or somatic stabilization) can provide rapid grounding."
      },
      {
        min: 9,
        max: 15,
        label: "High Post-Traumatic Impact",
        level: "severe",
        badgeClass: "badge-severe",
        description: "Significant post-traumatic intrusion, hyperarousal, and emotional exhaustion indicating active PTSD indicators.",
        recommendation: "Consultation with a certified trauma psychologist is strongly recommended to assist compassionate reprocessing."
      }
    ]
  },
  {
    id: "teen",
    title: "Teen Mental Well-Being Screener",
    scaleName: "Adolescent Emotional Well-Being Scale",
    category: "teen",
    questionsCount: 10,
    duration: "3 mins",
    maxScore: 20,
    badge: "Youth & Teen Focus",
    badgeColor: "teal",
    icon: "bi-mortarboard",
    existingRoute: null,
    description: "Designed specifically for adolescents (13-19) and caring parents to evaluate academic stress, emotional regulation, peer pressure, and self-worth.",
    whoIsItFor: "Teenagers and parents seeking a clear, non-judgmental understanding of adolescent emotional health.",
    measures: "Adolescent academic stress, social pressure, emotional swings, and developmental resilience.",
    options: [
      { text: "Not True / Rarely", score: 0 },
      { text: "Somewhat True / Sometimes", score: 1 },
      { text: "Certainly True / Often", score: 2 }
    ],
    questions: [
      { id: 1, text: "I often worry about school performance, grades, expectations, or the future." },
      { id: 2, text: "I feel overwhelmed by social media comparison or peer pressure." },
      { id: 3, text: "I get angry, irritable, or tearful quickly without knowing why." },
      { id: 4, text: "I find it hard to talk openly about my feelings with parents or family." },
      { id: 5, text: "I frequently feel exhausted, even after sleeping for many hours." },
      { id: 6, text: "I have lost interest in creative hobbies, sports, or hanging out with friends." },
      { id: 7, text: "I feel like nobody really understands what I am going through inside." },
      { id: 8, text: "I put intense pressure on myself to be perfect or feel like a failure." },
      { id: 9, text: "I often feel insecure or self-critical about my appearance or worth." },
      { id: 10, text: "I struggle to feel hopeful and positive about what lies ahead." }
    ],
    bands: [
      {
        min: 0,
        max: 6,
        label: "Balanced Adolescent Well-Being",
        level: "minimal",
        badgeClass: "badge-minimal",
        description: "Your responses reflect healthy resilience and manageable adolescent developmental transitions.",
        recommendation: "Continue building open communication with trusted mentors, friends, and family."
      },
      {
        min: 7,
        max: 12,
        label: "Mild Emotional Distress",
        level: "mild",
        badgeClass: "badge-mild",
        description: "Noticeable emotional friction, academic stress, or peer pressure is creating frequent tension.",
        recommendation: "Developing healthy stress-management habits and creative outlets can help ease tension."
      },
      {
        min: 13,
        max: 20,
        label: "Heightened Distress & Burnout",
        level: "severe",
        badgeClass: "badge-severe",
        description: "Significant emotional burden, isolation, or overwhelm requiring compassionate guidance.",
        recommendation: "Confidential adolescent counseling with a supportive child/teen psychologist is strongly recommended."
      }
    ]
  },
  {
    id: "wellness-game",
    title: "Mind & Mood Wellness Interactive Game",
    scaleName: "Cognitive Self-Care Exercises",
    category: "wellness",
    questionsCount: 1,
    duration: "3-5 mins",
    maxScore: 100,
    badge: "Interactive Activity",
    badgeColor: "emerald",
    icon: "bi-controller",
    existingRoute: "/game",
    description: "Engage in relaxing, interactive cognitive wellness exercises designed to soothe nervous system tension, sharpen focus, and uplift mood.",
    whoIsItFor: "Anyone looking for a playful, interactive reset during a stressful day.",
    measures: "Cognitive engagement, somatic grounding, and mindful relaxation.",
    options: [],
    questions: [],
    bands: []
  }
];
