import { Link } from 'react-router-dom';
import depressionImg from '../../assets/Depression.jpg';
import anxietyImg from '../../assets/Generalised Anxiety Disorder.webp';
import ocdImg from '../../assets/Obsessive Compulsive Disorder.webp';
import bipolarImg from '../../assets/Bipolar Disorder.webp';
import adhdImg from '../../assets/Adult ADHD.jpg';
import socialAnxietyImg from '../../assets/Social Anxiety.jpg';

const ConditionsSection = () => {
  const conditions = [
    {
      id: 1,
      icon: 'bi-cloud-rain',
      title: 'Depression',
      description: 'Do you feel like your sadness just won\'t go away, and it is hard to find a way ahead? We can help.',
      link: '/conditions/depression',
      image: depressionImg
    },
    {
      id: 2,
      icon: 'bi-exclamation-diamond',
      title: 'Generalised Anxiety Disorder',
      description: 'Do you often feel restless, worried or on-edge? Let us help you on how to cope better.',
      link: '/conditions/anxiety',
      image: anxietyImg
    },
    {
      id: 3,
      icon: 'bi-arrow-repeat',
      title: 'Obsessive Compulsive Disorder',
      description: 'Are unwanted thoughts making you anxious and engage in unhelpful behaviours? You can find ways to cope.',
      link: '/conditions/ocd',
      image: ocdImg
    },
    {
      id: 4,
      icon: 'bi-arrow-down-up',
      title: 'Bipolar Disorder',
      description: 'Do you struggle with periods of intense happiness, followed by intense sadness? You can find the care you need with us.',
      link: '/conditions/bipolar',
      image: bipolarImg
    },
    {
      id: 5,
      icon: 'bi-lightning',
      title: 'Adult ADHD',
      description: 'Have you always struggled with difficulty focussing, being restless, or impulsivity? There are ways to manage it better.',
      link: '/conditions/adhd',
      image: adhdImg
    },
    {
      id: 6,
      icon: 'bi-people',
      title: 'Social Anxiety',
      description: 'Do social settings make you anxious and fearful? We can help you cope with social situations better.',
      link: '/conditions/social-anxiety',
      image: socialAnxietyImg
    }
  ];

  return (
    <section className="conditions-section">
      <div className="container">
        <div className="text-center mb-5">
          <h6 className="section-subtitle">MENTAL HEALTH SUPPORT</h6>
          <h2 className="section-title">What are you struggling with?</h2>
          <p className="section-description">We're here to support you with all your mental health needs.</p>
        </div>

        <div className="row g-4">
          {conditions.map(condition => (
            <div className="col-md-6 col-lg-4" key={condition.id}>
              <div className="condition-card">
                <div className="condition-image-wrapper">
                  <img src={condition.image} alt={condition.title} className="condition-image" />
                  <div className="condition-icon-overlay">
                    <i className={`bi ${condition.icon}`}></i>
                  </div>
                </div>
                <div className="condition-content">
                  <h5 className="mb-3">{condition.title}</h5>
                  <p className="text-muted mb-4">{condition.description}</p>
                  <Link to={condition.link} className="condition-link">
                    LEARN MORE <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <div className="connect-card">
            <div className="row align-items-center">
              <div className="col-lg-8 mb-3 mb-lg-0">
                <h3 className="mb-2">Not sure what kind of care you need?</h3>
                <p className="mb-0 lead">Talk to one of our mental health coaches to understand how we can help.</p>
              </div>
              <div className="col-lg-4 text-lg-end">
                <Link to="/contact" className="btn btn-primary btn-lg">Connect With Us</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConditionsSection;