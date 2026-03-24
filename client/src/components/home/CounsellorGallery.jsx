import './CounsellorGallery.css';
import counsellor1 from '../../assets/counsilars/1.jpg';
import counsellor2 from '../../assets/counsilars/2.jpg';
import counsellor3 from '../../assets/counsilars/3.jpg';
import counsellor4 from '../../assets/counsilars/4.jpg';

const CounsellorGallery = () => {
  const counsellorImages = [
    { id: 1, url: counsellor1, alt: 'Counsellor 1' },
    { id: 2, url: counsellor2, alt: 'Counsellor 2' },
    { id: 3, url: counsellor3, alt: 'Counsellor 3' },
    { id: 4, url: counsellor4, alt: 'Counsellor 4' },
  ];

  return (
    <section className="counsellor-gallery-section py-5">
      <div className="container">
        <div className="text-center mb-5">
          <h6 className="section-subtitle">OUR SESSIONS</h6>
          <h2 className="section-title">Glimpse of <span className="text-gradient">Live Session</span></h2>
        </div>
        <div className="counsellor-grid">
          {counsellorImages.map((image, index) => (
            <div key={image.id} className={`counsellor-grid-item item-${index + 1}`}>
              <img src={image.url} alt={image.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CounsellorGallery;
