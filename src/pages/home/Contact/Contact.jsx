import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './Contact.css';
import { submitLead } from '../../../services/api';

const Contact = () => {
  const { t } = useTranslation();
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const leadData = {
        fullName: formData.name,
        email: formData.email,
        phoneNumber: formData.phone,
        inquiryType: formData.interest,
        message: formData.message
      };

      await submitLead(leadData);
      setSubmitted(true);

      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '', interest: '', message: '' });
        setSubmitted(false);
      }, 3000);

    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error.message || 'Failed to submit message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        {/* Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="contact-header"
        >
          <h2 className="contact-title">{t('contact.title')}</h2>
          <p className="contact-subtitle">{t('contact.subtitle')}</p>
          <div className="contact-divider" />
        </motion.div>

        {/* Main Layout: Left (Info) - Center (Form) - Right (Hours) */}
        <div className="contact-layout">
          
          {/* 1. LEFT: Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="info-card side-card"
          >
            <h3 className="info-card-title">{t('contact.info.title')}</h3>
            <div className="info-items">
              <div className="info-item">
                <svg className="info-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <p className="info-text">{t('contact.info.address')}</p>
              </div>
              <div className="info-item">
                <svg className="info-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <p className="info-text">{t('contact.info.phone')}</p>
              </div>
              <div className="info-item">
                <svg className="info-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <p className="info-text">{t('contact.info.email')}</p>
              </div>
            </div>
          </motion.div>

          {/* 2. CENTER: Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="contact-form-wrapper"
          >
            <form onSubmit={handleSubmit} className="contact-form">
              <input type="text" name="name" placeholder={t('contact.form.name')} value={formData.name} onChange={handleChange} required className="form-input" />
              <input type="email" name="email" placeholder={t('contact.form.email')} value={formData.email} onChange={handleChange} required className="form-input" />
              <input type="tel" name="phone" placeholder={t('contact.form.phone')} value={formData.phone} onChange={handleChange} required className="form-input" />
              
              <div className="select-wrapper">
                <select name="interest" value={formData.interest} onChange={handleChange} required className="form-select">
                  <option value="" disabled>{t('contact.form.interest')}</option>
                  <option value="buying">{t('contact.form.interestOptions.buying')}</option>
                  <option value="selling">{t('contact.form.interestOptions.selling')}</option>
                  <option value="renting">{t('contact.form.interestOptions.renting')}</option>
                  <option value="land">{t('contact.form.interestOptions.land')}</option>
                  <option value="consulting">{t('contact.form.interestOptions.consulting')}</option>
                </select>
                <svg className="select-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <textarea name="message" placeholder={t('contact.form.message')} value={formData.message} onChange={handleChange} required rows={6} className="form-textarea" />

              <motion.button
                type="submit"
                disabled={loading || submitted}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className={`form-submit-btn ${submitted ? 'success' : ''} ${loading ? 'loading' : ''}`}
              >
                {loading ? t('contact.form.sending') : submitted ? t('contact.form.success') : t('contact.form.submit')}
              </motion.button>
            </form>
          </motion.div>

          {/* 3. RIGHT: Office Hours */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="info-card side-card"
          >
            <h3 className="info-card-title">{t('contact.info.hoursTitle')}</h3>
            <div className="info-items">
              <div className="info-item">
                <svg className="info-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <p className="info-text">{t('contact.info.hours')}</p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Contact;