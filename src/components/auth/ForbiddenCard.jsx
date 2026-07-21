import { useNavigate } from 'react-router-dom';
import { Button } from '@components/ui';

/**
 * ForbiddenCard — Premium 403 card for insufficient permissions
 * Shown inline when a user lacks required permissions for a specific action
 */
const ForbiddenCard = ({ title = 'Accès refusé', message, className = '' }) => {
  const navigate = useNavigate();

  return (
    <div className={`auth-status ${className}`}>
      <div className="auth-status__icon auth-status__icon--warning">
        <i className="bi bi-shield-x" />
      </div>
      <h2 className="auth-status__title">{title}</h2>
      <p className="auth-status__text">
        {message || 'Vous n\'avez pas les permissions nécessaires pour effectuer cette action.'}
      </p>
      <div className="d-flex gap-3 justify-content-center">
        <Button variant="outline-secondary" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left me-2" />
          Retour
        </Button>
        <Button variant="primary" onClick={() => navigate('/')}>
          <i className="bi bi-house me-2" />
          Accueil
        </Button>
      </div>
    </div>
  );
};

export default ForbiddenCard;
