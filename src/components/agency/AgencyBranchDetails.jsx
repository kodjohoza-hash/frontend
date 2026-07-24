import React from 'react';
import AgencyBranchStatus from './AgencyBranchStatus';
import AgencyBranchMap from './AgencyBranchMap';
import AgencyBranchOverview from './AgencyBranchOverview';
import { services } from '../../data/agencyBranchData';

function formatMoney(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M FCFA';
  return (n || 0).toLocaleString('fr-FR') + ' FCFA';
}

function getInitials(name) {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function AgencyBranchDetails({ branch, onBack, onAction }) {
  if (!branch) return null;

  return (
    <div className="abr-details">
      <button className="abr-details__back" onClick={onBack}>
        <i className="bi bi-arrow-left" /> Retour aux points de vente
      </button>

      <div className="abr-details__header">
        <div className="abr-details__avatar">{getInitials(branch.name)}</div>
        <div className="abr-details__header-info">
          <h2 className="abr-details__name">{branch.name}</h2>
          <p className="abr-details__sub">{branch.code} · {branch.type} · {branch.city}</p>
          <div className="abr-details__header-actions">
            <AgencyBranchStatus status={branch.status} size="md" />
            <button className="abr-details__action-btn" onClick={() => onAction('edit', branch.id)}>
              <i className="bi bi-pencil" /> Modifier
            </button>
          </div>
        </div>
      </div>

      <div className="abr-details__grid">
        <div className="abr-details__card">
          <h4><i className="bi bi-building" /> Informations générales</h4>
          <div className="abr-details__card-body">
            <div className="abr-details__field"><span>Description</span><span>{branch.description}</span></div>
            <div className="abr-details__field"><span>Type</span><span>{branch.type}</span></div>
            <div className="abr-details__field"><span>Guichets</span><span>{branch.counters}</span></div>
            <div className="abr-details__field"><span>Agents</span><span>{branch.agentCount}</span></div>
            <div className="abr-details__field"><span>Téléphone</span><span>{branch.phone}</span></div>
            <div className="abr-details__field"><span>Email</span><span>{branch.email}</span></div>
          </div>
        </div>

        <div className="abr-details__card">
          <h4><i className="bi bi-geo-alt" /> Adresse & Localisation</h4>
          <div className="abr-details__card-body">
            <div className="abr-details__field"><span>Pays</span><span>{branch.country}</span></div>
            <div className="abr-details__field"><span>Région</span><span>{branch.region}</span></div>
            <div className="abr-details__field"><span>Ville</span><span>{branch.city}</span></div>
            <div className="abr-details__field"><span>Quartier</span><span>{branch.quartier}</span></div>
            <div className="abr-details__field"><span>Adresse</span><span>{branch.fullAddress}</span></div>
          </div>
        </div>

        <div className="abr-details__card">
          <h4><i className="bi bi-clock" /> Horaires</h4>
          <div className="abr-details__card-body">
            <div className="abr-details__field"><span>Ouverture</span><span>{branch.openTime}</span></div>
            <div className="abr-details__field"><span>Fermeture</span><span>{branch.closeTime}</span></div>
            <div className="abr-details__field">
              <span>Jours</span>
              <span>{branch.openDays?.join(', ')}</span>
            </div>
          </div>
        </div>

        <div className="abr-details__card">
          <h4><i className="bi bi-person" /> Responsable</h4>
          <div className="abr-details__card-body">
            <div className="abr-details__field"><span>Nom</span><span>{branch.manager?.name || '—'}</span></div>
            <div className="abr-details__field"><span>Téléphone</span><span>{branch.manager?.phone || '—'}</span></div>
            <div className="abr-details__field"><span>ID</span><span>{branch.manager?.id || '—'}</span></div>
          </div>
        </div>
      </div>

      <div className="abr-details__services">
        <h4><i className="bi bi-grid-3x3-gap" /> Services proposés</h4>
        <div className="abr-details__services-list">
          {branch.services?.map((key) => {
            const svc = services.find((s) => s.key === key);
            return svc ? (
              <div key={key} className="abr-details__service-item">
                <i className={`bi ${svc.icon}`} /><span>{svc.label}</span>
              </div>
            ) : null;
          })}
        </div>
      </div>

      <AgencyBranchMap lat={branch.lat} lng={branch.lng} name={branch.name} address={branch.fullAddress} />

      <div className="abr-details__stats">
        <h4><i className="bi bi-graph-up" /> Statistiques</h4>
        <div className="abr-details__stats-grid">
          <div className="abr-details__stat-item">
            <span className="abr-details__stat-value">{branch.stats?.todayBookings || 0}</span>
            <span className="abr-details__stat-label">Réservations/jour</span>
          </div>
          <div className="abr-details__stat-item">
            <span className="abr-details__stat-value">{formatMoney(branch.stats?.todayRevenue)}</span>
            <span className="abr-details__stat-label">CA du jour</span>
          </div>
          <div className="abr-details__stat-item">
            <span className="abr-details__stat-value">{branch.stats?.totalBookings?.toLocaleString('fr-FR') || 0}</span>
            <span className="abr-details__stat-label">Total réservations</span>
          </div>
          <div className="abr-details__stat-item">
            <span className="abr-details__stat-value">{formatMoney(branch.stats?.totalRevenue)}</span>
            <span className="abr-details__stat-label">CA total</span>
          </div>
          <div className="abr-details__stat-item">
            <span className="abr-details__stat-value">{branch.stats?.avgDaily || 0}</span>
            <span className="abr-details__stat-label">Moy./jour</span>
          </div>
          <div className="abr-details__stat-item">
            <span className="abr-details__stat-value">{branch.stats?.satisfaction ? branch.stats.satisfaction + '/5' : '—'}</span>
            <span className="abr-details__stat-label">Satisfaction</span>
          </div>
        </div>
      </div>

      <AgencyBranchOverview branch={branch} />
    </div>
  );
}
