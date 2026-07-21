import { memo } from 'react';

const MobileApps = memo(() => (
  <div className="btc-footer-apps">
    <h5 className="btc-footer-heading">Application mobile</h5>
    <p className="btc-footer-apps-text">
      Téléchargez bientôt notre application mobile
    </p>
    <div className="btc-footer-apps-buttons">
      <button className="btc-footer-app-btn" type="button" aria-label="Application bientot disponible sur Google Play">
        <i className="bi bi-google-play" />
        <div>
          <small>Disponible sur</small>
          <strong>Google Play</strong>
        </div>
      </button>
      <button className="btc-footer-app-btn" type="button" aria-label="Application bientot disponible sur App Store">
        <i className="bi bi-apple" />
        <div>
          <small>Télécharger sur</small>
          <strong>App Store</strong>
        </div>
      </button>
    </div>
  </div>
));

MobileApps.displayName = 'MobileApps';
export default MobileApps;
