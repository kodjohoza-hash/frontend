import { Link } from 'react-router-dom';
import { user } from '@data/clientDashboard';

const DbWelcomeCard = () => {
  return (
    <section className="db-welcome">
      <div className="db-welcome__content">
        <h2 className="db-welcome__heading">
          Bienvenue, <span className="db-welcome__name">{user.firstName}</span> 👋
        </h2>
        <p className="db-welcome__text">
          Vous avez <strong>3 trajets à venir</strong>. Gérez vos réservations et découvrez de nouvelles destinations.
        </p>
        <Link to="/booking/search" className="db-welcome__cta">
          <i className="bi bi-search" />
          <span>Rechercher un trajet</span>
        </Link>
      </div>
      <div className="db-welcome__visual">
        <div className="db-welcome__bus">🚌</div>
        <div className="db-welcome__dots">
          <span /><span /><span />
        </div>
      </div>
    </section>
  );
};

export default DbWelcomeCard;
