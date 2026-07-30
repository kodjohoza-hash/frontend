import { backupCategories, backupStatuses } from '../../../data/adminBackupData';

const AdminBackupTable = ({ backups: items, onRestore }) => {
  if (items.length === 0) {
    return (
      <div className="adb-empty-state">
        <i className="fa-solid fa-database"></i>
        <h3>Aucune sauvegarde trouvée</h3>
        <p>Modifiez vos filtres ou créez une nouvelle sauvegarde.</p>
      </div>
    );
  }
  return (
    <div className="adb-table-wrapper">
      <table className="adb-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Type</th>
            <th>Taille</th>
            <th>Date</th>
            <th>Durée</th>
            <th>Statut</th>
            <th>Créateur</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(bkp => {
            const cat = backupCategories.find(c => c.id === bkp.category);
            const st = backupStatuses.find(s => s.id === bkp.status);
            return (
              <tr key={bkp.id}>
                <td><strong style={{ fontSize: 13 }}>{bkp.name}</strong></td>
                <td>
                  <span className="adb-badge-sm" style={{ background: `${cat?.color || '#6B7280'}12`, color: cat?.color || '#6B7280' }}>
                    <i className={`fa-solid ${cat?.icon || 'fa-database'}`}></i> {cat?.label || bkp.category}
                  </span>
                </td>
                <td className="adb-size">{bkp.size > 0 ? `${bkp.size} ${bkp.sizeUnit}` : '—'}</td>
                <td style={{ fontSize: 12, color: '#6B7280' }}>{bkp.date}<br /><span className="adb-mono">{bkp.time}</span></td>
                <td>{bkp.duration > 0 ? `${bkp.duration} min` : '—'}</td>
                <td>
                  {bkp.status === 'in_progress' ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="adb-badge-sm" style={{ background: st?.bg, color: st?.color }}><i className="fa-solid fa-spinner fa-spin"></i> {st?.label}</span>
                    </div>
                  ) : (
                    <span className="adb-badge-sm" style={{ background: st?.bg, color: st?.color }}>
                      <i className="fa-solid fa-circle" style={{ fontSize: 7 }}></i> {st?.label || bkp.status}
                    </span>
                  )}
                </td>
                <td style={{ fontSize: 12 }}>{bkp.creator}</td>
                <td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button className="adb-btn-sm ghost" title="Voir"><i className="fa-regular fa-eye"></i></button>
                    <button className="adb-btn-sm primary" title="Télécharger"><i className="fa-solid fa-download"></i></button>
                    <button className="adb-btn-sm warning" title="Restaurer" onClick={() => onRestore?.(bkp)}><i className="fa-solid fa-rotate-left"></i></button>
                    <button className="adb-btn-sm danger" title="Supprimer"><i className="fa-regular fa-trash-can"></i></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
export default AdminBackupTable;
