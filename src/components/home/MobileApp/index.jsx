import { useInView } from '@hooks/useLandingPage';

const MobileAppSection = () => {
  const [ref, isInView] = useInView({ threshold: 0.1 });

  return (
    <section className="btc-mobile-app" ref={ref} aria-label="Application mobile">
      <div className="container">
        <div className="btc-mobile-app-card">
          <div className="btc-mobile-app-deco" aria-hidden="true">
            <div className="btc-mobile-app-deco-1" />
            <div className="btc-mobile-app-deco-2" />
          </div>
          <div className="row align-items-center g-4 g-lg-5">
            <div className="col-lg-6">
              <div className={`btc-mobile-app-content ${isInView ? 'is-visible' : ''}`}>
                <span className="btc-section-badge">
                  <i className="bi bi-phone" /> Application mobile
                </span>
                <h2 className="btc-mobile-app-title">
                  Votre billet de bus<br />
                  <span className="btc-mobile-app-accent">dans votre poche</span>
                </h2>
                <p className="btc-mobile-app-text">
                  Téléchargez l'application Bus Tix Connect et réservez vos billets
                  où que vous soyez. Recevez votre billet numérique directement
                  sur votre téléphone.
                </p>
                <div className="btc-mobile-app-features">
                  <div className="btc-mobile-app-feat">
                    <i className="bi bi-check-circle-fill" />
                    <span>Réservation en quelques secondes</span>
                  </div>
                  <div className="btc-mobile-app-feat">
                    <i className="bi bi-check-circle-fill" />
                    <span>Billet numérique hors-ligne</span>
                  </div>
                  <div className="btc-mobile-app-feat">
                    <i className="bi bi-check-circle-fill" />
                    <span>Notifications en temps réel</span>
                  </div>
                  <div className="btc-mobile-app-feat">
                    <i className="bi bi-check-circle-fill" />
                    <span>Historique de voyages</span>
                  </div>
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
            </div>
            <div className="col-lg-6 d-flex justify-content-center">
              <div className={`btc-mobile-app-visual ${isInView ? 'is-visible' : ''}`}>
                <div className="btc-mobile-phone">
                  <div className="btc-mobile-phone-notch" />
                  <div className="btc-mobile-phone-screen">
                    <div className="btc-phone-header">
                      <i className="bi bi-bus-front-fill" />
                      <span>Bus Tix Connect</span>
                    </div>
                    <div className="btc-phone-card">
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
                  </div>
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
