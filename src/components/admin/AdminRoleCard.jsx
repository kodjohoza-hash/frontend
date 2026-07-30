import { roleStatusConfig, ROLE_TYPES } from '../../data/adminRoleData';
import { getRoleIconBg } from './rolHelpers';

const AdminRoleCard = ({ roles, onAction, onSelect }) => {
  if (!roles?.length) {
    return (
      <div className="admr-cards" style={{ display: 'grid' }}>
        <div className="admr-empty"><i className="bi bi-shield-slash" /><h3>Aucun rôle trouvé</h3><p>Essayez de modifier vos filtres.</p></div>
      </div>
    );
  }
  return (
    <div className="admr-cards">
      {roles.map((r) => {
        const st = roleStatusConfig[r.status] || { label: r.status, class: '' };
        const typeCfg = ROLE_TYPES.find((t) => t.id === r.type);
        return (
          <div key={r.id} className="admr-role-card" onClick={() => onSelect?.(r)}>
            <div className="admr-card-header">
              <div className="admr-role-icon" style={{ background: getRoleIconBg(r.color) }}>
                <i className={`bi ${r.icon}`} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, color: '#111827', fontSize: '0.9rem' }}>{r.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{r.description}</div>
              </div>
              <span className={st.class}>{st.label}</span>
            </div>
            <div className="admr-card-body">
              <span><i className="bi bi-people" /> {r.userCount} utilisateurs</span>
              <span><i className="bi bi-shield-check" /> {r.permissionCount} permissions</span>
              <span><span className={`admr-badge ${typeCfg?.badge || ''}`}>{typeCfg?.label || r.type}</span></span>
            </div>
            <div className="admr-card-actions" onClick={(e) => e.stopPropagation()}>
              {['view', 'edit', 'duplicate', r.status === 'active' ? 'archive' : 'reactivate', 'users', 'history'].map((key) => {
                if (key === 'archive' && r.status !== 'active') return null;
                if (key === 'reactivate' && r.status !== 'archived') return null;
                const icons = { view: 'bi-eye', edit: 'bi-pencil', duplicate: 'bi-copy', archive: 'bi-archive', reactivate: 'bi-arrow-counterclockwise', users: 'bi-people', history: 'bi-clock-history' };
                const cls = { view: 'view', edit: 'edit', duplicate: 'duplicate', archive: 'archive', reactivate: 'reactivate', users: 'users', history: 'history' };
                return (
                  <button key={key} className={`admr-action-btn admr-action-btn--${cls[key]}`} title={key}
                    onClick={() => onAction?.(key, r)}>
                    <i className={`bi ${icons[key]}`} />
                  </button>
                );
              })}
              {r.type === 'custom' && (
                <button className="admr-action-btn admr-action-btn--delete" title="Supprimer"
                  onClick={() => onAction?.('delete', r)}>
                  <i className="bi bi-trash" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
export default AdminRoleCard;
