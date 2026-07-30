import { statusConfig } from '../../data/adminUserData';
import { getAvatarClass, getRoleConfig } from './userHelpers';

const AdminUserCards = ({ users, onAction, onSelect }) => {
  if (!users?.length) {
    return (
      <div className="admu-cards" style={{ display: 'grid' }}>
        <div className="admu-empty"><i className="bi bi-people-slash" /><h3>Aucun utilisateur trouvé</h3><p>Essayez de modifier vos filtres.</p></div>
      </div>
    );
  }
  return (
    <div className="admu-cards">
      {users.map((u) => {
        const st = statusConfig[u.status] || { label: u.status, class: '', icon: '' };
        const role = getRoleConfig(u.role);
        const avCls = getAvatarClass(u.id);
        const icons = { view: 'bi-eye', edit: 'bi-pencil', suspend: 'bi-pause', reactivate: 'bi-play', resetPassword: 'bi-key', resetSession: 'bi-x-circle', changeRole: 'bi-arrow-left-right', history: 'bi-clock-history', delete: 'bi-trash' };
        return (
          <div key={u.id} className="admu-user-card" onClick={() => onSelect?.(u)}>
            <div className="admu-card-header">
              <div className={`admu-avatar ${avCls}`}>{u.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.85rem' }}>{u.firstName} {u.lastName}</div>
                <div style={{ fontSize: '0.7rem', color: '#6B7280' }}>{u.email}</div>
              </div>
              <span className={`admu-badge ${st.class}`}>{st.label}</span>
            </div>
            <div className="admu-card-body">
              <span><i className={`bi ${role.icon}`} /> {role.label}</span>
              <span><i className="bi bi-telephone" /> {u.phone}</span>
              <span><i className="bi bi-building" /> {u.company || '—'}</span>
              <span><i className="bi bi-geo-alt" /> {u.city}</span>
            </div>
            <div className="admu-card-actions" onClick={(e) => e.stopPropagation()}>
              {Object.entries(icons).map(([key, icon]) => {
                const show = {
                  view: true, edit: true,
                  suspend: u.status === 'active' || u.status === 'online',
                  reactivate: u.status === 'suspended',
                  resetPassword: true, resetSession: true, changeRole: true, history: true,
                  delete: u.status !== 'deleted',
                }[key];
                if (!show) return null;
                return (
                  <button key={key} className={`admu-action-btn admu-action-btn--${key === 'reactivate' ? 'reactivate' : key === 'resetPassword' ? 'reset' : key === 'resetSession' ? 'session' : key === 'changeRole' ? 'role' : key === 'history' ? 'history' : key}`}
                    title={key} onClick={() => onAction?.(key, u)}>
                    <i className={`bi ${icon}`} />
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default AdminUserCards;
