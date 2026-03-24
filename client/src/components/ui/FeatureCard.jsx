import { Link } from 'react-router-dom';

const FeatureCard = ({ icon, title, description, link }) => (
  <div className="feature-card">
    <div className="feature-icon-wrapper">
      <i className={`bi ${icon}`}></i>
    </div>
    <h5 className="mb-3">{title}</h5>
    <p className="text-muted mb-4">{description}</p>
    {link && <Link to={link} className="feature-link">Learn More <i className="bi bi-arrow-right ms-1"></i></Link>}
  </div>
);

export default FeatureCard;
