import React from 'react';
import AgencyBranchStatus from './AgencyBranchStatus';

function getInitials(name) {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function AgencyBranchCard({ branch, onAction }) {
  return (
    <div className="abr-card">
      <div className="abr-card__header">
        <div className="abr-card__avatar">{getInitials(branch.name)}</div>
        <div className="abr-card__identity">
          <h4 className="abr-card__name">{branch.name}</h4>
          <span className="abr-card__code">{branch.code} · {branch.type}</span>
        </div>
        <AgencyBranchStatus status={branch.status} />
      </div>
      <div className="abr-card__body">
        <div className="abr-card__row"><i className="bi bi-geo-alt" /><span>{branch.fullAddress}</span></div>
        <div className="abr-card__row"><i className="bi bi-building" /><span>{branch.city}, {branch.region}</span></div>
        <div className="abr-card__row"><i className="bi bi-person" /><span>{branch.manager?.name || '—'}</span></div>
        <div className="abr-card__row"><i className="bi bi-telephone" /><span>{branch.phone}</span></div>
        <div className="abr-card__row"><i className="bi bi-people" /><span>{branch.agentCount} agent{branch.agentCount > 1 ? 's' : ''}</span></div>
        <div className="abr-card__row"><i className="bi bi-clock" /><span>{branch.openTime} – {branch.closeTime}</span></div>
      </div>
      <div className="abr-card__footer">
        <button className="abr-card__btn abr-card__btn--view" onClick={() => onAction('view', branch.id)}>
          <i className="bi bi-eye" /> Voir
        </button>
        <button className="abr-card__btn abr-card__btn--edit" onClick={() => onAction('edit', branch.id)}>
          <i className="bi bi-pencil" /> Modifier
        </button>
        <button className="abr-card__btn abr-card__btn--map" onClick={() => onAction('map', branch.id)}>
          <i className="bi bi-geo-alt" />
        </button>
      </div>
    </div>
  );
}
