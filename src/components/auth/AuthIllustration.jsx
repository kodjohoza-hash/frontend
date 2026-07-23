import AppLogo from '@components/common/AppLogo';

/**
 * AuthIllustration — Left marketing panel (50%)
 * Premium gradient, bus image, badge, title, features, stats
 */

const FEATURES = [
  'Paiement sécurisé',
  'Billet numérique',
  'Réservation rapide',
  'Support 24/7',
  'Plus de 100 compagnies',
  'Des milliers de voyageurs satisfaits',
];

const STATS = [
  { value: '100+', label: 'Compagnies partenaires' },
  { value: '500+', label: 'Voyages quotidiens' },
  { value: '50 000+', label: 'Voyageurs satisfaits' },
  { value: '25+', label: 'Villes desservies' },
];

const AuthIllustration = () => (
  <div className="auth-left">
    <div className="auth-left__bg">
      <div className="auth-left__orb auth-left__orb--1" />
      <div className="auth-left__orb auth-left__orb--2" />
      <div className="auth-left__orb auth-left__orb--3" />
      <div className="auth-left__mesh" />
    </div>

    <div className="auth-left__content">
      <div className="auth-left__brand">
        <AppLogo size={40} variant="horizontal" textClassName="auth-left__name" />
      </div>

      <div className="auth-left__badge">
        <i className="bi bi-trophy-fill" />
        Plateforme N°1 de réservation de billets de bus au Cameroun
      </div>

      <div className="auth-left__visual">
        <img
          src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1000&h=700&fit=crop&q=85"
          alt="Bus moderne de voyage au Cameroun"
          loading="eager"
          width="1000"
          height="700"
        />
      </div>

      <h1 className="auth-left__title">
        Voyagez en toute confiance et en toute sérénité.
      </h1>

      <p className="auth-left__desc">
        Réservez vos billets en quelques clics. Comparez les compagnies. Recevez votre billet numérique immédiatement.
      </p>

      <div className="auth-left__features">
        {FEATURES.map((text) => (
          <div key={text} className="auth-left__feature">
            <span className="auth-left__check"><i className="bi bi-check2" /></span>
            <span>{text}</span>
          </div>
        ))}
      </div>

      <div className="auth-left__stats">
        {STATS.map((stat) => (
          <div key={stat.label} className="auth-left__stat">
            <span className="auth-left__stat-value">{stat.value}</span>
            <span className="auth-left__stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AuthIllustration;
