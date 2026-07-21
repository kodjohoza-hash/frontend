/**
 * AuthIllustration — Left branding panel (55%)
 * Big gradient, logo, bus image, title, 4 checkmarks — all vertically centered
 */

const CHECKMARKS = [
  'Réservation rapide',
  'Paiement sécurisé',
  'Billet numérique',
  'Support 24/7',
];

const AuthIllustration = () => (
  <div className="auth-left">
    <div className="auth-left__orb auth-left__orb--1" />
    <div className="auth-left__orb auth-left__orb--2" />
    <div className="auth-left__orb auth-left__orb--3" />

    <div className="auth-left__content">
      <div className="auth-left__brand">
        <div className="auth-left__logo">
          <i className="bi bi-bus-front-fill" />
        </div>
        <span className="auth-left__name">Bus Tix Connect</span>
      </div>

      <div className="auth-left__visual">
        <img
          src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=900&h=600&fit=crop&q=85"
          alt="Bus moderne de voyage"
          loading="eager"
          width="900"
          height="600"
        />
      </div>

      <h1 className="auth-left__title">
        Réservez vos billets de bus en toute simplicité.
      </h1>

      <ul className="auth-left__features">
        {CHECKMARKS.map((text) => (
          <li key={text} className="auth-left__feature">
            <span className="auth-left__check">
              <i className="bi bi-check-lg" />
            </span>
            {text}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default AuthIllustration;
