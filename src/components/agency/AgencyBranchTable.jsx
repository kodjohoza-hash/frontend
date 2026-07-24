import React from 'react';
import AgencyBranchStatus from './AgencyBranchStatus';

function getInitials(name) {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function AgencyBranchTable({ branches, sort, onSort, onAction }) {
  const columns = [
    { key: 'name', label: 'Agence', sortable: true },
    { key: 'city', label: 'Ville', sortable: true },
    { key: 'fullAddress', label: 'Adresse', sortable: false },
    { key: 'manager', label: 'Responsable', sortable: false },
    { key: 'phone', label: 'Téléphone', sortable: false },
    { key: 'agentCount', label: 'Agents', sortable: true },
    { key: 'hours', label: 'Horaires', sortable: false },
    { key: 'status', label: 'Statut', sortable: true },
    { key: 'actions', label: '', sortable: false },
  ];

  return (
    <div className="abr-table-wrapper">
      <table className="abr-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.sortable ? 'abr-table__th--sortable' : ''}
                onClick={col.sortable ? () => onSort(col.key) : undefined}
              >
                <span>{col.label}</span>
                {col.sortable && sort.key === col.key && (
                  <i className={`bi bi-arrow-${sort.dir === 'asc' ? 'up' : 'down'}`} />
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {branches.map((b) => (
            <tr key={b.id}>
              <td>
                <div className="abr-table__branch">
                  <div className="abr-table__avatar">{getInitials(b.name)}</div>
                  <div className="abr-table__branch-info">
                    <span className="abr-table__branch-name">{b.name}</span>
                    <span className="abr-table__branch-code">{b.code}</span>
                  </div>
                </div>
              </td>
              <td>{b.city}</td>
              <td><span className="abr-table__text">{b.quartier}, {b.city}</span></td>
              <td><span className="abr-table__text">{b.manager?.name || '—'}</span></td>
              <td>{b.phone}</td>
              <td><span className="abr-table__badge">{b.agentCount}</span></td>
              <td><span className="abr-table__hours">{b.openTime} – {b.closeTime}</span></td>
              <td><AgencyBranchStatus status={b.status} /></td>
              <td>
                <div className="abr-table__actions">
                  <button className="abr-table__action-btn abr-table__action-btn--view" title="Voir" onClick={() => onAction('view', b.id)}>
                    <i className="bi bi-eye" />
                  </button>
                  <button className="abr-table__action-btn abr-table__action-btn--edit" title="Modifier" onClick={() => onAction('edit', b.id)}>
                    <i className="bi bi-pencil" />
                  </button>
                  <div className="abr-table__dropdown">
                    <button className="abr-table__action-btn abr-table__action-btn--more">
                      <i className="bi bi-three-dots-vertical" />
                    </button>
                    <div className="abr-table__dropdown-menu">
                      <button onClick={() => onAction('view', b.id)}><i className="bi bi-eye" /> Voir</button>
                      <button onClick={() => onAction('edit', b.id)}><i className="bi bi-pencil" /> Modifier</button>
                      <button onClick={() => onAction('map', b.id)}><i className="bi bi-geo-alt" /> Afficher sur la carte</button>
                      <button onClick={() => onAction('agents', b.id)}><i className="bi bi-people" /> Voir les agents</button>
                      <button onClick={() => onAction('stats', b.id)}><i className="bi bi-graph-up" /> Statistiques</button>
                      <button onClick={() => onAction('suspend', b.id)}><i className="bi bi-pause-circle" /> Suspendre</button>
                      <button className="abr-table__dropdown-item--danger" onClick={() => onAction('delete', b.id)}><i className="bi bi-trash" /> Supprimer</button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
