import React from 'react';
import AgencyCounterAgentStatus from './AgencyCounterAgentStatus';
import { agencies, pointsDeVente } from '../../data/agencyCounterAgentData';

function getAgencyName(id) {
  return agencies.find((a) => a.id === id)?.name || id;
}

function getPDVName(id) {
  return pointsDeVente.find((p) => p.id === id)?.name || id;
}

function getInitials(first, last) {
  return `${(first || '')[0] || ''}${(last || '')[0] || ''}`.toUpperCase();
}

function formatDateTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) + ' ' +
    d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export default function AgencyCounterAgentTable({ agents, sort, onSort, onAction }) {
  const columns = [
    { key: 'firstName', label: 'Agent', sortable: true },
    { key: 'phone', label: 'Téléphone', sortable: false },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'agency', label: 'Agence', sortable: true },
    { key: 'pointDeVente', label: 'Point de vente', sortable: true },
    { key: 'position', label: 'Poste', sortable: false },
    { key: 'hireDate', label: 'Date d\'embauche', sortable: true },
    { key: 'status', label: 'Statut', sortable: true },
    { key: 'lastLogin', label: 'Dernière connexion', sortable: true },
    { key: 'actions', label: '', sortable: false },
  ];

  return (
    <div className="ac-table-wrapper">
      <table className="ac-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={col.sortable ? 'ac-table__th--sortable' : ''}
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
          {agents.map((agent) => (
            <tr key={agent.id}>
              <td>
                <div className="ac-table__agent">
                  <div className={`ac-table__avatar ac-table__avatar--${agent.gender === 'F' ? 'female' : 'male'}`}>
                    {getInitials(agent.firstName, agent.lastName)}
                  </div>
                  <div className="ac-table__agent-info">
                    <span className="ac-table__agent-name">{agent.firstName} {agent.lastName}</span>
                    <span className="ac-table__agent-id">{agent.id}</span>
                  </div>
                </div>
              </td>
              <td>{agent.phone}</td>
              <td><span className="ac-table__email">{agent.email}</span></td>
              <td><span className="ac-table__text">{getAgencyName(agent.agency)}</span></td>
              <td><span className="ac-table__text">{getPDVName(agent.pointDeVente)}</span></td>
              <td><span className="ac-table__badge">{agent.position}</span></td>
              <td>{new Date(agent.hireDate).toLocaleDateString('fr-FR')}</td>
              <td><AgencyCounterAgentStatus status={agent.status} /></td>
              <td>{formatDateTime(agent.lastLogin)}</td>
              <td>
                <div className="ac-table__actions">
                  <button className="ac-table__action-btn ac-table__action-btn--view" title="Voir" onClick={() => onAction('view', agent.id)}>
                    <i className="bi bi-eye" />
                  </button>
                  <button className="ac-table__action-btn ac-table__action-btn--edit" title="Modifier" onClick={() => onAction('edit', agent.id)}>
                    <i className="bi bi-pencil" />
                  </button>
                  <div className="ac-table__dropdown">
                    <button className="ac-table__action-btn ac-table__action-btn--more">
                      <i className="bi bi-three-dots-vertical" />
                    </button>
                    <div className="ac-table__dropdown-menu">
                      <button onClick={() => onAction('reset_password', agent.id)}>
                        <i className="bi bi-key" /> Réinitialiser mot de passe
                      </button>
                      <button onClick={() => onAction('reassign', agent.id)}>
                        <i className="bi bi-arrow-left-right" /> Affecter à un point de vente
                      </button>
                      <button onClick={() => onAction('change_role', agent.id)}>
                        <i className="bi bi-person-gear" /> Changer le rôle
                      </button>
                      <button onClick={() => onAction('suspend', agent.id)}>
                        <i className="bi bi-pause-circle" /> Suspendre
                      </button>
                      <button className="ac-table__dropdown-item--danger" onClick={() => onAction('delete', agent.id)}>
                        <i className="bi bi-trash" /> Supprimer
                      </button>
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
