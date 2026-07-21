/**
 * AuthIllustration — Left branding panel for auth split layout
 * Premium design: logo, slogan, 6 advantages, 4 stats — no external images
 */

const ADVANTAGES = [
  { icon: 'bi-shield-lock', title: 'Paiement sécurisé', desc: 'Transactions 100% protégées' },
  { icon: 'bi-qr-code-scan', title: 'Billet numérique', desc: 'Ticket instantané sur mobile' },
  { icon: 'bi-headset', title: 'Support 24h/24', desc: 'Une équipe toujours disponible' },
  { icon: 'bi-tag-heart', title: 'Meilleurs prix', desc: 'Comparez les meilleures offres' },
  { icon: 'bi-geo-alt', title: 'Couverture nationale', desc: '+50 destinations au Cameroun' },
  { icon: 'bi-lightning', title: 'Simple et rapide', desc: 'Réservez en 3 clics' },
];

const STATS = [
  { value: '500K+', label: 'Voyageurs' },
  { value: '50+', label: 'Compagnies' },
  { value: '200+', label: 'Routes' },
  { value: '4.8/5', label: 'Note' },
];

const AuthIllustration = () => (
  <div className="auth-layout__sidebar">
    <div className="auth-layout__orb auth-layout__orb--1" />
    <div className="auth-layout__orb auth-layout__orb--2" />
    <div className="auth-layout__orb auth-layout__orb--3" />

    <div className="auth-layout__sidebar-content">
      <div className="auth-layout__brand">
        <div className="auth-layout__brand-icon">
          <i className="bi bi-bus-front-fill" />
        </div>
        <span className="auth-layout__brand-name">Bus Tix Connect</span>
      </div>

      <p className="auth-layout__slogan">
        Votre passerelle vers tout le Cameroun
      </p>

      <div className="auth-layout__advantages">
        {ADVANTAGES.map((item) => (
          <div key={item.icon} className="auth-layout__advantage">
            <div className="auth-layout__advantage-icon">
              <i className={`bi ${item.icon}`} />
            </div>
            <div className="auth-layout__advantage-text">
              <h4>{item.title}</h4>
              <p>{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="auth-layout__stats">
        {STATS.map((stat) => (
          <div key={stat.label} className="auth-layout__stat">
            <span className="auth-layout__stat-value">{stat.value}</span>
            <span className="auth-layout__stat-label">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default AuthIllustration;
