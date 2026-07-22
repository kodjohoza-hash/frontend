import { Link } from 'react-router-dom';
import useAuth from '@hooks/useAuth';

const DbWelcomeCard = () => {
  const { user } = useAuth();
  const firstName = user?.firstName || 'Voyageur';

  return (
    <section className="db-welcome">
      <div className="db-welcome__content">
        <h2 className="db-welcome__heading">
          Bienvenue, <span className="db-welcome__name">{firstName}</span> 👋
        </h2>
        <p className="db-welcome__text">
          Gérez vos réservations et découvrez de nouvelles destinations au Cameroun.
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
