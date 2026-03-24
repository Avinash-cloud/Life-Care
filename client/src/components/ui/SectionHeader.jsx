const SectionHeader = ({ subtitle, title, description, centered = true }) => (
  <div className={`${centered ? 'text-center' : ''} mb-5`}>
    {subtitle && <h6 className="section-subtitle">{subtitle}</h6>}
    <h2 className="section-title">{title}</h2>
    {description && <p className="section-description">{description}</p>}
  </div>
);

export default SectionHeader;
