import { Link } from 'react-router-dom';
import { ROUTES } from '@routes/routeConstants';

const TkTicketEmptyState = () => (
  <div className="tk-empty">
    <div className="tk-empty__visual">
      <div className="tk-empty__ticket-icon">
        <i className="bi bi-ticket-perforated" />
      </div>
      <div className="tk-empty__bus-anim">🚌</div>
    </div>
    <h3 className="tk-empty__title">Aucun billet trouvé</h3>
    <p className="tk-empty__text">
      Vous n'avez encore aucun billet électronique. Réservez votre prochain voyage dès maintenant !
    </p>
    <Link to="/booking/search" className="tk-empty__cta">
      <i className="bi bi-search" />
      Réserver un voyage
    </Link>
  </div>
);

export default TkTicketEmptyState;
