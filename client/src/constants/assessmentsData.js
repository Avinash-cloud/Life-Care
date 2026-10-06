// Comprehensive Mental Health Assessments Data Hub
// Based on standardized clinical questionnaires and validated PDFs

export const ASSESSMENT_CATEGORIES = [
  { id: 'all', label: 'All Assessments', icon: 'bi-grid-fill' },
  { id: 'anxiety', label: 'Anxiety & Panic', icon: 'bi-heart-pulse' },
  { id: 'depression', label: 'Mood & Bipolar', icon: 'bi-cloud-rain' },
  { id: 'stress', label: 'Stress & Burnout', icon: 'bi-fire' },
  { id: 'adhd', label: 'ADHD & Focus', icon: 'bi-lightning-charge' },
  { id: 'ocd', label: 'OCD & Obsessions', icon: 'bi-arrow-repeat' },
  { id: 'relationship', label: 'Relationships', icon: 'bi-people' },
  { id: 'teen', label: 'Teen & Youth', icon: 'bi-mortarboard' },
  { id: 'psychosis', label: 'Psychiatric & Psychosis', icon: 'bi-shield-check' },
  { id: 'trauma', label: 'Trauma & PTSD', icon: 'bi-bandaid' },
  { id: 'wellness', label: 'Interactive Games', icon: 'bi-controller' }
];

export const FREQUENTLY_ASKED_QUESTIONS = [
  {
    question: "Are these self-assessments equivalent to a clinical medical diagnosis?",
    answer: "No. These screeners are standardized, evidence-based psychological measurement tools (such as OCI-R, ASRS v1.1, ISMA Stress, MDQ, BPRS, and DSM-5 scales) widely used by mental health clinicians to track severity indicators. However, they do not replace a formal clinical psychiatric or psychological diagnosis. For a formal evaluation and treatment plan, we recommend scheduling an appointment with our registered psychologists."
  },
  {
    question: "Will anyone else have access to my answers and score?",
    answer: "Your privacy is strictly guarded. Your answers are processed in real-time and remain confidential. When you submit your contact details to save your report, your data is securely encrypted under strict healthcare confidentiality standards and is never shared, marketed, or sold to any third party."
  },
  {
    question: "How long does it take to complete an assessment?",
    answer: "Each assessment is designed to be quick and focused, taking between 2 to 7 minutes. Most tools contain between 7 to 25 structured questions, allowing you to reflect without feeling overwhelmed."
  },
  {
    question: "Are these assessments completely free?",
    answer: "Yes, 100% free. SS Psych Life Care provides these screening tools freely to break mental health stigma, encourage proactive self-awareness, and help you take the first step towards emotional well-being."
  },
  {
    question: "What should I do if my score indicates moderate or severe distress?",
    answer: "A moderate or severe score indicates that you may be carrying significant emotional or psychological strain. We encourage you to reach out to one of our licensed psychologists for a compassionate, non-judgmental 1-on-1 consultation. In urgent or crisis situations, please reach out immediately to our clinic helplines at 9716129129 / 9899555507."
  }
];

