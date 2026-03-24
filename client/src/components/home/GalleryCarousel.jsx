import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { cmsAPI } from '../../services/api';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const GalleryCarousel = () => {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const res = await cmsAPI.getGallery({ limit: 10 });
      setGallery(res.data.data || []);
    } catch (err) {
      console.error('Failed to load gallery:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!gallery.length) return null;

  return (
    <section className="py-5 gallery-carousel-section">
      <div className="container">
        <div className="text-center mb-5">
          <h6 className="section-subtitle">OUR GALLERY</h6>
          <h2 className="section-title mobile-h2">Explore Our <span className="text-gradient">Moments</span></h2>
          <p className="section-description">Take a visual tour through our facilities and events</p>
        </div>
        
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={30}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          loop={true}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 }
          }}
          className="gallery-swiper"
        >
          {gallery.map((item) => (
            <SwiperSlide key={item._id}>
              <div className="gallery-slide">
                <img 
                  src={item.imageUrl} 
                  alt={item.title}
                  className="gallery-slide-img"
                />
                <div className="gallery-slide-overlay">
                  <h5>{item.title}</h5>
                  <span className="badge bg-primary">{item.category}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default GalleryCarousel;
