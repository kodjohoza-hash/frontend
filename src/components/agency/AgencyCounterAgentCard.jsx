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

export default function AgencyCounterAgentCard({ agent, onAction }) {
  return (
    <div className="ac-card">
      <div className="ac-card__header">
        <div className={`ac-card__avatar ac-card__avatar--${agent.gender === 'F' ? 'female' : 'male'}`}>
          {getInitials(agent.firstName, agent.lastName)}
        </div>
        <div className="ac-card__identity">
          <h4 className="ac-card__name">{agent.firstName} {agent.lastName}</h4>
          <span className="ac-card__id">{agent.id} · {agent.position}</span>
        </div>
        <AgencyCounterAgentStatus status={agent.status} />
      </div>
      <div className="ac-card__body">
        <div className="ac-card__row">
          <i className="bi bi-telephone" /><span>{agent.phone}</span>
        </div>
        <div className="ac-card__row">
          <i className="bi bi-envelope" /><span>{agent.email}</span>
        </div>
        <div className="ac-card__row">
          <i className="bi bi-building" /><span>{getAgencyName(agent.agency)}</span>
        </div>
        <div className="ac-card__row">
          <i className="bi bi-shop" /><span>{getPDVName(agent.pointDeVente)}</span>
        </div>
        <div className="ac-card__row">
          <i className="bi bi-calendar" /><span>Embauché le {new Date(agent.hireDate).toLocaleDateString('fr-FR')}</span>
        </div>
      </div>
      <div className="ac-card__footer">
        <button className="ac-card__btn ac-card__btn--view" onClick={() => onAction('view', agent.id)}>
          <i className="bi bi-eye" /> Voir
        </button>
        <button className="ac-card__btn ac-card__btn--edit" onClick={() => onAction('edit', agent.id)}>
          <i className="bi bi-pencil" /> Modifier
        </button>
      </div>
    </div>
  );
}
