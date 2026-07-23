import { Link } from 'react-router-dom';
import { ROUTES } from '@routes/routeConstants';

const ReservationEmptyState = () => {
  return (
    <div className="rv-empty">
      <div className="rv-empty__visual">
        <div className="rv-empty__icon">
          <i className="bi bi-ticket-perforated" />
        </div>
        <div className="rv-empty__floats">
          <div className="rv-empty__float rv-empty__float--1">
            <i className="bi bi-bus-front" />
          </div>
          <div className="rv-empty__float rv-empty__float--2">
            <i className="bi bi-geo-alt" />
          </div>
          <div className="rv-empty__float rv-empty__float--3">
            <i className="bi bi-calendar-check" />
          </div>
        </div>
      </div>
      <h3 className="rv-empty__title">Aucune réservation</h3>
      <p className="rv-empty__desc">
        Vous n'avez encore effectué aucune réservation. Réservez votre premier voyage et commencez l'aventure !
      </p>
      <Link to="/" className="rv-empty__btn">
        <i className="bi bi-plus-circle" />
        Réserver votre premier voyage
      </Link>
    </div>
  );
};

export default ReservationEmptyState;
