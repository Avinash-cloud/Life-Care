const IconCard = ({ icon, title, description }) => (
  <div className="why-card">
    <div className="icon-wrapper">
      <i className={`bi ${icon}`}></i>
    </div>
    <h5 className="mb-3">{title}</h5>
    <p className="text-muted">{description}</p>
  </div>
);

export default IconCard;
