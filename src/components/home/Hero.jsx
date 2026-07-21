import { useState } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const scrollToSearch = () => {
    const el = document.querySelector('#search');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="btc-hero" aria-label="Bienvenue sur Bus Tix Connect">
      <div className="btc-hero-deco" aria-hidden="true">
        <div className="btc-hero-deco-orb btc-hero-deco-orb--1" />
        <div className="btc-hero-deco-orb btc-hero-deco-orb--2" />
        <div className="btc-hero-deco-orb btc-hero-deco-orb--3" />
      </div>

      <div className="btc-hero-container">
        <div className="btc-hero-grid">
          {/* Left — Content */}
          <div className="btc-hero-content">
            <div className="btc-hero-badge">
              <i className="bi bi-shield-fill-check" />
              Plateforme n°1 de réservation de bus au Cameroun
            </div>

            <h1 className="btc-hero-title">
              Voyagez en toute{' '}
              <span className="btc-hero-title-accent">confiance</span>
              {' '}et en toute{' '}
              <span className="btc-hero-title-accent">sérénité</span>
            </h1>

            <p className="btc-hero-subtitle">
              Comparez les compagnies, réservez votre place en quelques clics
              et recevez votre billet numérique instantanément.
            </p>

            <div className="btc-hero-actions">
              <button className="btc-btn-solid-orange btc-hero-btn-primary" onClick={scrollToSearch}>
                <i className="bi bi-search me-2" />
                Réserver maintenant
              </button>
              <Link to="/register" className="btc-btn-white-outline">
                <i className="bi bi-person-plus me-2" />
                Créer un compte
              </Link>
            </div>

            <div className="btc-hero-trust">
              <div className="btc-hero-trust-item">
                <div className="btc-hero-trust-icon">
                  <i className="bi bi-shield-fill-check" />
                </div>
                <div>
                  <span className="btc-hero-trust-label">Paiement sécurisé</span>
                  <span className="btc-hero-trust-sub">SSL 256-bit</span>
                </div>
              </div>
              <div className="btc-hero-trust-divider" />
              <div className="btc-hero-trust-item">
                <div className="btc-hero-trust-icon">
                  <i className="bi bi-headset" />
                </div>
                <div>
                  <span className="btc-hero-trust-label">Support 24/7</span>
                  <span className="btc-hero-trust-sub">À vos côtés</span>
                </div>
              </div>
              <div className="btc-hero-trust-divider" />
              <div className="btc-hero-trust-item">
                <div className="btc-hero-trust-icon">
                  <i className="bi bi-qr-code" />
                </div>
                <div>
                  <span className="btc-hero-trust-label">Billet numérique</span>
                  <span className="btc-hero-trust-sub">Instantané</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Bus Image */}
          <div className="btc-hero-visual">
            <div className="btc-hero-img-wrapper">
              {!imageLoaded && <div className="btc-hero-img-skeleton" />}
              <img
                src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1100&h=800&fit=crop&q=85"
                alt="Bus moderne de voyage longue distance"
                className={`btc-hero-img ${imageLoaded ? 'is-loaded' : ''}`}
                loading="eager"
                fetchPriority="high"
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1100&h=800&fit=crop&q=85';
                  setImageLoaded(true);
                }}
              />
            </div>

            {/* Floating cards */}
            <div className="btc-hero-float btc-hero-float--trips">
              <div className="btc-hero-float-icon btc-hero-float-icon--accent">
                <i className="bi bi-bus-front" />
              </div>
              <div>
                <div className="btc-hero-float-value">420+</div>
                <div className="btc-hero-float-label">Voyages/jour</div>
              </div>
            </div>

            <div className="btc-hero-float btc-hero-float--rating">
              <div className="btc-hero-float-stars">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className="bi bi-star-fill" />
                ))}
              </div>
              <div className="btc-hero-float-text">4.9/5 — 12 000+ avis</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
