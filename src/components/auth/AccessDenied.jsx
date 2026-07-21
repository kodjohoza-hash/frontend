import { useNavigate } from 'react-router-dom';
import useAuth from '@hooks/useAuth';
import { getRoleDashboard } from '@utils/roles';
import { Button } from '@components/ui';

/**
 * AccessDenied — Full-page 403 error with premium design
 * Shown when user is authenticated but lacks permissions
 */
const AccessDenied = () => {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const dashboard = getRoleDashboard(role);

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ background: 'var(--bg-page)' }}>
      <div className="text-center" style={{ maxWidth: 480, padding: 'var(--space-8)' }}>
        <div
          className="mx-auto mb-4"
          style={{
            width: 96,
            height: 96,
            borderRadius: 'var(--radius-2xl)',
            background: 'var(--color-danger-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2.5rem',
            color: 'var(--color-danger)',
          }}
        >
          <i className="bi bi-shield-x" />
        </div>

        <h1
          style={{
            fontSize: 'var(--font-size-5xl)',
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-3)',
          }}
        >
          403
        </h1>

        <h2
          style={{
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 'var(--font-weight-semibold)',
            color: 'var(--text-primary)',
            marginBottom: 'var(--space-4)',
          }}
        >
          Accès refusé
        </h2>

        <p
          style={{
            fontSize: 'var(--font-size-sm)',
            color: 'var(--text-secondary)',
            lineHeight: 'var(--line-height-relaxed)',
            marginBottom: 'var(--space-8)',
          }}
        >
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          {user?.firstName && (
            <> Contactez l'administrateur si vous pensez qu'il s'agit d'une erreur.</>
          )}
        </p>

        <div className="d-flex gap-3 justify-content-center flex-wrap">
          <Button
            variant="outline-secondary"
            size="lg"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left me-2" />
            Page précédente
          </Button>

          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate(dashboard)}
          >
            <i className="bi bi-house me-2" />
            Mon tableau de bord
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
