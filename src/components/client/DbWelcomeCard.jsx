import { Link } from 'react-router-dom';
import useAuth from '@hooks/useAuth';

const DbWelcomeCard = () => {
  const { user } = useAuth();
  const firstName = user?.firstName || 'Voyageur';

  return (
    <section className="db-welcome">
      <div className="db-welcome__content">
        <h2 className="db-welcome__heading">
          Bienvenue, <span className="db-welcome__name">{firstName}</span>
        </h2>
        <p className="db-welcome__text">
          Gérez vos réservations et découvrez de nouvelles destinations au Cameroun.
        </p>
        <div className="db-welcome__actions">
          <Link to="/booking/search" className="db-welcome__cta">
            <i className="bi bi-search" />
            Rechercher un trajet
          </Link>
          <Link to="/client/bookings/create" className="db-welcome__cta db-welcome__cta--outline">
            <i className="bi bi-plus-lg" />
            Nouvelle réservation
          </Link>
        </div>
      </div>
      <div className="db-welcome__visual">
        <div className="db-welcome__bus">
          <i className="bi bi-bus-front-fill" />
        </div>
        <div className="db-welcome__stats-mini">
          <div className="db-welcome__stat">
            <span className="db-welcome__stat-value">45+</span>
            <span className="db-welcome__stat-label">Destinations</span>
          </div>
          <div className="db-welcome__stat-divider" />
          <div className="db-welcome__stat">
            <span className="db-welcome__stat-value">12</span>
            <span className="db-welcome__stat-label">Compagnies</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DbWelcomeCard;
