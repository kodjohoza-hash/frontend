/**
 * AuthIllustration — Left branding panel for auth split layout
 */
const FEATURES = [
  { icon: 'bi-shield-lock', title: 'Paiement sécurisé', text: 'Transactions 100% protégées' },
  { icon: 'bi-qr-code-scan', title: 'Billet numérique', text: 'Recevez votre ticket instantanément' },
  { icon: 'bi-headset', title: 'Support 24h/24', text: 'Une équipe toujours disponible' },
];

const AuthIllustration = () => (
  <div className="auth-layout__sidebar">
    <div className="auth-layout__sidebar-content">
      <div className="auth-layout__brand">
        <div className="auth-layout__brand-icon">
          <i className="bi bi-bus-front-fill" />
        </div>
        <span className="auth-layout__brand-name">Bus Tix Connect</span>
      </div>

      <div className="auth-layout__hero-image">
        <img
          src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&h=450&fit=crop&q=80"
          alt="Bus moderne de voyage au Cameroun"
          loading="eager"
        />
      </div>

      <h2 className="auth-layout__hero-title">
        Voyagez à travers le Cameroun en toute confiance
      </h2>
      <p className="auth-layout__hero-text">
        Réservez vos billets de bus en ligne, comparez les compagnies et payez en toute sécurité.
      </p>

      <div className="auth-layout__features">
        {FEATURES.map((feature) => (
          <div key={feature.icon} className="auth-layout__feature">
            <div className="auth-layout__feature-icon">
              <i className={`bi ${feature.icon}`} />
            </div>
            <div className="auth-layout__feature-text">
              <h4>{feature.title}</h4>
              <p>{feature.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AuthIllustration;
