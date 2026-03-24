const TestimonialCard = ({ name, role, rating, text, avatar }) => (
  <div className="testimonial-card">
    <div className="d-flex justify-content-between mb-4">
      <div className="text-warning">
        {[...Array(Math.floor(rating))].map((_, i) => <i key={i} className="bi bi-star-fill"></i>)}
        {rating % 1 !== 0 && <i className="bi bi-star-half"></i>}
      </div>
    </div>
    <p className="testimonial-text">"{text}"</p>
    <div className="d-flex align-items-center">
      <img src={`https://placehold.co/50x50?text=${avatar}`} className="rounded-circle me-3" alt={name} />
      <div>
        <h6 className="testimonial-author mb-0">{name}</h6>
        <small className="testimonial-role">{role}</small>
      </div>
    </div>
  </div>
);

export default TestimonialCard;
