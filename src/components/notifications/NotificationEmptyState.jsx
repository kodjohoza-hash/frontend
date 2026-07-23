import { Link } from 'react-router-dom';
import { ROUTES } from '@routes/routeConstants';

const NotificationEmptyState = ({ isFiltered }) => {
  return (
    <div className="nf-empty">
      <div className="nf-empty__visual">
        <div className="nf-empty__bell">
          <i className="bi bi-bell-slash" />
        </div>
        <div className="nf-empty__float-icons">
          <i className="bi bi-envelope-open nf-empty__float-icon nf-empty__float-icon--1" />
          <i className="bi bi-check-circle nf-empty__float-icon nf-empty__float-icon--2" />
          <i className="bi bi-tag nf-empty__float-icon nf-empty__float-icon--3" />
        </div>
      </div>
      <h3 className="nf-empty__title">
        {isFiltered ? 'Aucun résultat' : 'Aucune notification'}
      </h3>
      <p className="nf-empty__text">
        {isFiltered
          ? 'Aucune notification ne correspond à vos filtres. Essayez de modifier vos critères de recherche.'
          : 'Vous n\'avez pas encore de notifications. Elles apparaîtront ici lorsque vous aurez de l\'activité sur votre compte.'}
      </p>
      <Link to={ROUTES.CLIENT_DASHBOARD} className="nf-btn nf-btn--primary">
        <i className="bi bi-arrow-left" />
        Retour au Dashboard
      </Link>
    </div>
  );
};

export default NotificationEmptyState;
