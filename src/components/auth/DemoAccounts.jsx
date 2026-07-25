import { useNavigate } from 'react-router-dom';
import useAuthStore from '@store/auth.store';
import { getRoleDashboard, ROLE_LABELS, ROLE_ICONS, ROLE_BADGE_VARIANTS } from '@utils/roles';
import { ROLE_PERMISSIONS } from '@utils/permissions';
import MOCK_USERS from '@mock/users';

const DEMO_ACCOUNTS = MOCK_USERS.map((u) => ({
  id: u.id,
  name: `${u.firstName} ${u.lastName}`,
  role: u.role,
  email: u.email,
  color: ROLE_BADGE_VARIANTS[u.role] || 'secondary',
  icon: ROLE_ICONS[u.role] || 'bi-person',
}));

const DemoAccounts = () => {
  const navigate = useNavigate();
  const storeLogin = useAuthStore((s) => s.login);

  const handleDemoLogin = (account) => {
    const user = {
      id: account.id,
      email: account.email,
      firstName: account.name.split(' ')[0],
      lastName: account.name.split(' ').slice(1).join(' '),
      role: account.role,
      permissions: ROLE_PERMISSIONS[account.role] || [],
      avatar: null,
      emailVerified: true,
    };

    storeLogin({
      user,
      token: 'demo_token_' + Date.now().toString(36),
      refreshToken: 'demo_refresh_' + Date.now().toString(36),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    navigate(getRoleDashboard(account.role), { replace: true });
  };

  return (
    <div className="demo-accounts">
      <div className="demo-accounts__banner">
        <i className="bi bi-code-slash" />
        <span>Mode D&eacute;veloppement</span>
      </div>
      <p className="demo-accounts__intro">
        Acc&eacute;l&eacute;rez vos tests avec les comptes de d&eacute;monstration
      </p>

      <div className="demo-accounts__grid">
        {DEMO_ACCOUNTS.map((account) => (
          <button
            key={account.id}
            type="button"
            className={`demo-accounts__card demo-accounts__card--${account.color}`}
            onClick={() => handleDemoLogin(account)}
          >
            <div className="demo-accounts__card-header">
              <div className={`demo-accounts__avatar demo-accounts__avatar--${account.color}`}>
                <i className={`bi ${account.icon}`} />
              </div>
              <span className={`demo-accounts__badge demo-accounts__badge--${account.color}`}>
                {ROLE_LABELS[account.role]}
              </span>
            </div>
            <div className="demo-accounts__card-body">
              <span className="demo-accounts__name">{account.name}</span>
              <span className="demo-accounts__email">{account.email}</span>
            </div>
            <div className="demo-accounts__card-footer">
              <i className="bi bi-box-arrow-in-right" />
              Se connecter
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DemoAccounts;