export const ASSESSMENTS_LIST = [
  {
    "id": "anxiety",
    "title": "Comprehensive Anxiety & Mental Health Assessment",
    "scaleName": "25-Item Clinical Questionnaire",
    "category": "anxiety",
    "questionsCount": 25,
    "duration": "5-7 mins",
    "maxScore": 75,
    "badge": "25 Questions",
    "badgeColor": "emerald",
    "icon": "bi-heart-pulse",
    "existingRoute": "/anxiety-test",
    "description": "A comprehensive 25-item assessment evaluating mood, energy, cognition, physical tension, and anxiety indicators across 5 core clinical dimensions.",
    "whoIsItFor": "Individuals experiencing persistent worry, tension, low mood, sleep changes, or fatigue seeking a thorough evaluation.",
    "measures": "Mood & emotions, energy & interest, thinking patterns, physical changes, and anxiety indicators.",
    "options": [
      {
        "text": "Not at all",
        "score": 0
      },
      {
        "text": "Occasionally / Sometimes",
        "score": 1
      },
      {
        "text": "Frequently / Often",
        "score": 2
      },
      {
        "text": "Almost always / Constantly",
        "score": 3
      }
    ],
    "questions": [
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
    "bands": [
      {
        "min": 0,
        "max": 18,
        "label": "Low Indications of Concern",
        "level": "minimal",
        "badgeClass": "badge-minimal",
        "description": "You seem to be managing well. Everyone experiences ups and downs, but your current responses do not indicate severe psychological distress.",
        "recommendation": "Maintain your positive lifestyle habits, adequate sleep hygiene, physical movement, and mindfulness to preserve emotional balance."
      },
      {
        "min": 19,
        "max": 37,
        "label": "Mild to Moderate Indications",
        "level": "mild",
        "badgeClass": "badge-mild",
        "description": "You might be experiencing some elevated stress, anxiety, or low mood. It is completely normal to feel this way sometimes, but addressing it early can be very helpful.",
        "recommendation": "Grounding techniques, journaling, and proactive stress-reduction can help prevent symptoms from escalating."
      },
      {
        "min": 38,
        "max": 56,
        "label": "High Indications of Distress",
        "level": "moderate",
        "badgeClass": "badge-moderate",
        "description": "Your responses suggest you are experiencing significant emotional or psychological challenges right now across mood, energy, or anxiety.",
        "recommendation": "Structured psychological support, such as Cognitive Behavioral Therapy (CBT), is strongly recommended to unpack worry loops and restore calm."
      },
      {
        "min": 57,
        "max": 75,
        "label": "Severe Indications of Distress",
        "level": "severe",
        "badgeClass": "badge-severe",
        "description": "Your results indicate severe distress. You do not have to go through this alone. We strongly recommend reaching out to a mental health professional for guidance.",
        "recommendation": "Please schedule an urgent consultation with our licensed clinical psychologists for a comprehensive evaluation and compassionate intervention."
      }
    ]
  },
  {
    "id": "gad-7",
    "title": "GAD-7 Quick Anxiety Screener",
    "scaleName": "GAD-7 Clinical Scale",
    "category": "anxiety",
    "questionsCount": 7,
    "duration": "2 mins",
    "maxScore": 21,
    "badge": "Quick 2-Min Screener",
    "badgeColor": "teal",
    "icon": "bi-activity",
    "existingRoute": null,
    "description": "A validated 7-item rapid clinical tool to gauge general anxiety, constant worrying, nervousness, and somatic tension over the past 2 weeks.",
    "whoIsItFor": "Individuals wanting a quick 2-minute clinical check on general anxiety symptoms.",
    "measures": "Generalised anxiety severity, worry loops, tension, and autonomic arousal.",
    "options": [
      {
        "text": "Not at all",
        "score": 0
      },
      {
        "text": "Several days",
        "score": 1
      },
      {
        "text": "More than half the days",
        "score": 2
      },
      {
        "text": "Nearly every day",
        "score": 3
      }
    ],
    "questions": [
      {
        "id": 1,
        "text": "Feeling nervous, anxious, or on edge"
      },
      {
        "id": 2,
        "text": "Not being able to stop or control worrying"
      },
      {
        "id": 3,
        "text": "Worrying too much about different things"
      },
      {
        "id": 4,
        "text": "Trouble relaxing"
      },
      {
        "id": 5,
        "text": "Being so restless that it is hard to sit still"
      },
      {
        "id": 6,
        "text": "Becoming easily annoyed or irritable"
      },
      {
        "id": 7,
        "text": "Feeling afraid, as if something awful might happen"
      }
    ],
    "bands": [
      {
        "min": 0,
        "max": 4,
        "label": "Minimal Anxiety",
        "level": "minimal",
        "badgeClass": "badge-minimal",
        "description": "Minimal or baseline everyday anxiety symptoms.",
        "recommendation": "Continue regular lifestyle practices and mindfulness."
      },
      {
        "min": 5,
        "max": 9,
        "label": "Mild Anxiety",
        "level": "mild",
        "badgeClass": "badge-mild",
        "description": "Mild anxiety symptoms that may occasionally feel overwhelming.",
        "recommendation": "Grounding techniques and proactive stress reduction can help."
      },
      {
        "min": 10,
        "max": 14,
        "label": "Moderate Anxiety",
        "level": "moderate",
        "badgeClass": "badge-moderate",
        "description": "Moderate anxiety symptoms interfering with concentration or sleep.",
        "recommendation": "Structured psychological support (CBT) is recommended."
      },
      {
        "min": 15,
        "max": 21,
        "label": "Severe Anxiety",
        "level": "severe",
        "badgeClass": "badge-severe",
        "description": "Severe anxiety distress with intense emotional or panic sensations.",
        "recommendation": "Consultation with a clinical psychologist is strongly advised."
      }
    ]
  },
  {
    "id": "depression",
    "title": "Depression & Mood Screener",
    "scaleName": "PHQ-9 Clinical Scale",
    "category": "depression",
    "questionsCount": 9,
    "duration": "3 mins",
    "maxScore": 27,
    "badge": "Clinically Validated",
    "badgeColor": "blue",
    "icon": "bi-cloud-rain",
    "existingRoute": null,
    "description": "Assesses depressive symptoms, emotional exhaustion, loss of interest, and energy fluctuations experienced during the last fortnight.",
    "whoIsItFor": "Anyone experiencing persistent sadness, low motivation, sleep disturbances, helplessness, or emotional numbness.",
    "measures": "Depressive symptom severity, anhedonia, cognitive fatigue, and mood regulation.",
    "options": [
      {
        "text": "Not at all",
        "score": 0
      },
      {
        "text": "Several days",
        "score": 1
      },
      {
        "text": "More than half the days",
        "score": 2
      },
      {
        "text": "Nearly every day",
        "score": 3
      }
    ],
    "questions": [
      {
        "id": 1,
        "text": "Little interest or pleasure in doing things"
      },
      {
        "id": 2,
        "text": "Feeling down, depressed, or hopeless"
      },
      {
        "id": 3,
        "text": "Trouble falling or staying asleep, or sleeping too much"
      },
      {
        "id": 4,
        "text": "Feeling tired or having little energy"
      },
      {
        "id": 5,
        "text": "Poor appetite or overeating"
      },
      {
        "id": 6,
        "text": "Feeling bad about yourself \u2014 or that you are a failure or let yourself/family down"
      },
      {
        "id": 7,
        "text": "Trouble concentrating on things, such as reading or watching television"
      },
      {
        "id": 8,
        "text": "Moving or speaking slowly, or being fidgety and restless"
      },
      {
        "id": 9,
        "text": "Thoughts that you would be better off dead, or of hurting yourself in some way"
      }
    ],
    "bands": [
      {
        "min": 0,
        "max": 4,
        "label": "Minimal Depression",
        "level": "minimal",
        "badgeClass": "badge-minimal",
        "description": "Minimal or no depressive symptoms.",
        "recommendation": "Maintain social connections and positive self-care routines."
      },
      {
        "min": 5,
        "max": 9,
        "label": "Mild Depression",
        "level": "mild",
        "badgeClass": "badge-mild",
        "description": "Mild depressive symptoms such as occasional fatigue or low mood.",
        "recommendation": "Gentle daily routines and behavioral activation can help restore energy."
      },
      {
        "min": 10,
        "max": 14,
        "label": "Moderate Depression",
        "level": "moderate",
        "badgeClass": "badge-moderate",
        "description": "Moderate depression impacting daily life, work, or relationships.",
        "recommendation": "Clinical consultation with a psychologist is advisable to explore cognitive reframing."
      },
      {
        "min": 15,
        "max": 19,
        "label": "Moderately Severe Depression",
        "level": "severe",
        "badgeClass": "badge-severe",
        "description": "Prominent depressive distress with functional impairment across major life areas.",
        "recommendation": "Professional psychological treatment is strongly recommended."
      },
      {
        "min": 20,
        "max": 27,
        "label": "Severe Depression",
        "level": "severe",
        "badgeClass": "badge-severe",
        "description": "Severe depressive distress requiring compassionate, immediate clinical attention.",
        "recommendation": "Please schedule an urgent consultation with our psychologists or reach a helpline."
      }
    ]
  },
  {
    "id": "bipolar",
    "title": "Mood Disorder Questionnaire (MDQ)",
    "scaleName": "Hirschfeld MDQ (Bipolar Screener)",
    "category": "depression",
    "questionsCount": 15,
    "duration": "3-4 mins",
    "maxScore": 17,
    "badge": "From NovoPsych PDF",
    "badgeColor": "purple",
    "icon": "bi-lightning",
    "existingRoute": null,
    "description": "Standardized 15-item questionnaire assessing symptoms of hypomania, mania, elevated energy, racing thoughts, and mood swings as defined by Dr. Robert Hirschfeld.",
    "whoIsItFor": "Individuals experiencing intense mood fluctuations, surges of unusual energy, impulsivity, or alternating highs and lows.",
    "measures": "Positive activation (energy, confidence, reduced sleep) and negative activation (irritability, racing thoughts, distractibility).",
    "options": [
      {
        "text": "No",
        "score": 0
      },
      {
        "text": "Yes",
        "score": 1
      }
    ],
    "questions": [
      {
        "id": 1,
        "sectionTitle": "Part 1: Symptoms",
        "text": "Has there ever been a period of time when you were not your usual self and you felt so good or so hyper that other people thought you were not your normal self or you were so hyper that you got into trouble?"
      },
      {
        "id": 2,
        "sectionTitle": "Part 1: Symptoms",
        "text": "Has there ever been a period of time when you were so irritable that you shouted at people or started fights or arguments?"
      },
      {
        "id": 3,
        "sectionTitle": "Part 1: Symptoms",
        "text": "Has there ever been a period of time when you felt much more self-confident than usual?"
      },
      {
        "id": 4,
        "sectionTitle": "Part 1: Symptoms",
        "text": "Has there ever been a period of time when you got much less sleep than usual and found you didn't really miss it?"
      },
      {
        "id": 5,
        "sectionTitle": "Part 1: Symptoms",
        "text": "Has there ever been a period of time when you were much more talkative or spoke much faster than usual?"
      },
      {
        "id": 6,
        "sectionTitle": "Part 1: Symptoms",
        "text": "Has there ever been a period of time when thoughts raced through your head or you couldn't slow your mind down?"
      },
      {
        "id": 7,
        "sectionTitle": "Part 1: Symptoms",
        "text": "Has there ever been a period of time when you were so easily distracted by things around you that you had trouble concentrating or staying on track?"
      },
      {
        "id": 8,
        "sectionTitle": "Part 1: Symptoms",
        "text": "Has there ever been a period of time when you had much more energy than usual?"
      },
      {
        "id": 9,
        "sectionTitle": "Part 1: Symptoms",
        "text": "Has there ever been a period of time when you were much more active or did many more things than usual?"
      },
      {
        "id": 10,
        "sectionTitle": "Part 1: Symptoms",
        "text": "Has there ever been a period of time when you were much more social or outgoing than usual, for example, telephoning friends in the middle of the night?"
      },
      {
        "id": 11,
        "sectionTitle": "Part 1: Symptoms",
        "text": "Has there ever been a period of time when you were much more interested in sex than usual?"
      },
      {
        "id": 12,
        "sectionTitle": "Part 1: Symptoms",
        "text": "Has there ever been a period of time when you did things that were unusual for you or that other people might have thought were excessive, foolish, or risky?"
      },
      {
        "id": 13,
        "sectionTitle": "Part 1: Symptoms",
        "text": "Has there ever been a period of time when spending money got you or your family into trouble?"
      },
      {
        "id": 14,
        "sectionTitle": "Part 2: Co-Occurrence",
        "text": "If you checked YES to more than one of the above, have several of these ever happened during the same period of time?"
      },
      {
        "id": 15,
        "sectionTitle": "Part 3: Functional Impact",
        "text": "How much of a problem did any of these cause you \u2014 like being unable to work; having family, money or legal troubles; getting into arguments or fights?",
        "options": [
          {
            "text": "No Problem",
            "score": 0
          },
          {
            "text": "Minor Problem",
            "score": 1
          },
          {
            "text": "Moderate Problem",
            "score": 2
          },
          {
            "text": "Serious Problem",
            "score": 3
          }
        ]
      }
    ],
    "bands": [
      {
        "min": 0,
        "max": 6,
        "label": "Negative Mood Disorder Screen",
        "level": "minimal",
        "badgeClass": "badge-minimal",
        "description": "Your responses do not indicate a pattern consistent with hypomanic or bipolar mood episodes.",
        "recommendation": "Continue monitoring your mood patterns and practice healthy sleep and stress hygiene."
      },
      {
        "min": 7,
        "max": 10,
        "label": "Subthreshold / Mild Mood Fluctuation",
        "level": "moderate",
        "badgeClass": "badge-moderate",
        "description": "You have endorsed several elevated mood traits, though co-occurrence or functional impairment may be limited.",
        "recommendation": "A clinical consultation can help determine whether these traits relate to cyclothymia, stress, or other mood factors."
      },
      {
        "min": 11,
        "max": 17,
        "label": "Positive Mood Disorder Screen",
        "level": "severe",
        "badgeClass": "badge-severe",
        "description": "Your responses meet clinical criteria for a positive MDQ screen (multiple hypomanic/manic symptoms co-occurring with functional difficulty).",
        "recommendation": "A comprehensive psychiatric and psychological diagnostic assessment is strongly recommended to explore mood stabilization."
      }
    ]
  },
  {
    "id": "ocd",
    "title": "Obsessive-Compulsive Inventory \u2013 Revised (OCI-R)",
    "scaleName": "OCI-R Clinical Scale (Foa et al.)",
    "category": "ocd",
    "questionsCount": 18,
    "duration": "4-5 mins",
    "maxScore": 72,
    "badge": "From NovoPsych PDF",
    "badgeColor": "emerald",
    "icon": "bi-arrow-repeat",
    "existingRoute": null,
    "description": "The official 18-item OCI-R evaluating 6 core OCD subscales: Washing, Checking, Ordering, Obsessing, Hoarding, and Neutralizing.",
    "whoIsItFor": "Individuals troubled by persistent intrusive thoughts, repetitive rituals, excessive washing, checking, or ordering urges.",
    "measures": "Washing, checking, ordering, obsessional distress, hoarding tendencies, and mental neutralizing rituals.",
    "options": [
      {
        "text": "0 - Not at all",
        "score": 0
      },
      {
        "text": "1 - A little",
        "score": 1
      },
      {
        "text": "2 - Moderately",
        "score": 2
      },
      {
        "text": "3 - A lot",
        "score": 3
      },
      {
        "text": "4 - Extremely",
        "score": 4
      }
    ],
    "questions": [
      {
        "id": 1,
        "sectionTitle": "Hoarding",
        "text": "I have saved up so many things that they get in the way."
      },
      {
        "id": 2,
        "sectionTitle": "Checking",
        "text": "I check things more often than necessary."
      },
      {
        "id": 3,
        "sectionTitle": "Ordering",
        "text": "I get upset if objects are not arranged properly."
      },
      {
        "id": 4,
        "sectionTitle": "Neutralizing",
        "text": "I feel compelled to count while I am doing things."
      },
      {
        "id": 5,
        "sectionTitle": "Washing",
        "text": "I find it difficult to touch an object when I know it has been touched by strangers or certain people."
      },
      {
        "id": 6,
        "sectionTitle": "Obsessing",
        "text": "I find it difficult to control my own thoughts."
      },
      {
        "id": 7,
        "sectionTitle": "Hoarding",
        "text": "I collect things I don't need."
      },
      {
        "id": 8,
        "sectionTitle": "Checking",
        "text": "I repeatedly check doors, windows, drawers, etc."
      },
      {
        "id": 9,
        "sectionTitle": "Ordering",
        "text": "I get upset if others change the way I have arranged things."
      },
      {
        "id": 10,
        "sectionTitle": "Neutralizing",
        "text": "I feel I have to repeat certain numbers."
      },
      {
        "id": 11,
        "sectionTitle": "Washing",
        "text": "I sometimes have to wash or clean myself simply because I feel contaminated."
      },
      {
        "id": 12,
        "sectionTitle": "Obsessing",
        "text": "I am upset by unpleasant thoughts that come into my mind against my will."
      },
      {
        "id": 13,
        "sectionTitle": "Hoarding",
        "text": "I avoid throwing things away because I am afraid I might need them later."
      },
      {
        "id": 14,
        "sectionTitle": "Checking",
        "text": "I repeatedly check gas and water taps and light switches after turning them off."
      },
      {
        "id": 15,
        "sectionTitle": "Ordering",
        "text": "I need things to be arranged in a particular way."
      },
      {
        "id": 16,
        "sectionTitle": "Neutralizing",
        "text": "I feel that there are good and bad numbers."
      },
      {
        "id": 17,
        "sectionTitle": "Washing",
        "text": "I wash my hands more often and longer than necessary."
      },
      {
        "id": 18,
        "sectionTitle": "Obsessing",
        "text": "I frequently get nasty thoughts and have difficulty in getting rid of them."
      }
    ],
    "bands": [
      {
        "min": 0,
        "max": 20,
        "label": "Subclinical OCD Symptoms",
        "level": "minimal",
        "badgeClass": "badge-minimal",
        "description": "Your score falls below the clinical cutoff of 21, indicating typical everyday concerns or minimal distress.",
        "recommendation": "Continue practicing healthy cognitive habits and stress management."
      },
      {
        "min": 21,
        "max": 35,
        "label": "Mild to Moderate OCD Indicators",
        "level": "moderate",
        "badgeClass": "badge-moderate",
        "description": "Your score meets or exceeds the validated clinical threshold of 21, indicating noticeable obsessions or compulsive rituals.",
        "recommendation": "Exposure and Response Prevention (ERP) therapy with a licensed clinical psychologist is strongly recommended."
      },
      {
        "min": 36,
        "max": 50,
        "label": "Moderate to Severe OCD Distress",
        "level": "severe",
        "badgeClass": "badge-severe",
        "description": "Your score reflects prominent obsessional cycles and rituals causing substantial interference in everyday functioning.",
        "recommendation": "Structured ERP therapy and clinical psychiatric consultation are highly advised for effective symptom reduction."
      },
      {
        "min": 51,
        "max": 72,
        "label": "Severe OCD Impairment",
        "level": "severe",
        "badgeClass": "badge-severe",
        "description": "Your responses indicate high levels of distress across multiple OCD domains requiring compassionate, specialized clinical intervention.",
        "recommendation": "Urgent comprehensive psychological and psychiatric care is strongly recommended."
      }
    ]
  },
  {
    "id": "stress",
    "title": "ISMA Stress & Burnout Questionnaire",
    "scaleName": "ISMA UK 25-Item Stress Scale",
    "category": "stress",
    "questionsCount": 25,
    "duration": "4-5 mins",
    "maxScore": 25,
    "badge": "From ISMA UK PDF",
    "badgeColor": "amber",
    "icon": "bi-fire",
    "existingRoute": null,
    "description": "The official 25-item International Stress Management Association (ISMA UK) questionnaire to assess somatic tension, time pressure, emotional exhaustion, and burnout vulnerability.",
    "whoIsItFor": "Working professionals, caregivers, students, or anyone experiencing chronic pressure, fatigue, or difficulty unwinding.",
    "measures": "Workload pressure, emotional exhaustion, physical tension, sleep disruption, and coping mechanisms.",
    "options": [
      {
        "text": "No",
        "score": 0
      },
      {
        "text": "Yes",
        "score": 1
      }
    ],
    "questions": [
      {
        "id": 1,
        "text": "I frequently bring work home at night."
      },
      {
        "id": 2,
        "text": "Not enough hours in the day to do all the things that I must do."
      },
      {
        "id": 3,
        "text": "I deny or ignore problems in the hope that they will go away."
      },
      {
        "id": 4,
        "text": "I do the jobs myself to ensure they are done properly."
      },
      {
        "id": 5,
        "text": "I underestimate how long it takes to do things."
      },
      {
        "id": 6,
        "text": "I feel that there are too many deadlines in my work / life that are difficult to meet."
      },
      {
        "id": 7,
        "text": "My self confidence / self esteem is lower than I would like it to be."
      },
      {
        "id": 8,
        "text": "I frequently have guilty feelings if I relax and do nothing."
      },
      {
        "id": 9,
        "text": "I find myself thinking about problems even when I am supposed to be relaxing."
      },
      {
        "id": 10,
        "text": "I feel fatigued or tired even when I wake after an adequate sleep."
      },
      {
        "id": 11,
        "text": "I often nod or finish other people's sentences for them when they speak slowly."
      },
      {
        "id": 12,
        "text": "I have a tendency to eat, talk, walk and drive quickly."
      },
      {
        "id": 13,
        "text": "My appetite has changed, I have either a desire to binge or have a loss of appetite / may skip meals."
      },
      {
        "id": 14,
        "text": "I feel irritated or angry if the car or traffic in front seems to be going too slowly / I become very frustrated at having to wait in a queue."
      },
      {
        "id": 15,
        "text": "If something or someone really annoys me I will bottle up my feelings."
      },
      {
        "id": 16,
        "text": "When I play sport or games, I really try to win whoever I play."
      },
      {
        "id": 17,
        "text": "I experience mood swings, difficulty making decisions, concentration and memory is impaired."
      },
      {
        "id": 18,
        "text": "I find fault and criticise others rather than praising, even if it is deserved."
      },
      {
        "id": 19,
        "text": "I seem to be listening even though I am preoccupied with my own thoughts."
      },
      {
        "id": 20,
        "text": "My sex drive is lower, or I can experience changes to physical energy / hormonal cycle."
      },
      {
        "id": 21,
        "text": "I find myself grinding my teeth or clenching my jaw."
      },
      {
        "id": 22,
        "text": "I have an increase in muscular aches and pains especially in the neck, head, lower back, or shoulders."
      },
      {
        "id": 23,
        "text": "I am unable to perform tasks as well as I used to; my judgment is clouded or not as good as it was."
      },
      {
        "id": 24,
        "text": "I find I have a greater dependency on alcohol, caffeine, nicotine or comfort substances."
      },
      {
        "id": 25,
        "text": "I find that I don't have time for many interests / hobbies outside of work."
      }
    ],
    "bands": [
      {
        "min": 0,
        "max": 4,
        "label": "Low Stress (ISMA 4 or less)",
        "level": "minimal",
        "badgeClass": "badge-minimal",
        "description": "You are least likely to suffer from stress-related illness. Your pressure-coping balance is well maintained.",
        "recommendation": "Continue your healthy work-life boundaries, relaxation habits, and restorative routines."
      },
      {
        "min": 5,
        "max": 13,
        "label": "Moderate Stress (ISMA 5-13 points)",
        "level": "moderate",
        "badgeClass": "badge-moderate",
        "description": "You are more likely to experience stress-related ill health (either mental, physical, or both). Unhealthy patterns may be developing.",
        "recommendation": "Stress management counseling, workplace boundary restructuring, and relaxation training are recommended."
      },
      {
        "min": 14,
        "max": 25,
        "label": "High Stress & Burnout Risk (ISMA 14+ points)",
        "level": "severe",
        "badgeClass": "badge-severe",
        "description": "You are most prone to stress, showing multiple traits that create unhealthy physical and emotional strain.",
        "recommendation": "It is important to seek professional stress counseling with a clinical psychologist to prevent chronic illness."
      }
    ]
  },
  {
    "id": "adhd",
    "title": "Adult ADHD Self-Report Scale (ASRS-v1.1)",
    "scaleName": "WHO ASRS-v1.1 (18-Item Checklist)",
    "category": "adhd",
    "questionsCount": 18,
    "duration": "4-5 mins",
    "maxScore": 72,
    "badge": "From ADD.org PDF",
    "badgeColor": "purple",
    "icon": "bi-lightning-charge",
    "existingRoute": null,
    "description": "The complete 18-item World Health Organization (WHO) Adult ADHD Self-Report Scale Symptom Checklist (Part A screener + Part B inattention/impulsivity).",
    "whoIsItFor": "Adults experiencing persistent difficulty with focus, task initiation, organization, forgetfulness, restlessness, or impulsivity.",
    "measures": "Executive function, sustained attention, motor restlessness, disorganization, and impulse regulation.",
    "options": [
      {
        "text": "0 - Never",
        "score": 0
      },
      {
        "text": "1 - Rarely",
        "score": 1
      },
      {
        "text": "2 - Sometimes",
        "score": 2
      },
      {
        "text": "3 - Often",
        "score": 3
      },
      {
        "text": "4 - Very Often",
        "score": 4
      }
    ],
    "questions": [
      {
        "id": 1,
        "sectionTitle": "Part A (Core Predictive)",
        "text": "How often do you have trouble wrapping up the final details of a project, once the challenging parts have been done?"
      },
      {
        "id": 2,
        "sectionTitle": "Part A (Core Predictive)",
        "text": "How often do you have difficulty getting things in order when you have to do a task that requires organization?"
      },
      {
        "id": 3,
        "sectionTitle": "Part A (Core Predictive)",
        "text": "How often do you have problems remembering appointments or obligations?"
      },
      {
        "id": 4,
        "sectionTitle": "Part A (Core Predictive)",
        "text": "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?"
      },
      {
        "id": 5,
        "sectionTitle": "Part A (Core Predictive)",
        "text": "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?"
      },
      {
        "id": 6,
        "sectionTitle": "Part A (Core Predictive)",
        "text": "How often do you feel overly active and compelled to do things, like you were driven by a motor?"
      },
      {
        "id": 7,
        "sectionTitle": "Part B (Inattention & Impulsivity)",
        "text": "How often do you make careless mistakes when you have to work on a boring or difficult project?"
      },
      {
        "id": 8,
        "sectionTitle": "Part B (Inattention & Impulsivity)",
        "text": "How often do you have difficulty keeping your attention when you are doing boring or repetitive work?"
      },
      {
        "id": 9,
        "sectionTitle": "Part B (Inattention & Impulsivity)",
        "text": "How often do you have difficulty concentrating on what people say to you, even when they are speaking to you directly?"
      },
      {
        "id": 10,
        "sectionTitle": "Part B (Inattention & Impulsivity)",
        "text": "How often do you misplace or have difficulty finding things at home or at work?"
      },
      {
        "id": 11,
        "sectionTitle": "Part B (Inattention & Impulsivity)",
        "text": "How often are you distracted by activity or noise around you?"
      },
      {
        "id": 12,
        "sectionTitle": "Part B (Inattention & Impulsivity)",
        "text": "How often do you leave your seat in meetings or other situations in which you are expected to remain seated?"
      },
      {
        "id": 13,
        "sectionTitle": "Part B (Inattention & Impulsivity)",
        "text": "How often do you feel restless or squirmy?"
      },
      {
        "id": 14,
        "sectionTitle": "Part B (Inattention & Impulsivity)",
        "text": "How often do you have difficulty unwinding and relaxing when you have time to yourself?"
      },
      {
        "id": 15,
        "sectionTitle": "Part B (Inattention & Impulsivity)",
        "text": "How often do you find yourself talking too much when you are in social situations?"
      },
      {
        "id": 16,
        "sectionTitle": "Part B (Inattention & Impulsivity)",
        "text": "When you're in a conversation, how often do you find yourself finishing the sentences of the people you are talking to, before they can finish them themselves?"
      },
      {
        "id": 17,
        "sectionTitle": "Part B (Inattention & Impulsivity)",
        "text": "How often do you have difficulty waiting your turn in situations when turn taking is required?"
      },
      {
        "id": 18,
        "sectionTitle": "Part B (Inattention & Impulsivity)",
        "text": "How often do you interrupt others when they are busy?"
      }
    ],
    "bands": [
      {
        "min": 0,
        "max": 23,
        "label": "Low Likelihood of Adult ADHD",
        "level": "minimal",
        "badgeClass": "badge-minimal",
        "description": "Your responses indicate typical executive functioning without notable adult ADHD symptom patterns.",
        "recommendation": "Maintain your existing organization habits and focus routines."
      },
      {
        "min": 24,
        "max": 39,
        "label": "Mild to Moderate Executive Challenges",
        "level": "mild",
        "badgeClass": "badge-mild",
        "description": "Some traits of inattention, procrastination, or restlessness, which may be heightened by stress or fatigue.",
        "recommendation": "Structured productivity tools, environment optimization, and lifestyle pacing can help."
      },
      {
        "min": 40,
        "max": 54,
        "label": "Moderate to High ADHD Indicators",
        "level": "moderate",
        "badgeClass": "badge-moderate",
        "description": "Significant symptoms of inattention and impulsivity consistent with ADHD criteria.",
        "recommendation": "A comprehensive neurodevelopmental ADHD evaluation with a licensed clinical psychologist is recommended."
      },
      {
        "min": 55,
        "max": 72,
        "label": "Highly Consistent with Adult ADHD",
        "level": "severe",
        "badgeClass": "badge-severe",
        "description": "Your score pattern is highly consistent with adult Attention Deficit Hyperactivity Disorder across multiple areas.",
        "recommendation": "We strongly recommend scheduling a diagnostic evaluation for personalized ADHD strategies and intervention."
      }
    ]
  },
  {
    "id": "schizophrenia",
    "title": "Brief Psychiatric Rating Scale (BPRS)",
    "scaleName": "BPRS 18-Item Clinical Rating Scale",
    "category": "psychosis",
    "questionsCount": 18,
    "duration": "5-6 mins",
    "maxScore": 126,
    "badge": "From San Mateo County PDF",
    "badgeColor": "blue",
    "icon": "bi-shield-check",
    "existingRoute": null,
    "description": "Standardized 18-item clinical scale from San Mateo County Health evaluating psychiatric constructs including thought disorganization, unusual thought content, hallucinations, and emotional blunting.",
    "whoIsItFor": "Individuals or concerned family members evaluating unusual sensory experiences, paranoia, disorganized thinking, or significant psychiatric changes.",
    "measures": "Thought disorganization, somatic concern, hallucinatory experiences, suspiciousness, blunted affect, and motor agitation.",
    "options": [
      {
        "text": "1 - Not Present",
        "score": 1
      },
      {
        "text": "2 - Very Mild",
        "score": 2
      },
      {
        "text": "3 - Mild",
        "score": 3
      },
      {
        "text": "4 - Moderate",
        "score": 4
      },
      {
        "text": "5 - Moderately Severe",
        "score": 5
      },
      {
        "text": "6 - Severe",
        "score": 6
      },
      {
        "text": "7 - Extremely Severe",
        "score": 7
      }
    ],
    "questions": [
      {
        "id": 1,
        "text": "Somatic Concern: Preoccupation with physical health, fear of physical illness, or hypochondriasis."
      },
      {
        "id": 2,
        "text": "Anxiety: Worry, fear, over-concern for present or future, or inner uneasiness."
      },
      {
        "id": 3,
        "text": "Emotional Withdrawal: Lack of spontaneous interaction, emotional isolation, or deficiency in relating to others."
      },
      {
        "id": 4,
        "text": "Conceptual Disorganization: Confused, disconnected, or disorganized thought processes."
      },
      {
        "id": 5,
        "text": "Guilt Feelings: Self-blame, shame, remorse for past behavior, or feeling deserving of punishment."
      },
      {
        "id": 6,
        "text": "Tension: Physical and motor manifestations of nervousness, agitation, or inability to relax."
      },
      {
        "id": 7,
        "text": "Mannerisms and Posturing: Peculiar, bizarre, repetitive, or unnatural motor movements or postures."
      },
      {
        "id": 8,
        "text": "Grandiosity: Exaggerated self-opinion, conviction of unusual powers, special mission, or superior identity."
      },
      {
        "id": 9,
        "text": "Depressive Mood: Sorrow, despondency, deep sadness, or profound pessimism about life."
      },
      {
        "id": 10,
        "text": "Hostility: Animosity, contempt, belligerence, irritability, or aggressive attitude toward others."
      },
      {
        "id": 11,
        "text": "Suspiciousness: Mistrust, belief that others harbor malicious intent, or persecutory thoughts."
      },
      {
        "id": 12,
        "text": "Hallucinatory Behavior: Perceptions (hearing voices, seeing things) that occur without external stimuli."
      },
      {
        "id": 13,
        "text": "Motor Retardation: Slowed physical movement, delayed speech responses, or reduced bodily energy."
      },
      {
        "id": 14,
        "text": "Uncooperativeness: Guardedness, defiance, resentment, or resistance toward social rapport."
      },
      {
        "id": 15,
        "text": "Unusual Thought Content: Odd, strange, or bizarre beliefs, or feelings that thoughts are manipulated."
      },
      {
        "id": 16,
        "text": "Blunted Affect: Reduced emotional warmth, restricted facial expressiveness, or emotional numbness."
      },
      {
        "id": 17,
        "text": "Excitement: Heightened emotional tone, agitation, hyper-reactivity, or racing energy."
      },
      {
        "id": 18,
        "text": "Disorientation: Confusion regarding time, location, identity, or immediate surroundings."
      }
    ],
    "bands": [
      {
        "min": 18,
        "max": 35,
        "label": "Minimal / Non-Clinical Indicators",
        "level": "minimal",
        "badgeClass": "badge-minimal",
        "description": "Your responses fall within the expected baseline range without evidence of active psychotic or severe psychiatric distress.",
        "recommendation": "Maintain healthy lifestyle balance, sleep consistency, and support networks."
      },
      {
        "min": 36,
        "max": 53,
        "label": "Mild Psychiatric Symptom Presence",
        "level": "mild",
        "badgeClass": "badge-mild",
        "description": "Noticeable emotional tension, anxiety, or unusual thought experiences that warrant professional monitoring.",
        "recommendation": "A supportive psychological consultation is advised to explore stressors and maintain stability."
      },
      {
        "min": 54,
        "max": 75,
        "label": "Moderate Psychiatric Symptom Severity",
        "level": "moderate",
        "badgeClass": "badge-moderate",
        "description": "Elevated scores reflecting substantial distress in thought processing, suspiciousness, mood, or perception.",
        "recommendation": "A comprehensive psychiatric evaluation with a clinical specialist is strongly recommended."
      },
      {
        "min": 76,
        "max": 126,
        "label": "Severe Psychiatric Distress / Clinical Attention",
        "level": "severe",
        "badgeClass": "badge-severe",
        "description": "Significant clinical elevation indicating severe disruption in reality testing, perception, or mood regulation.",
        "recommendation": "Please schedule an urgent clinical consultation with a psychiatrist or seek immediate medical support."
      }
    ]
  },
  {
    "id": "teen",
    "title": "Severity Measure for Social Anxiety Disorder (Child Age 11\u201317)",
    "scaleName": "APA DSM-5 10-Item Measure",
    "category": "teen",
    "questionsCount": 10,
    "duration": "2-3 mins",
    "maxScore": 40,
    "badge": "From APA DSM-5 PDF",
    "badgeColor": "teal",
    "icon": "bi-mortarboard",
    "existingRoute": null,
    "description": "The official American Psychiatric Association (APA) DSM-5 10-item clinical tool assessing social phobia and anxiety severity in children and adolescents (ages 11-17).",
    "whoIsItFor": "Teenagers (11-17) and caring parents seeking to evaluate social fear, peer embarrassment, performance dread, and avoidance.",
    "measures": "Social situation terror, avoidance, physical panic symptoms, anticipatory dread, and coping challenges over the past 7 days.",
    "options": [
      {
        "text": "0 - Never",
        "score": 0
      },
      {
        "text": "1 - Occasionally",
        "score": 1
      },
      {
        "text": "2 - Half of the time",
        "score": 2
      },
      {
        "text": "3 - Most of the time",
        "score": 3
      },
      {
        "text": "4 - All of the time",
        "score": 4
      }
    ],
    "questions": [
      {
        "id": 1,
        "text": "During the past 7 days, I have felt moments of sudden terror, fear, or fright in social situations."
      },
      {
        "id": 2,
        "text": "During the past 7 days, I have felt anxious, worried, or nervous about social situations."
      },
      {
        "id": 3,
        "text": "During the past 7 days, I have had thoughts of being rejected, humiliated, embarrassed, ridiculed, or offending others."
      },
      {
        "id": 4,
        "text": "During the past 7 days, I have felt a racing heart, sweaty, trouble breathing, faint, or shaky in social situations."
      },
      {
        "id": 5,
        "text": "During the past 7 days, I have felt tense muscles, felt on edge or restless, or had trouble relaxing in social situations."
      },
      {
        "id": 6,
        "text": "During the past 7 days, I have avoided, or did not approach or enter, social situations."
      },
      {
        "id": 7,
        "text": "During the past 7 days, I have left social situations early or participated only minimally (e.g., said little, avoided eye contact)."
      },
      {
        "id": 8,
        "text": "During the past 7 days, I have spent a lot of time preparing what to say or how to act in social situations."
      },
      {
        "id": 9,
        "text": "During the past 7 days, I have distracted myself to avoid thinking about social situations."
      },
      {
        "id": 10,
        "text": "During the past 7 days, I have needed help to cope with social situations (e.g., listening to music, having a safety person)."
      }
    ],
    "bands": [
      {
        "min": 0,
        "max": 8,
        "label": "Minimal / No Social Anxiety (Avg: 0-0.8)",
        "level": "minimal",
        "badgeClass": "badge-minimal",
        "description": "Your responses suggest typical adolescent social comfort with minimal social avoidance or panic.",
        "recommendation": "Continue encouraging positive peer activities and open self-expression."
      },
      {
        "min": 9,
        "max": 18,
        "label": "Mild Social Anxiety (Avg: 0.9-1.8)",
        "level": "mild",
        "badgeClass": "badge-mild",
        "description": "Some occasional nervousness, embarrassment, or self-consciousness in social or classroom settings.",
        "recommendation": "Building confidence through social practice and gentle exposure can ease worry."
      },
      {
        "min": 19,
        "max": 28,
        "label": "Moderate Social Anxiety (Avg: 1.9-2.8)",
        "level": "moderate",
        "badgeClass": "badge-moderate",
        "description": "Noticeable social fear, physical panic sensations, and avoidance of social events or school participation.",
        "recommendation": "Adolescent cognitive-behavioral counseling is recommended to build social resilience."
      },
      {
        "min": 29,
        "max": 40,
        "label": "Severe Social Anxiety (Avg: 2.9-4.0)",
        "level": "severe",
        "badgeClass": "badge-severe",
        "description": "High social phobia distress, intense somatic panic, and pervasive withdrawal from peer interactions.",
        "recommendation": "Supportive counseling with a specialized child and adolescent psychologist is strongly advised."
      }
    ]
  },
  {
    "id": "relationship",
    "title": "Relationship Assessment Scale (RAS)",
    "scaleName": "Hendrick 7-Item Relationship Scale",
    "category": "relationship",
    "questionsCount": 7,
    "duration": "2 mins",
    "maxScore": 35,
    "badge": "From Fetzer.org PDF",
    "badgeColor": "rose",
    "icon": "bi-people",
    "existingRoute": null,
    "description": "The standardized 7-item Hendrick Relationship Assessment Scale (RAS) measuring romantic satisfaction, partner expectations, love, and problem resolution.",
    "whoIsItFor": "Couples, married partners, or individuals evaluating the emotional strength and friction points in their relationship.",
    "measures": "Need fulfillment, general satisfaction, comparative quality, love for partner, and conflict impact.",
    "options": [
      {
        "text": "1 - Low",
        "score": 1
      },
      {
        "text": "2 - Moderately low",
        "score": 2
      },
      {
        "text": "3 - Average",
        "score": 3
      },
      {
        "text": "4 - High",
        "score": 4
      },
      {
        "text": "5 - Very high",
        "score": 5
      }
    ],
    "questions": [
      {
        "id": 1,
        "text": "How well does your partner meet your needs?",
        "options": [
          {
            "text": "1 - Poorly",
            "score": 1
          },
          {
            "text": "2 - Somewhat poorly",
            "score": 2
          },
          {
            "text": "3 - Average",
            "score": 3
          },
          {
            "text": "4 - Very well",
            "score": 4
          },
          {
            "text": "5 - Extremely well",
            "score": 5
          }
        ]
      },
      {
        "id": 2,
        "text": "In general, how satisfied are you with your relationship?",
        "options": [
          {
            "text": "1 - Unsatisfied",
            "score": 1
          },
          {
            "text": "2 - Slightly unsatisfied",
            "score": 2
          },
          {
            "text": "3 - Neutral",
            "score": 3
          },
          {
            "text": "4 - Satisfied",
            "score": 4
          },
          {
            "text": "5 - Extremely satisfied",
            "score": 5
          }
        ]
      },
      {
        "id": 3,
        "text": "How good is your relationship compared to most?",
        "options": [
          {
            "text": "1 - Much worse",
            "score": 1
          },
          {
            "text": "2 - Somewhat worse",
            "score": 2
          },
          {
            "text": "3 - About average",
            "score": 3
          },
          {
            "text": "4 - Better than most",
            "score": 4
          },
          {
            "text": "5 - Much better",
            "score": 5
          }
        ]
      },
      {
        "id": 4,
        "text": "How often do you wish you hadn't gotten into this relationship?",
        "reverse": true,
        "options": [
          {
            "text": "1 - Never",
            "score": 5
          },
          {
            "text": "2 - Rarely",
            "score": 4
          },
          {
            "text": "3 - Sometimes",
            "score": 3
          },
          {
            "text": "4 - Often",
            "score": 2
          },
          {
            "text": "5 - Very often",
            "score": 1
          }
        ]
      },
      {
        "id": 5,
        "text": "To what extent has your relationship met your original expectations?",
        "options": [
          {
            "text": "1 - Hardly at all",
            "score": 1
          },
          {
            "text": "2 - A little bit",
            "score": 2
          },
          {
            "text": "3 - Moderately",
            "score": 3
          },
          {
            "text": "4 - Mostly",
            "score": 4
          },
          {
            "text": "5 - Completely",
            "score": 5
          }
        ]
      },
      {
        "id": 6,
        "text": "How much do you love your partner?",
        "options": [
          {
            "text": "1 - Not much",
            "score": 1
          },
          {
            "text": "2 - A little",
            "score": 2
          },
          {
            "text": "3 - Moderately",
            "score": 3
          },
          {
            "text": "4 - Very much",
            "score": 4
          },
          {
            "text": "5 - Completely / Immensely",
            "score": 5
          }
        ]
      },
      {
        "id": 7,
        "text": "How many problems are there in your relationship?",
        "reverse": true,
        "options": [
          {
            "text": "1 - Very few / None",
            "score": 5
          },
          {
            "text": "2 - Few problems",
            "score": 4
          },
          {
            "text": "3 - Average amount",
            "score": 3
          },
          {
            "text": "4 - Many problems",
            "score": 2
          },
          {
            "text": "5 - Very many problems",
            "score": 1
          }
        ]
      }
    ],
    "bands": [
      {
        "min": 7,
        "max": 18,
        "label": "Low Satisfaction / High Strain",
        "level": "severe",
        "badgeClass": "badge-severe",
        "description": "Your responses indicate notable relationship distress, unmet needs, or frequent unresolved conflict.",
        "recommendation": "Couples counseling or relationship therapy can provide a safe space to rebuild communication and trust."
      },
      {
        "min": 19,
        "max": 26,
        "label": "Moderate Relationship Satisfaction",
        "level": "moderate",
        "badgeClass": "badge-moderate",
        "description": "A stable connection with some routine friction points or areas where expectations could be better aligned.",
        "recommendation": "Scheduling intentional quality time and practicing active listening can deepen your bond."
      },
      {
        "min": 27,
        "max": 35,
        "label": "High & Fulfilling Relationship",
        "level": "minimal",
        "badgeClass": "badge-minimal",
        "description": "Strong partnership dynamics, high mutual respect, deep emotional satisfaction, and effective affection.",
        "recommendation": "Continue nurturing mutual appreciation and open communication."
      }
    ]
  },
  {
    "id": "trauma",
    "title": "Trauma & PTSD Impact Screener",
    "scaleName": "PCL-5 Primary Screener",
    "category": "trauma",
    "questionsCount": 5,
    "duration": "2 mins",
    "maxScore": 15,
    "badge": "Trauma-Informed",
    "badgeColor": "amber",
    "icon": "bi-bandaid",
    "existingRoute": null,
    "description": "Assesses lingering memories, hypervigilance, emotional numbness, and distress related to difficult or traumatic past life events.",
    "whoIsItFor": "Anyone who has survived severe physical, emotional, relational, or environmental trauma and feels stuck in flashbacks.",
    "measures": "Intrusive trauma recall, autonomic hyperarousal, avoidance behaviors, and emotional blunting.",
    "options": [
      {
        "text": "Not at all",
        "score": 0
      },
      {
        "text": "A little bit",
        "score": 1
      },
      {
        "text": "Moderately",
        "score": 2
      },
      {
        "text": "Quite a bit / Severely",
        "score": 3
      }
    ],
    "questions": [
      {
        "id": 1,
        "text": "Having repeated, disturbing memories, thoughts, or images of a stressful past experience"
      },
      {
        "id": 2,
        "text": "Having bad dreams or nightmares related to the stressful experience"
      },
      {
        "id": 3,
        "text": "Avoiding situations, places, or conversations that remind you of the experience"
      },
      {
        "id": 4,
        "text": "Feeling constantly on guard, watchful, easily startled, or physically tense"
      },
      {
        "id": 5,
        "text": "Feeling detached, cut off from people, or emotionally numb"
      }
    ],
    "bands": [
      {
        "min": 0,
        "max": 3,
        "label": "Minimal Trauma Symptomatology",
        "level": "minimal",
        "badgeClass": "badge-minimal",
        "description": "Responses indicate healthy natural processing without pervasive trauma disruption.",
        "recommendation": "Maintain grounded routines and support networks."
      },
      {
        "min": 4,
        "max": 8,
        "label": "Mild-to-Moderate Traumatic Stress",
        "level": "moderate",
        "badgeClass": "badge-moderate",
        "description": "Noticeable trauma triggers or avoidance patterns affecting peace of mind.",
        "recommendation": "Trauma-informed counselling can provide rapid grounding and emotional safety."
      },
      {
        "min": 9,
        "max": 15,
        "label": "High Post-Traumatic Impact",
        "level": "severe",
        "badgeClass": "badge-severe",
        "description": "Significant post-traumatic intrusion, hyperarousal, and emotional exhaustion.",
        "recommendation": "Consultation with a certified trauma psychologist is strongly recommended."
      }
    ]
  },
  {
    "id": "wellness-game",
    "title": "Mind & Mood Wellness Interactive Game",
    "scaleName": "Cognitive Self-Care Exercises",
    "category": "wellness",
    "questionsCount": 1,
    "duration": "3-5 mins",
    "maxScore": 100,
    "badge": "Interactive Activity",
    "badgeColor": "emerald",
    "icon": "bi-controller",
    "existingRoute": "/game",
    "description": "Engage in relaxing, interactive cognitive wellness exercises designed to soothe nervous system tension, sharpen focus, and uplift mood.",
    "whoIsItFor": "Anyone looking for a playful, interactive reset during a stressful day.",
    "measures": "Cognitive engagement, somatic grounding, and mindful relaxation.",
    "options": [],
    "questions": [],
    "bands": []
  }
];
