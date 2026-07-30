import { useState } from 'react';
import { MODULES, PERMISSION_ACTIONS, togglePermission, setModulePermissions } from '../../data/adminRoleData';

const AdminPermissionMatrix = ({ role, onUpdate }) => {
  const [localRole, setLocalRole] = useState(role);
  const [collapsedModules, setCollapsedModules] = useState([]);

  const handleToggle = (moduleId, actionId) => {
    const updated = togglePermission(localRole, moduleId, actionId);
    setLocalRole(updated);
    onUpdate?.(updated);
  };

  const handleSelectAll = (moduleId) => {
    const updated = setModulePermissions(localRole, moduleId, PERMISSION_ACTIONS.map((a) => a.id));
    setLocalRole(updated);
    onUpdate?.(updated);
  };

  const handleDeselectAll = (moduleId) => {
    const updated = setModulePermissions(localRole, moduleId, []);
    setLocalRole(updated);
    onUpdate?.(updated);
  };

  const handleSelectAllModules = () => {
    let r = localRole;
    MODULES.forEach((m) => { r = setModulePermissions(r, m.id, PERMISSION_ACTIONS.map((a) => a.id)); });
    setLocalRole(r);
    onUpdate?.(r);
  };

  const handleDeselectAllModules = () => {
    let r = localRole;
    MODULES.forEach((m) => { r = setModulePermissions(r, m.id, []); });
    setLocalRole(r);
    onUpdate?.(r);
  };

  const toggleModule = (moduleId) => {
    setCollapsedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  const bgColors = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899', '#14B8A6', '#F97316', '#6366F1', '#84CC16', '#06B6D4', '#A855F7', '#6B7280', '#DC2626', '#0EA5E9', '#22D3EE'];

  return (
    <div className="admr-drawer-section">
      <h3><i className="bi bi-grid-3x3-gap" /> Matrice des permissions</h3>

      <div className="admr-matrix-actions">
        <button onClick={handleSelectAllModules}><i className="bi bi-check-all" /> Tout sélectionner</button>
        <button onClick={handleDeselectAllModules}><i className="bi bi-x-lg" /> Tout retirer</button>
        <button onClick={() => { /* Copy from another role */ alert('Copie depuis un autre rôle (mock)'); }}>
          <i className="bi bi-copy" /> Copier depuis un rôle
        </button>
        <button onClick={() => { /* Create from template */ alert('Créer à partir d\'un modèle (mock)'); }}>
          <i className="bi bi-file-earmark-plus" /> Modèle
        </button>
      </div>

      <div className="admr-matrix-wrapper">
        <table className="admr-matrix">
          <thead>
            <tr>
              <th style={{ width: 160 }}>Module</th>
              {PERMISSION_ACTIONS.map((a) => (
                <th key={a.id} title={a.label}>
                  <i className={`bi ${a.icon}`} style={{ fontSize: '0.9rem', display: 'block', marginBottom: 2 }} />
                  {a.label}
                </th>
              ))}
              <th style={{ width: 40 }}>Tout</th>
            </tr>
          </thead>
          <tbody>
            {MODULES.map((mod, idx) => {
              const perms = localRole.permissions.find((p) => p.moduleId === mod.id);
              const actions = perms ? perms.actions : [];
              const allSelected = PERMISSION_ACTIONS.every((a) => actions.includes(a.id));
              return (
                <tr key={mod.id}>
                  <td>
                    <div className="admr-module-label">
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: bgColors[idx % bgColors.length], flexShrink: 0 }} />
                      <i className={`bi ${mod.icon}`} style={{ color: bgColors[idx % bgColors.length] }} />
                      {mod.label}
                    </div>
                  </td>
                  {PERMISSION_ACTIONS.map((a) => {
                    const checked = actions.includes(a.id);
                    return (
                      <td key={a.id}>
                        <label className="admr-switch">
                          <input type="checkbox" checked={checked}
                            onChange={() => handleToggle(mod.id, a.id)} />
                          <span className="admr-switch-slider" />
                        </label>
                      </td>
                    );
                  })}
                  <td>
                    <label className="admr-switch">
                      <input type="checkbox" checked={allSelected}
                        onChange={() => allSelected ? handleDeselectAll(mod.id) : handleSelectAll(mod.id)} />
                      <span className="admr-switch-slider" style={{ background: allSelected ? '#10B981' : undefined }} />
                    </label>
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
export default AdminPermissionMatrix;
