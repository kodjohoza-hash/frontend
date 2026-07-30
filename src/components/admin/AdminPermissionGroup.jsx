import { PERMISSION_ACTIONS } from '../../data/adminRoleData';

const AdminPermissionGroup = ({ module, actions, onToggle, onSelectAll, onDeselectAll }) => {
  const allSelected = PERMISSION_ACTIONS.every((a) => actions.includes(a.id));
  const bgColors = { primary: '#8B5CF6', info: '#3B82F6', success: '#10B981', warning: '#F59E0B', danger: '#EF4444', accent: '#EC4899', purple: '#A855F7', secondary: '#6B7280' };
  const color = bgColors[module.color] || '#8B5CF6';

  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <div className="admr-matrix-module-header" style={{ borderLeft: `3px solid ${color}` }}>
        <i className={`bi ${module.icon}`} style={{ color }} />
        <span style={{ flex: 1 }}>{module.label}</span>
        <span style={{ fontSize: '0.7rem', color: '#9CA3AF', marginRight: 8 }}>
          {actions.length}/{PERMISSION_ACTIONS.length}
        </span>
        <button onClick={() => onSelectAll?.()}
          style={{ border: 'none', background: 'transparent', color: '#10B981', cursor: 'pointer', fontSize: '0.7rem', padding: '0.2rem 0.4rem' }}
          title="Tout sélectionner"><i className="bi bi-check-all" /></button>
        <button onClick={() => onDeselectAll?.()}
          style={{ border: 'none', background: 'transparent', color: '#EF4444', cursor: 'pointer', fontSize: '0.7rem', padding: '0.2rem 0.4rem' }}
          title="Tout retirer"><i className="bi bi-x-lg" /></button>
      </div>
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', padding: '0 0.75rem 0.5rem' }}>
        {PERMISSION_ACTIONS.map((a) => {
          const checked = actions.includes(a.id);
          return (
            <label key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', fontSize: '0.7rem',
              padding: '0.2rem 0.5rem', borderRadius: 5,
              background: checked ? `${color}15` : '#F9FAFB',
              border: `1px solid ${checked ? color : '#E5E7EB'}`,
              color: checked ? color : '#9CA3AF',
              transition: 'all 0.15s',
            }}>
              <input type="checkbox" checked={checked} onChange={() => onToggle?.(a.id)}
                style={{ accentColor: color, margin: 0 }} />
              {a.label}
            </label>
          );
        })}
      </div>
    </div>
  );
};
export default AdminPermissionGroup;
