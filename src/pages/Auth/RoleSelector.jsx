import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@routes/routeConstants';
import AuthShell from '@components/auth/AuthShell';
import AppLogo from '@components/common/AppLogo';

const ROLES = [
  {
    id: 'client',
    title: 'Client',
    description: 'R&eacute;servez facilement vos voyages.',
    icon: 'bi-person-fill',
    color: 'blue',
    route: ROUTES.AUTH_LOGIN_CLIENT,
  },
  {
    id: 'company',
    title: 'Compagnie',
    description: 'G&eacute;rez votre compagnie de transport.',
    icon: 'bi-building',
    color: 'green',
    route: ROUTES.AUTH_LOGIN_COMPANY,
  },
  {
    id: 'counter',
    title: 'Agent de guichet',
    description: 'Vendez des billets et g&eacute;rez les r&eacute;servations.',
    icon: 'bi-shop',
    color: 'orange',
    route: ROUTES.AUTH_LOGIN_COUNTER,
  },
  {
    id: 'super-admin',
    title: 'Super Admin',
    description: 'Administration g&eacute;n&eacute;rale de la plateforme.',
    icon: 'bi-shield-lock-fill',
    color: 'violet',
    route: ROUTES.AUTH_LOGIN_SUPER_ADMIN,
  },
];

const RoleSelector = () => {
  const navigate = useNavigate();

  return (
    <AuthShell
      leftTitle={<>Bienvenue sur <span className="auth-left__highlight">BUS TIX CONNECT</span></>}
      leftDesc={<>La plateforme de r&eacute;servation de billets de bus la plus fiable du Cameroun. Connectez-vous pour g&eacute;rer vos trajets, r&eacute;servations et bien plus.</>}
    >
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-header__icon">
            <AppLogo size={28} variant="icon" />
          </div>
          <h2 className="auth-header__title">Choisissez votre espace</h2>
          <p className="auth-header__subtitle">S&eacute;lectionnez votre r&ocirc;le pour acc&eacute;der &agrave; votre tableau de bord.</p>
        </div>

        <div className="role-selector__grid">
          {ROLES.map((role) => (
            <button
              key={role.id}
              type="button"
              className={`role-card role-card--${role.color}`}
              onClick={() => navigate(role.route)}
            >
              <div className={`role-card__icon role-card__icon--${role.color}`}>
                <i className={`bi ${role.icon}`} />
              </div>
              <div className="role-card__content">
                <span className="role-card__title">{role.title}</span>
                <span className="role-card__desc">{role.description}</span>
              </div>
              <div className="role-card__arrow">
                <i className="bi bi-arrow-right" />
              </div>
            </button>
          ))}
        </div>

        <p className="auth-form__alt" style={{ marginTop: '1.25rem' }}>
          <a href="/" className="auth-form__alt-link">
            <i className="bi bi-arrow-left" style={{ marginRight: '0.25rem' }} />
            Retour &agrave; l&rsquo;accueil
          </a>
        </p>
      </div>
    </AuthShell>
  );
};

export default RoleSelector;
