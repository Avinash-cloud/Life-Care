import { useParams, Link } from 'react-router-dom';
import './ConditionDetail.css';
import depressionImg from '../../../assets/Depression.jpg';
import anxietyImg from '../../../assets/Generalised Anxiety Disorder.webp';
import ocdImg from '../../../assets/Obsessive Compulsive Disorder.webp';
import bipolarImg from '../../../assets/Bipolar Disorder.webp';
import adhdImg from '../../../assets/Adult ADHD.jpg';
import socialAnxietyImg from '../../../assets/Social Anxiety.jpg';

const conditionsData = {
  depression: {
    title: 'Depression',
    icon: 'bi-cloud-rain',
    image: depressionImg,
    description: 'Depression is more than just feeling sad. It\'s a serious mental health condition that affects how you feel, think, and handle daily activities.',
    symptoms: [
      'Persistent sad, anxious, or empty mood',
      'Loss of interest in activities once enjoyed',
      'Changes in appetite or weight',
      'Sleep disturbances',
      'Fatigue or loss of energy',
      'Feelings of worthlessness or guilt',
      'Difficulty concentrating',
      'Thoughts of death or suicide'
    ],
    treatment: 'Treatment typically includes psychotherapy (such as cognitive behavioral therapy), medication, or a combination of both. Lifestyle changes and support groups can also be beneficial.',
    howWeHelp: 'Our experienced counsellors provide evidence-based therapy to help you understand and manage depression. We create personalized treatment plans that address your unique needs.'
  },
  anxiety: {
    title: 'Generalised Anxiety Disorder',
    icon: 'bi-exclamation-diamond',
    image: anxietyImg,
    description: 'Generalised Anxiety Disorder (GAD) involves persistent and excessive worry about various aspects of daily life, often without a specific cause.',
    symptoms: [
      'Excessive worry about everyday matters',
      'Restlessness or feeling on edge',
      'Difficulty concentrating',
      'Irritability',
      'Muscle tension',
      'Sleep problems',
      'Fatigue',
      'Physical symptoms like sweating or trembling'
    ],
    treatment: 'Treatment includes cognitive behavioral therapy (CBT), relaxation techniques, and sometimes medication. Learning coping strategies and stress management is crucial.',
    howWeHelp: 'We offer specialized anxiety management programs that teach you practical coping skills and help you regain control over your worries and fears.'
  },
  ocd: {
    title: 'Obsessive Compulsive Disorder',
    icon: 'bi-arrow-repeat',
    image: ocdImg,
    description: 'OCD is characterized by unwanted, intrusive thoughts (obsessions) and repetitive behaviors or mental acts (compulsions) performed to reduce anxiety.',
    symptoms: [
      'Intrusive, unwanted thoughts or images',
      'Fear of contamination or germs',
      'Need for symmetry or order',
      'Repetitive behaviors (checking, counting, cleaning)',
      'Mental rituals',
      'Significant distress or impairment',
      'Time-consuming compulsions',
      'Difficulty controlling thoughts or behaviors'
    ],
    treatment: 'Exposure and Response Prevention (ERP) therapy is the gold standard treatment for OCD. Cognitive therapy and medication can also be effective.',
    howWeHelp: 'Our therapists are trained in ERP and other evidence-based treatments for OCD. We help you gradually face your fears and reduce compulsive behaviors.'
  },
  bipolar: {
    title: 'Bipolar Disorder',
    icon: 'bi-arrow-down-up',
    image: bipolarImg,
    description: 'Bipolar disorder causes extreme mood swings that include emotional highs (mania or hypomania) and lows (depression).',
    symptoms: [
      'Manic episodes: elevated mood, increased energy, reduced need for sleep',
      'Depressive episodes: low mood, loss of interest, fatigue',
      'Rapid speech and racing thoughts',
      'Impulsive or risky behavior',
      'Difficulty concentrating',
      'Changes in sleep patterns',
      'Mood swings affecting relationships and work',
      'Periods of normal mood between episodes'
    ],
    treatment: 'Treatment typically involves mood stabilizing medications, psychotherapy, and lifestyle management. Consistent treatment is essential for managing symptoms.',
    howWeHelp: 'We provide ongoing support and therapy to help you manage mood episodes, develop coping strategies, and maintain stability in your daily life.'
  },
  adhd: {
    title: 'Adult ADHD',
    icon: 'bi-lightning',
    image: adhdImg,
    description: 'Adult ADHD affects focus, organization, and impulse control. Many adults with ADHD have lived with symptoms since childhood.',
    symptoms: [
      'Difficulty focusing and maintaining attention',
      'Impulsivity and hasty decisions',
      'Restlessness and hyperactivity',
      'Poor time management',
      'Difficulty organizing tasks',
      'Forgetfulness in daily activities',
      'Trouble completing tasks',
      'Difficulty following through on commitments'
    ],
    treatment: 'Treatment includes behavioral strategies, organizational skills training, and sometimes medication. Coaching and support groups can also be helpful.',
    howWeHelp: 'We help you develop practical strategies to manage ADHD symptoms, improve focus and organization, and achieve your personal and professional goals.'
  },
  'social-anxiety': {
    title: 'Social Anxiety',
    icon: 'bi-people',
    image: socialAnxietyImg,
    description: 'Social anxiety disorder involves intense fear and anxiety in social situations, often due to fear of being judged or embarrassed.',
    symptoms: [
      'Intense fear of social situations',
      'Worry about embarrassment or humiliation',
      'Avoidance of social interactions',
      'Physical symptoms: blushing, sweating, trembling',
      'Rapid heartbeat in social settings',
      'Difficulty making eye contact',
      'Fear of being the center of attention',
      'Anxiety that interferes with daily life'
    ],
    treatment: 'Cognitive behavioral therapy (CBT) and exposure therapy are highly effective. Social skills training and relaxation techniques also help.',
    howWeHelp: 'Our therapists use proven techniques to help you overcome social fears, build confidence, and develop the skills to navigate social situations comfortably.'
  }
};

