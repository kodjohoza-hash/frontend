import BenefitsSection from './BenefitsSection';
import StatsSection from './StatsSection';

/**
 * AuthLeftPanel — Marketing panel (50%)
 * Structure: logo → badge → title → description → bus image → benefits → stats
 */
const AuthLeftPanel = () => (
  <div className="auth-left">
    <div className="auth-left__bg">
      <div className="auth-left__orb auth-left__orb--1" />
      <div className="auth-left__orb auth-left__orb--2" />
      <div className="auth-left__orb auth-left__orb--3" />
      <div className="auth-left__mesh" />
    </div>

    <div className="auth-left__content">
      <div className="auth-left__brand">
        <div className="auth-left__logo">
          <i className="bi bi-bus-front-fill" />
        </div>
        <span className="auth-left__name">Bus Tix Connect</span>
      </div>

      <div className="auth-left__badge">
        <i className="bi bi-trophy-fill" />
        Plateforme N°1 de réservation de billets de bus au Cameroun
      </div>

      <h1 className="auth-left__title">
        Voyagez en toute <span className="auth-left__highlight">confiance</span><br />
        et en toute sérénité.
      </h1>

      <p className="auth-left__desc">
        Réservez vos billets de bus en quelques clics.<br />
        Comparez les compagnies.<br />
        Recevez votre billet numérique immédiatement.
      </p>

      <div className="auth-left__visual">
        <img
          src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1000&h=700&fit=crop&q=85"
          alt="Bus moderne de voyage au Cameroun"
          loading="eager"
          width="1000"
          height="700"
        />
      </div>

      <BenefitsSection />
      <StatsSection />
    </div>
  </div>
);

export default AuthLeftPanel;
