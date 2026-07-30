import { formatDate, getRoleIconBg } from './rolHelpers';
import { roleStatusConfig, ROLE_TYPES } from '../../data/adminRoleData';

const AdminRoleTable = ({ roles, onAction, onSelect }) => {
  if (!roles?.length) {
    return (
      <div className="admr-table-wrapper">
        <div className="admr-empty"><i className="bi bi-shield-slash" /><h3>Aucun rôle trouvé</h3><p>Essayez de modifier vos filtres.</p></div>
      </div>
    );
  }
  return (
    <div className="admr-table-wrapper">
      <div style={{ overflowX: 'auto' }}>
        <table className="admr-table">
          <thead>
            <tr>
              <th style={{ width: 220 }}>Rôle</th>
              <th>Description</th>
              <th style={{ textAlign: 'center' }}>Utilisateurs</th>
              <th style={{ textAlign: 'center' }}>Permissions</th>
              <th>Type</th>
              <th>Statut</th>
              <th>Date</th>
              <th style={{ width: 100 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((r) => {
              const st = roleStatusConfig[r.status] || { label: r.status, class: '' };
              const typeCfg = ROLE_TYPES.find((t) => t.id === r.type);
              return (
                <tr key={r.id} onClick={() => onSelect?.(r)}>
                  <td>
                    <div className="admr-role-name-row">
                      <div className="admr-role-icon" style={{ background: getRoleIconBg(r.color) }}>
                        <i className={`bi ${r.icon}`} />
                      </div>
                      <div className="admr-role-name">{r.name}</div>
                    </div>
                  </td>
                  <td><div className="admr-role-desc">{r.description}</div></td>
                  <td style={{ textAlign: 'center' }}>{r.userCount}</td>
                  <td style={{ textAlign: 'center' }}>{r.permissionCount}</td>
                  <td><span className={`admr-badge ${typeCfg?.badge || ''}`}>{typeCfg?.label || r.type}</span></td>
                  <td><span className={st.class}>{st.label}</span></td>
                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{formatDate(r.createdAt)}</td>
                  <td>
                    <div className="admr-table-actions" onClick={(e) => e.stopPropagation()}>
                      {['view', 'edit'].map((key) => (
                        <button key={key} className={`admr-action-btn admr-action-btn--${key}`}
                          title={key === 'view' ? 'Voir' : 'Modifier'}
                          onClick={() => onAction?.(key, r)}>
                          <i className={`bi ${key === 'view' ? 'bi-eye' : 'bi-pencil'}`} />
                        </button>
                      ))}
                      <button className="admr-action-btn admr-action-btn--duplicate" title="Dupliquer"
                        onClick={() => onAction?.('duplicate', r)}>
                        <i className="bi bi-copy" />
                      </button>
                      {r.status === 'active'
                        ? <button className="admr-action-btn admr-action-btn--archive" title="Archiver"
                          onClick={() => onAction?.('archive', r)}>
                          <i className="bi bi-archive" />
                        </button>
                        : <button className="admr-action-btn admr-action-btn--reactivate" title="Réactiver"
                          onClick={() => onAction?.('reactivate', r)}>
                          <i className="bi bi-arrow-counterclockwise" />
                        </button>
                      }
                      {r.type === 'custom' && (
                        <button className="admr-action-btn admr-action-btn--delete" title="Supprimer"
                          onClick={() => onAction?.('delete', r)}>
                          <i className="bi bi-trash" />
                        </button>
                      )}
                      <button className="admr-action-btn admr-action-btn--users" title="Utilisateurs"
                        onClick={() => onAction?.('users', r)}>
                        <i className="bi bi-people" />
                      </button>
                      <button className="admr-action-btn admr-action-btn--history" title="Historique"
                        onClick={() => onAction?.('history', r)}>
                        <i className="bi bi-clock-history" />
                      </button>
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
export default AdminRoleTable;
