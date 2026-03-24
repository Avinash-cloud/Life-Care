import { Link } from 'react-router-dom';

const CareOptionCard = ({ icon, title, description, link, buttonText }) => (
  <div className="care-option-card">
    <div className="care-icon-wrapper">
      <i className={`bi ${icon}`}></i>
    </div>
    <h4 className="mb-3">{title}</h4>
    <p className="text-muted mb-4">{description}</p>
    <Link to={link} className="btn btn-outline-primary w-100">{buttonText}</Link>
  </div>
);

export default CareOptionCard;
