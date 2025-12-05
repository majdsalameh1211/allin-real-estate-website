import { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero = () => {
  const { t } = useTranslation();
  const videoRef = useRef(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      // CRITICAL: Force muted state for Mobile Browsers
      // (React props sometimes lag behind browser policy checks)
      videoElement.muted = true;
      videoElement.defaultMuted = true;
      videoElement.playsInline = true;

      // Attempt to play
      const playPromise = videoElement.play();

      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log("Autoplay prevented:", error);
          // Auto-play failed (likely Low Power Mode active). 
          // You could show a "Play" button here if strictly needed.
        });
      }
    }
  }, []);
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero-section">
      {/* Background Video Layer */}
      <div className="video-container">
        <video
          ref={videoRef}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          {/* Replace with your actual video path */}
          <source src="/Sl_01_Ar-optimized.mp4" type="video/mp4" />
          <source src="/videos/hero-video.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>

        {/* Dark Overlay for text readability */}
        <div className="video-overlay" />

        {/* Animated Pattern Overlay (your existing effect) */}
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="pattern-overlay"
        />
      </div>

      {/* Content Layer - BRIGHT TEXT on DARK background */}
      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="content-card"
        >
          {/* Logo - BRIGHT on DARK */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="hero-logo-section"
          >
            <div className="hero-logo-text">


              {/* Logo on top */}
              <img
                src="logo-optimized.png"   // <-- replace with your logo path
                alt="Brand Logo"
                style={{
                  height: "4rem",       // matches text height
                  width: "auto"
                }}
              />

              {/* Text below it */}
              <div>
                <span className="logo-all">ALL</span>
                <span className="logo-in"> IN</span>
              </div>

            </div>

            <div className="logo-divider" />
          </motion.div>

          {/* Tagline - WHITE TEXT */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="hero-tagline"
          >
            {t('hero.tagline')}
          </motion.h2>

          {/* Subtitle - LIGHT GRAY TEXT */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="hero-subtitle"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* Location - GOLD TEXT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="hero-location"
          >
            <svg className="location-icon" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="location-text">{t('hero.location')}</span>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.5 }}
            className="hero-buttons"
          >
            <button
              onClick={() => scrollToSection('contact')}
              className="btn-primary"
            >
              {t('hero.cta1')}
            </button>
            <button
              onClick={() => scrollToSection('portfolio')}
              className="btn-secondary"
            >
              {t('hero.cta2')}
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator - GOLD on DARK */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2 }}
        className="scroll-indicator"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="scroll-content"
          onClick={() => scrollToSection('about')}
        >
          <span className="scroll-text">
            {t('hero.scroll')}
          </span>
          <svg className="scroll-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;