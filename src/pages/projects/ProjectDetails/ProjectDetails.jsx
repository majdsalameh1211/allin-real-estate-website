// src/pages/projects/ProjectDetails/ProjectDetails.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Zoom, Keyboard } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/zoom';

import './ProjectDetails.css';

const ProjectDetails = ({ project }) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [swiperInstance, setSwiperInstance] = useState(null);

  // Helper function to get translated field
  const getTranslatedField = (project, field) => {
    const currentLang = i18n.language || 'en';
    if (project?.translations && project.translations[currentLang]) {
      return project.translations[currentLang][field];
    }
    return project?.[field];
  };

  if (!project) {
    return (
      <div className="project-details-empty">
        <p>{t('projectDetails.selectProperty')}</p>
      </div>
    );
  }

  // Combine mainImage and the images array
  const getAllImages = () => {
    const rawImages = [
      project.mainImage,
      ...(project.images || [])
    ].filter(img => img && typeof img === 'string' && img.trim() !== '');

    const uniqueImages = [...new Set(rawImages)];

    return uniqueImages.length > 0
      ? uniqueImages
      : ['https://via.placeholder.com/800x600?text=No+Image'];
  };

  const images = getAllImages();

  const openGallery = (index = 0) => {
    setSelectedImageIndex(index);
    setIsGalleryOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
    document.body.style.overflow = 'auto';
    setSwiperInstance(null);
  };

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
    if (swiperInstance) {
      swiperInstance.slideTo(index);
    }
  };

  const previewImages = images.slice(0, 4);

  return (
    <>
      <motion.div
        key={project.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="project-details"
      >

        {/* Single Hero Image */}
        <div className="project-details-hero-image" onClick={() => openGallery(0)}>
          <img src={images[0]} alt={getTranslatedField(project, 'title')} />
          {images.length > 1 && (
            <div className="image-gallery-badge">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
              +{images.length - 1} {t('projectDetails.moreImages')}
            </div>
          )}
        </div>

        {/* Property Info */}
        {/* Property Info - Two Column Grid */}
        <div className="project-details-info-grid">
          {/* Left Column */}
          <div className="info-column-left">
            <div className="details-header">
              {project.badge && (
                <span className="details-badge">{project.badge.toUpperCase()}</span>
              )}
              <h2 className="details-title">{getTranslatedField(project, 'title') || t('projectDetails.untitledProperty')}</h2>
              <p className="details-location">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {getTranslatedField(project, 'location') || t('projectDetails.locationNotSpecified')}
              </p>
            </div>

            {(project.price > 0 || project.pricePerMonth > 0) && (
              <div className="details-price">
                <span className="price-value">
                  {project.currency === 'ILS' ? '₪' : project.currency === 'USD' ? '$' : '€'}
                  {project.pricePerMonth
                    ? `${project.pricePerMonth.toLocaleString()}/mo`
                    : project.price.toLocaleString()
                  }
                </span>
              </div>
            )}

            <div className="details-specs">
              {project.bedrooms > 0 && (
                <span className="spec-chip">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  {project.bedrooms} {t('projectDetails.beds')}
                </span>
              )}
              {project.bathrooms > 0 && (
                <span className="spec-chip">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  {project.bathrooms} {t('projectDetails.baths')}
                </span>
              )}
              {project.area > 0 && (
                <span className="spec-chip">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                  {project.area} {project.areaUnit || 'sqm'}
                </span>
              )}
            </div>

            <div className="details-type">
              <span className="type-badge">
                {project.type === 'forSale' ? t('projectDetails.forSale') :
                  project.type === 'forRent' ? t('projectDetails.forRent') :
                    t('projectDetails.sold')}
              </span>
            </div>

            {getTranslatedField(project, 'shortDesc') && (
              <p className="details-short-desc">{getTranslatedField(project, 'shortDesc')}</p>
            )}

            <button
              className="contact-btn-full"
              onClick={() => navigate('/', { state: { scrollTo: 'contact' } })}
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              {t('projectDetails.contact')}
            </button>
          </div>

          {/* Right Column */}
          <div className="info-column-right">
            {getTranslatedField(project, 'fullDesc') && (
              <div className="details-description">
                <h3 className="details-section-title">{t('projectDetails.description')}</h3>
                <p className="details-text">{getTranslatedField(project, 'fullDesc')}</p>
              </div>
            )}

            {getTranslatedField(project, 'features') && getTranslatedField(project, 'features').length > 0 && (
              <div className="details-features">
                <h3 className="details-section-title">{t('projectDetails.features')}</h3>
                <ul className="features-list-two-column">
                  {getTranslatedField(project, 'features').map((feature, index) => (
                    <li key={index} className="feature-item">
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Full-Screen Gallery Modal */}
      <AnimatePresence>
        {isGalleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="gallery-modal"
            onClick={closeGallery}
          >
            <div className="gallery-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="gallery-close-btn" onClick={closeGallery}>
                <svg width="24" height="24" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              <div className="gallery-modal-main">
                <Swiper
                  // 1. ADDED: CSS variables for arrows and pagination
                  style={{
                    '--swiper-navigation-color': '#D4AF37',
                    '--swiper-pagination-color': '#D4AF37',
                  }}
                  modules={[Navigation, Pagination, Zoom, Keyboard]}
                  initialSlide={selectedImageIndex}
                  onSwiper={setSwiperInstance}
                  onSlideChange={(swiper) => setSelectedImageIndex(swiper.activeIndex)}
                  spaceBetween={30}
                  slidesPerView={1}
                  navigation={true}
                  pagination={{ clickable: true, dynamicBullets: true }}
                  zoom={true}
                  keyboard={{ enabled: true }}
                  grabCursor={true} // 2. ADDED: Enables mouse dragging cursor
                  className="project-gallery-swiper"
                >
                  {images.map((image, index) => (
                    <SwiperSlide key={index}>
                      <div className="swiper-zoom-container">
                        <img
                          src={image}
                          alt={`${getTranslatedField(project, 'title')} - Image ${index + 1}`}
                          draggable="false" // 3. ADDED: Prevents native browser drag
                          onDragStart={(e) => e.preventDefault()} // 4. ADDED: Ensures Swiper handles the drag
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="gallery-modal-thumbnails">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => handleThumbnailClick(index)}
                      className={`modal-thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                    >
                      <img src={image} alt={`Thumbnail ${index + 1}`} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ProjectDetails;