import { users } from '../../data/adminUserData';
import { getAvatarClass } from './userHelpers';

const AdminRoleUsers = ({ role }) => {
  if (!role) return null;
  const roleUsers = users.filter((u) => {
    const roleMap = { 'ROLE-001': 'super_admin', 'ROLE-002': 'company_admin', 'ROLE-003': 'counter_agent', 'ROLE-004': 'client' };
    const mappedRole = roleMap[role.id];
    return mappedRole ? u.role === mappedRole : false;
  });

  return (
    <div className="admr-drawer-section">
      <h3><i className="bi bi-people" /> Utilisateurs ({role.userCount})</h3>
      {roleUsers.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '1rem', color: '#9CA3AF', fontSize: '0.85rem' }}>
          Aucun utilisateur assigné à ce rôle
        </div>
      ) : (
        <div className="admr-users-list">
          {roleUsers.map((u) => {
            const avCls = getAvatarClass(u.id);
            return (
              <div key={u.id} className="admr-user-item">
                <div className={`admr-user-avatar ${avCls}`}>{u.initials}</div>
                <div className="admr-user-info">
                  <div className="admr-user-name">{u.firstName} {u.lastName}</div>
                  <div className="admr-user-email">{u.email}</div>
                </div>
                <button className="admr-action-btn admr-action-btn--view" title="Voir"
                  onClick={() => alert(`Fiche de ${u.firstName} ${u.lastName} (mock)`)}>
                  <i className="bi bi-eye" />
                </button>
                <button className="admr-action-btn admr-action-btn--edit" title="Changer rôle"
                  onClick={() => alert(`Changer le rôle de ${u.firstName} ${u.lastName} (mock)`)}>
                  <i className="bi bi-arrow-left-right" />
                </button>
              </div>
            );
          })}
        </div>
      )}
      {role.userCount > roleUsers.length && (
        <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
          <button className="admr-filters-toggler" style={{ fontSize: '0.75rem' }}
            onClick={() => alert(`Voir les ${role.userCount} utilisateurs (mock)`)}>
            <i className="bi bi-plus-circle" /> Voir tous les utilisateurs
          </button>
        </div>
      )}
    </div>
  );
};
export default AdminRoleUsers;