const ConditionDetail = () => {
  const { condition } = useParams();
  const data = conditionsData[condition];

  if (!data) {
    return (
      <div className="container py-5">
        <h2>Condition not found</h2>
        <Link to="/" className="btn btn-primary mt-3">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="condition-detail">
      <div className="condition-hero" style={{
        backgroundImage: `url(${data.image})`,
        backgroundColor: '#667eea20'
      }}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="condition-hero-icon">
                <i className={`bi ${data.icon}`}></i>
              </div>
              <h1 className="condition-hero-title">{data.title}</h1>
              <p className="condition-hero-description">{data.description}</p>
            </div>
            <div className="col-lg-4 text-lg-end">
              <Link to="/contact" className="btn btn-primary btn-lg">Get Help Now</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="row">
          <div className="col-lg-8">
            <div className="condition-section">
              <h2 className="section-title">Common Symptoms</h2>
              <ul className="symptoms-list">
                {data.symptoms.map((symptom, index) => (
                  <li key={index}>
                    <i className="bi bi-check-circle-fill"></i>
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="condition-section">
              <h2 className="section-title">Treatment Approaches</h2>
              <p className="section-text">{data.treatment}</p>
            </div>

            <div className="condition-section">
              <h2 className="section-title">How We Can Help</h2>
              <p className="section-text">{data.howWeHelp}</p>
            </div>

            <div className="cta-box">
              <h3>Ready to Start Your Journey?</h3>
              <p>Connect with our experienced counsellors who specialize in treating {data.title.toLowerCase()}.</p>
              <div className="cta-buttons">
                <Link to="/contact" className="btn btn-primary">Book a Consultation</Link>
                <Link to="/" className="btn btn-outline-primary">Learn More</Link>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="sidebar-card">
              <h4>Need Immediate Help?</h4>
              <p>If you're in crisis or need immediate support, please reach out:</p>
              <div className="contact-info">
                <div className="contact-item">
                  <i className="bi bi-telephone-fill"></i>
                  <span>Emergency: 911</span>
                </div>
                <div className="contact-item">
                  <i className="bi bi-chat-dots-fill"></i>
                  <span>Crisis Hotline: 988</span>
                </div>
              </div>
            </div>

            <div className="sidebar-card">
              <h4>Related Resources</h4>
              <ul className="resource-list">
                <li><Link to="/blog">Mental Health Blog</Link></li>
                <li><Link to="/videos">Educational Videos</Link></li>
                <li><Link to="/about">About Our Approach</Link></li>
                <li><Link to="/contact">Contact Us</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConditionDetail;
