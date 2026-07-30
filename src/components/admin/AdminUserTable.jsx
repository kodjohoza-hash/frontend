import { statusConfig } from '../../data/adminUserData';
import { formatDate, getAvatarClass, getRoleConfig } from './userHelpers';

const AdminUserTable = ({ users, onAction, onSelect }) => {
  if (!users?.length) {
    return (
      <div className="admu-table-wrapper">
        <div className="admu-empty"><i className="bi bi-people-slash" /><h3>Aucun utilisateur trouvé</h3><p>Essayez de modifier vos filtres.</p></div>
      </div>
    );
  }
  return (
    <div className="admu-table-wrapper">
      <div style={{ overflowX: 'auto' }}>
        <table className="admu-table">
          <thead>
            <tr>
              <th style={{ width: 200 }}>Utilisateur</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Rôle</th>
              <th>Compagnie</th>
              <th>Ville</th>
              <th>Statut</th>
              <th>Dernière connexion</th>
              <th>Inscription</th>
              <th style={{ width: 100 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const st = statusConfig[u.status] || { label: u.status, class: '', icon: '' };
              const role = getRoleConfig(u.role);
              const avCls = getAvatarClass(u.id);
              return (
                <tr key={u.id} onClick={() => onSelect?.(u)}>
                  <td>
                    <div className="admu-user-row">
                      <div className={`admu-avatar ${avCls}`}>{u.initials}</div>
                      <div>
                        <div className="admu-user-name">{u.firstName} {u.lastName}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.75rem', color: '#6B7280' }}>{u.email}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{u.phone}</td>
                  <td>
                    <span className={`admu-role-badge admu-role-badge--${u.role}`}>
                      <i className={`bi ${role.icon}`} style={{ fontSize: '0.6rem' }} /> {role.label}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.75rem', maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.company || '—'}</td>
                  <td>{u.city}</td>
                  <td>
                    <span className={`admu-badge ${st.class}`}>
                      {st.icon && <i className={`bi ${st.icon}`} style={{ fontSize: '0.5rem' }} />} {st.label}
                    </span>
                  </td>
                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.75rem', color: '#6B7280' }}>{u.lastLogin || '—'}</td>
                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.75rem' }}>{formatDate(u.createdAt)}</td>
                  <td>
                    <div className="admu-table-actions" onClick={(e) => e.stopPropagation()}>
                      {renderActions(u, onAction)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const renderActions = (user, onAction) => {
  const btns = [
    { key: 'view', icon: 'bi-eye', cls: 'view', title: 'Voir' },
    { key: 'edit', icon: 'bi-pencil', cls: 'edit', title: 'Modifier' },
  ];
  if (user.status === 'active' || user.status === 'online') {
    btns.push({ key: 'suspend', icon: 'bi-pause', cls: 'suspend', title: 'Suspendre' });
  }
  if (user.status === 'suspended') {
    btns.push({ key: 'reactivate', icon: 'bi-play', cls: 'reactivate', title: 'Réactiver' });
  }
  btns.push(
    { key: 'resetPassword', icon: 'bi-key', cls: 'reset', title: 'Réinit. mot de passe' },
    { key: 'resetSession', icon: 'bi-x-circle', cls: 'session', title: 'Réinit. session' },
    { key: 'changeRole', icon: 'bi-arrow-left-right', cls: 'role', title: 'Changer rôle' },
    { key: 'history', icon: 'bi-clock-history', cls: 'history', title: 'Historique' },
  );
  if (user.status !== 'deleted') {
    btns.push({ key: 'delete', icon: 'bi-trash', cls: 'delete', title: 'Supprimer' });
  }
  return btns.map((a) => (
    <button key={a.key} className={`admu-action-btn admu-action-btn--${a.cls}`} title={a.title}
      onClick={() => onAction?.(a.key, user)}>
      <i className={`bi ${a.icon}`} />
    </button>
  ));
};

export { renderActions };
export default AdminUserTable;
