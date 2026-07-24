import React from 'react';
import AgencyCounterAgentStatus from './AgencyCounterAgentStatus';
import AgencyCounterAgentPerformance from './AgencyCounterAgentPerformance';
import AgencyCounterAgentDocuments from './AgencyCounterAgentDocuments';
import AgencyCounterAgentHistory from './AgencyCounterAgentHistory';
import { agencies, pointsDeVente } from '../../data/agencyCounterAgentData';

function getAgencyName(id) { return agencies.find((a) => a.id === id)?.name || id; }
function getPDVName(id) { return pointsDeVente.find((p) => p.id === id)?.name || id; }
function getInitials(first, last) { return `${(first || '')[0] || ''}${(last || '')[0] || ''}`.toUpperCase(); }
function formatMoney(n) { return (n || 0).toLocaleString('fr-FR') + ' FCFA'; }

export default function AgencyCounterAgentDetails({ agent, onBack, onAction }) {
  if (!agent) return null;

  return (
    <div className="add-details">
      <button className="add-details__back" onClick={onBack}>
        <i className="bi bi-arrow-left" /> Retour aux agents
      </button>

      <div className="add-details__header">
        <div className={`add-details__avatar add-details__avatar--${agent.gender === 'F' ? 'female' : 'male'}`}>
          {getInitials(agent.firstName, agent.lastName)}
        </div>
        <div className="add-details__header-info">
          <h2 className="add-details__name">{agent.firstName} {agent.lastName}</h2>
          <p className="add-details__sub">{agent.id} · {agent.position} · {getAgencyName(agent.agency)}</p>
          <div className="add-details__header-actions">
            <AgencyCounterAgentStatus status={agent.status} size="md" />
            <button className="add-details__action-btn" onClick={() => onAction('edit', agent.id)}>
              <i className="bi bi-pencil" /> Modifier
            </button>
          </div>
        </div>
      </div>

      <div className="add-details__grid">
        <div className="add-details__card">
          <h4><i className="bi bi-person" /> Informations personnelles</h4>
          <div className="add-details__card-body">
            <div className="add-details__field"><span>Sexe</span><span>{agent.gender === 'F' ? 'Féminin' : 'Masculin'}</span></div>
            <div className="add-details__field"><span>Date de naissance</span><span>{new Date(agent.dateOfBirth).toLocaleDateString('fr-FR')}</span></div>
            <div className="add-details__field"><span>Téléphone</span><span>{agent.phone}</span></div>
            <div className="add-details__field"><span>Email</span><span>{agent.email}</span></div>
            <div className="add-details__field"><span>Adresse</span><span>{agent.address}, {agent.city}, {agent.country}</span></div>
          </div>
        </div>

        <div className="add-details__card">
          <h4><i className="bi bi-building" /> Affectation</h4>
          <div className="add-details__card-body">
            <div className="add-details__field"><span>Agence</span><span>{getAgencyName(agent.agency)}</span></div>
            <div className="add-details__field"><span>Point de vente</span><span>{getPDVName(agent.pointDeVente)}</span></div>
            <div className="add-details__field"><span>Poste</span><span>{agent.position}</span></div>
            <div className="add-details__field"><span>Rôle</span><span>{agent.role}</span></div>
            <div className="add-details__field"><span>Identifiant</span><span>{agent.username}</span></div>
            <div className="add-details__field"><span>Date d'embauche</span><span>{new Date(agent.hireDate).toLocaleDateString('fr-FR')}</span></div>
            <div className="add-details__field"><span>Dernière connexion</span><span>{agent.lastLogin ? new Date(agent.lastLogin).toLocaleString('fr-FR') : '—'}</span></div>
          </div>
        </div>

        <div className="add-details__card add-details__card--stats">
          <h4><i className="bi bi-graph-up" /> Statistiques</h4>
          <div className="add-details__stats-grid">
            <div className="add-details__stat-item">
              <span className="add-details__stat-value">{formatMoney(agent.stats?.totalRevenue)}</span>
              <span className="add-details__stat-label">Revenu total</span>
            </div>
            <div className="add-details__stat-item">
              <span className="add-details__stat-value">{agent.stats?.totalSales || 0}</span>
              <span className="add-details__stat-label">Ventes totales</span>
            </div>
            <div className="add-details__stat-item">
              <span className="add-details__stat-value">{agent.stats?.ticketsPrinted || 0}</span>
              <span className="add-details__stat-label">Billets imprimés</span>
            </div>
            <div className="add-details__stat-item">
              <span className="add-details__stat-value">{agent.stats?.bookingsCreated || 0}</span>
              <span className="add-details__stat-label">Réservations</span>
            </div>
            <div className="add-details__stat-item">
              <span className="add-details__stat-value">{agent.stats?.cancellations || 0}</span>
              <span className="add-details__stat-label">Annulations</span>
            </div>
            <div className="add-details__stat-item">
              <span className="add-details__stat-value">{agent.stats?.avgDailySales || 0}</span>
              <span className="add-details__stat-label">Ventes/jour moy.</span>
            </div>
          </div>
        </div>
      </div>

      {agent.observations && (
        <div className="add-details__notes">
          <h4><i className="bi bi-journal-text" /> Observations</h4>
          <p>{agent.observations}</p>
        </div>
      )}

      <AgencyCounterAgentPerformance stats={agent.stats} />

      <AgencyCounterAgentPermissions permissions={agent.permissions} />

      <AgencyCounterAgentHistory history={agent.history} />
    </div>
  );
}
