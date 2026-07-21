import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { NAV_LINKS, SERVICE_LINKS, SUPPORT_LINKS, LEGAL_LINKS, CONTACT_INFO } from '@data/footer';
import NewsletterCard from './NewsletterCard';
import FooterLinks from './FooterLinks';
import SocialLinks from './SocialLinks';
import PaymentMethods from './PaymentMethods';
import MobileApps from './MobileApps';
import FooterBottom from './FooterBottom';

const BackToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      className={`btc-back-to-top ${visible ? 'is-visible' : ''}`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Retour en haut"
    >
      <i className="bi bi-chevron-up" />
    </button>
  );
};

const HomeFooter = () => {
  return (
    <>
      <NewsletterCard />

      <footer className="btc-footer">
        <div className="btc-footer-gradient" aria-hidden="true" />
        <div className="container">
          <div className="btc-footer-top">
            {/* Brand Column */}
            <div className="btc-footer-brand-col">
              <Link to="/" className="btc-footer-brand">
                <div className="btc-footer-brand-icon">
                  <i className="bi bi-bus-front-fill" />
                </div>
                <span className="btc-footer-brand-text">Bus Tix Connect</span>
              </Link>
              <p className="btc-footer-brand-desc">
                BUS TIX CONNECT simplifie la réservation de billets de bus en mettant en relation les voyageurs et les compagnies de transport grâce à une plateforme moderne, rapide et sécurisée.
              </p>
              <SocialLinks />
            </div>

            {/* Navigation */}
            <FooterLinks title="Navigation" links={NAV_LINKS} />

            {/* Services */}
            <FooterLinks title="Nos Services" links={SERVICE_LINKS} />

            {/* Support */}
            <FooterLinks title="Support" links={SUPPORT_LINKS} />

            {/* Legal */}
            <FooterLinks title="Informations légales" links={LEGAL_LINKS} />

            {/* Contact */}
            <div className="btc-footer-col">
              <h5 className="btc-footer-heading">Contact</h5>
              <div className="btc-footer-contact-list">
                {CONTACT_INFO.map((c) => (
                  <div key={c.text} className="btc-footer-contact-item">
                    <i className={`bi ${c.icon}`} />
                    {c.href ? (
                      <a href={c.href}>{c.text}</a>
                    ) : (
                      <span>{c.text}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="btc-footer-separator" />
          <PaymentMethods />

          {/* Mobile Apps */}
          <div className="btc-footer-separator" />
          <MobileApps />

          {/* Bottom */}
          <div className="btc-footer-separator" />
          <FooterBottom />
        </div>
      </footer>
      <BackToTop />
    </>
  );
};

export default HomeFooter;
