import './ClinicGallery.css';
import clinic1 from '../../assets/clinic/1.jpg';
import clinic2 from '../../assets/clinic/2.jpg';
import clinic3 from '../../assets/clinic/3.jpg';
import clinic4 from '../../assets/clinic/4.jpg';

const ClinicGallery = () => {
  const clinicPhotos = [
    { id: 1, url: clinic1, alt: 'Clinic Reception' },
    { id: 2, url: clinic2, alt: 'Counselling Room' },
    { id: 3, url: clinic3, alt: 'Waiting Area' },
    { id: 4, url: clinic4, alt: 'Therapy Room' },
  ];

  return (
    <section className="clinic-gallery-section py-5 bg-light">
      <div className="container">
        <div className="text-center mb-5">
          <h6 className="section-subtitle">OUR FACILITIES</h6>
          <h2 className="section-title">Explore Our <span className="text-gradient">Clinic Spaces</span></h2>
          <p className="section-description">Comfortable and professional environments designed for your peace of mind</p>
        </div>
        
        <div className="clinic-grid">
          {clinicPhotos.map((photo, index) => (
            <div key={photo.id} className={`clinic-grid-item item-${index + 1}`}>
              <img src={photo.url} alt={photo.alt} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClinicGallery;
