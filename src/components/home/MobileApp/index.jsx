import { useInView } from '@hooks/useLandingPage';

const FEATURES = [
  { icon: 'bi-bolt-fill', text: 'Réservation en quelques secondes' },
  { icon: 'bi-wifi-off', text: 'Billet numérique hors-ligne' },
  { icon: 'bi-bell-fill', text: 'Notifications en temps réel' },
  { icon: 'bi-clock-history', text: 'Historique de voyages' },
];

const MobileAppSection = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section className="btc-mobile-app" ref={ref} aria-label="Application mobile">
      <div className="btc-mobile-app-deco" aria-hidden="true">
        <div className="btc-mobile-app-deco-orb btc-mobile-app-deco-orb--1" />
        <div className="btc-mobile-app-deco-orb btc-mobile-app-deco-orb--2" />
      </div>

      <div className="container">
        <div className={`btc-mobile-app-card ${isInView ? 'is-visible' : ''}`}>
          <div className="btc-mobile-app-content">
            <span className="btc-section-badge">
              <i className="bi bi-phone" /> Application mobile
            </span>
            <h2 className="btc-mobile-app-title">
              Votre billet de bus<br />
              <span className="text-accent">dans votre poche</span>
            </h2>
            <p className="btc-mobile-app-text">
              Téléchargez l'application Bus Tix Connect et réservez vos billets
              où que vous soyez. Recevez votre billet numérique directement
              sur votre téléphone.
            </p>
            <div className="btc-mobile-app-features">
              {FEATURES.map((f) => (
                <div key={f.text} className="btc-mobile-app-feat">
                  <i className={`bi ${f.icon}`} />
                  <span>{f.text}</span>
                </div>
              ))}
            </div>
            <div className="btc-mobile-app-buttons">
              <button className="btc-app-store-btn">
                <i className="bi bi-apple" />
                <div>
                  <small>Télécharger sur</small>
                  <strong>App Store</strong>
                </div>
              </button>
              <button className="btc-app-store-btn">
                <i className="bi bi-google-play" />
                <div>
                  <small>Disponible sur</small>
                  <strong>Google Play</strong>
                </div>
              </button>
            </div>
          </div>

          <div className="btc-mobile-app-visual">
            <div className="btc-mobile-phone">
              <div className="btc-mobile-phone-notch" />
              <div className="btc-mobile-phone-screen">
                <div className="btc-phone-header">
                  <i className="bi bi-bus-front-fill" />
                  <span>Bus Tix Connect</span>
                </div>
                <div className="btc-phone-card btc-phone-card--active">
                  <div className="btc-phone-status">
                    <i className="bi bi-check-circle-fill" /> Confirmé
                  </div>
                  <div className="btc-phone-route">
                    <span>Yaoundé</span>
                    <i className="bi bi-arrow-right" />
                    <span>Douala</span>
                  </div>
                  <div className="btc-phone-info">
                    <span><i className="bi bi-calendar" /> 25 Juil 2026</span>
                    <span><i className="bi bi-clock" /> 08:30</span>
                  </div>
                  <div className="btc-phone-price">3 000 FCFA</div>
                </div>
                <div className="btc-phone-card">
                  <div className="btc-phone-status btc-phone-status--pending">
                    <i className="bi bi-hourglass-split" /> En attente
                  </div>
                  <div className="btc-phone-route">
                    <span>Douala</span>
                    <i className="bi bi-arrow-right" />
                    <span>Bamenda</span>
                  </div>
                  <div className="btc-phone-info">
                    <span><i className="bi bi-calendar" /> 2 Août 2026</span>
                    <span><i className="bi bi-clock" /> 14:00</span>
                  </div>
                  <div className="btc-phone-price">4 500 FCFA</div>
                </div>
                <div className="btc-phone-nav">
                  <i className="bi bi-house-fill btc-phone-nav--active" />
                  <i className="bi bi-ticket-perforated" />
                  <i className="bi bi-bell" />
                  <i className="bi bi-person" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MobileAppSection;
