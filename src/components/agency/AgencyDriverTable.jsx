import AgencyDriverStatus from './AgencyDriverStatus';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

export default function AgencyDriverTable({ drivers, sortField, sortDir, onSort, onDelete }) {
  const navigate = useNavigate();

  const columns = [
    { key: 'photo', label: '', sortable: false },
    { key: 'lastName', label: 'Nom', sortable: true },
    { key: 'firstName', label: 'Prénom', sortable: true },
    { key: 'phone', label: 'Téléphone', sortable: true },
    { key: 'email', label: 'Email', sortable: false },
    { key: 'city', label: 'Ville', sortable: true },
    { key: 'licenseCategory', label: 'Permis', sortable: true },
    { key: 'assignedBus', label: 'Bus', sortable: false },
    { key: 'currentTrip', label: 'Voyage', sortable: false },
    { key: 'experience', label: 'Exp.', sortable: true },
    { key: 'status', label: 'Statut', sortable: true },
    { key: 'actions', label: '', sortable: false },
  ];

  const handleSort = (key) => {
    if (sortField === key) onSort(sortDir === 'asc' ? 'desc' : 'asc');
    else onSort('asc');
  };

  const getInitials = (d) => `${(d.firstName || '')[0] || ''}${(d.lastName || '')[0] || ''}`;

  const genderColor = (g) => g === 'F' ? '#EC4899' : '#3B82F6';

  return (
    <div className="ad-table-wrap">
      <table className="ad-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} className={clsx({ 'ad-table__sortable': col.sortable })} onClick={col.sortable ? () => handleSort(col.key) : undefined}>
                <span className="ad-table__th-inner">
                  {col.label}
                  {col.sortable && <span className="ad-table__sort-icon"><i className={clsx('bi', sortField === col.key ? (sortDir === 'asc' ? 'bi-sort-up' : 'bi-sort-down') : 'bi-arrow-down-up')} /></span>}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {drivers.map((d) => (
            <tr key={d.id} className="ad-table__row" onClick={() => navigate(`/company/drivers/${d.id}`)}>
              <td>
                <div className="ad-table__avatar" style={{ background: genderColor(d.gender) }}>
                  {getInitials(d)}
                </div>
              </td>
              <td><span className="ad-table__name">{d.lastName}</span></td>
              <td><span className="ad-table__name">{d.firstName}</span></td>
              <td><span className="ad-table__phone"><i className="bi bi-telephone" /> {d.phone}</span></td>
              <td><span className="ad-table__email">{d.email}</span></td>
              <td><span className="ad-table__city">{d.city}</span></td>
              <td><span className="ad-table__license">{d.licenseCategory}</span></td>
              <td>
                {d.assignedBus ? (
                  <span className="ad-table__bus">{d.assignedBus}</span>
                ) : (
                  <span className="ad-table__none">—</span>
                )}
              </td>
              <td>
                {d.currentTrip ? (
                  <span className="ad-table__trip">{d.currentTrip}</span>
                ) : (
                  <span className="ad-table__none">—</span>
                )}
              </td>
              <td><span className="ad-table__experience">{d.experience} ans</span></td>
              <td><AgencyDriverStatus status={d.status} /></td>
              <td>
                <div className="ad-table__actions-cell">
                  <button className="ad-table__action" onClick={(e) => { e.stopPropagation(); navigate(`/company/drivers/${d.id}`); }} title="Voir"><i className="bi bi-eye" /></button>
                  <button className="ad-table__action ad-table__action--edit" onClick={(e) => e.stopPropagation()} title="Modifier"><i className="bi bi-pencil" /></button>
                  <button className="ad-table__action ad-table__action--danger" onClick={(e) => { e.stopPropagation(); onDelete?.(d); }} title="Supprimer"><i className="bi bi-trash" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {drivers.length === 0 && (
        <div className="ad-table__empty"><i className="bi bi-person-badge" /><p>Aucun chauffeur trouvé</p><span>Modifiez vos filtres ou ajoutez un nouveau chauffeur</span></div>
      )}
    </div>
  );
}
