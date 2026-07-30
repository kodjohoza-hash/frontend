import { DEV_MODE } from '@config/devMode';
import '@assets/styles/dev-banner.css';

const DevBanner = () => {
  if (!DEV_MODE) return null;

  return (
    <div className="dev-banner">
      <span className="dev-banner__dot">&#9679;</span>
      <span className="dev-banner__text">
        <strong>MODE DÉVELOPPEMENT</strong> — Authentification désactivée temporairement
      </span>
      <a href="/dev" className="dev-banner__link">
        Accéder au portail <i className="bi bi-box-arrow-up-right" />
      </a>
    </div>
  );
};

export default DevBanner;
