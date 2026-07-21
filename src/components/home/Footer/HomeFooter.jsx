import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="btc-footer">
        <div className="btc-footer-gradient" aria-hidden="true" />
        <div className="container">
          <div className="btc-footer-top">
            <div className="btc-footer-brand-col">
              <Link to="/" className="btc-footer-brand">
                <div className="btc-footer-brand-icon">
                  <i className="bi bi-bus-front-fill" />
                </div>
                <span className="btc-footer-brand-text">Bus Tix Connect</span>
              </Link>
              <p className="btc-footer-brand-desc">
                La plateforme de référence pour la réservation de billets de bus au Cameroun.
                Voyagez en toute sécurité et tranquillité.
              </p>
              <div className="btc-footer-socials">
                <a href="#" className="btc-footer-social" aria-label="Facebook"><i className="bi bi-facebook" /></a>
                <a href="#" className="btc-footer-social" aria-label="Twitter"><i className="bi bi-twitter-x" /></a>
                <a href="#" className="btc-footer-social" aria-label="Instagram"><i className="bi bi-instagram" /></a>
                <a href="#" className="btc-footer-social" aria-label="LinkedIn"><i className="bi bi-linkedin" /></a>
              </div>
            </div>

            <div className="btc-footer-col">
              <h5 className="btc-footer-heading">Compagnies</h5>
              <nav className="btc-footer-nav">
                <a href="#" className="btc-footer-link">UCT Inter</a>
                <a href="#" className="btc-footer-link">Touristique Express</a>
                <a href="#" className="btc-footer-link">SBT Cruisers</a>
                <a href="#" className="btc-footer-link">CAMBIKO Express</a>
                <a href="#" className="btc-footer-link btc-footer-link--muted">Voir toutes →</a>
              </nav>
            </div>

            <div className="btc-footer-col">
              <h5 className="btc-footer-heading">Destinations</h5>
              <nav className="btc-footer-nav">
                <a href="#" className="btc-footer-link">Douala</a>
                <a href="#" className="btc-footer-link">Yaoundé</a>
                <a href="#" className="btc-footer-link">Bamenda</a>
                <a href="#" className="btc-footer-link">Bafoussam</a>
                <a href="#" className="btc-footer-link">Kribi</a>
              </nav>
            </div>

            <div className="btc-footer-col">
              <h5 className="btc-footer-heading">Support</h5>
              <nav className="btc-footer-nav">
                <a href="#" className="btc-footer-link">Centre d'aide</a>
                <a href="#" className="btc-footer-link">Contactez-nous</a>
                <a href="#" className="btc-footer-link">FAQ</a>
                <a href="#" className="btc-footer-link">Signaler un bug</a>
              </nav>
            </div>

            <div className="btc-footer-col">
              <h5 className="btc-footer-heading">Légal</h5>
              <nav className="btc-footer-nav">
                <a href="#" className="btc-footer-link">Mentions légales</a>
                <a href="#" className="btc-footer-link">Confidentialité</a>
                <a href="#" className="btc-footer-link">Conditions</a>
                <a href="#" className="btc-footer-link">Cookies</a>
              </nav>
            </div>

            <div className="btc-footer-col">
              <h5 className="btc-footer-heading">Contact</h5>
              <div className="btc-footer-contact-list">
                <div className="btc-footer-contact-item">
                  <i className="bi bi-telephone" />
                  <span>+237 6 XX XXX XXX</span>
                </div>
                <div className="btc-footer-contact-item">
                  <i className="bi bi-envelope" />
                  <span>contact@bustixconnect.com</span>
                </div>
                <div className="btc-footer-contact-item">
                  <i className="bi bi-geo-alt" />
                  <span>Douala, Cameroun</span>
                </div>
              </div>
            </div>
          </div>

          <div className="btc-footer-bottom">
            <small className="btc-footer-copyright">
              &copy; {year} Bus Tix Connect. Tous droits réservés.
            </small>
            <div className="btc-footer-bottom-links">
              <a href="#">Confidentialité</a>
              <a href="#">Conditions</a>
              <a href="#">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
      <BackToTop />
    </>
  );
};

export default HomeFooter;
