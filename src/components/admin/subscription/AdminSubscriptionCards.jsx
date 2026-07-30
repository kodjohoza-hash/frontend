import React from 'react';
import { formatCurrency, durationLabels } from '../../../data/adminSubscriptionData';

export default function AdminSubscriptionCards({ plans, onSelect, onEdit, onDuplicate, onArchive, onDelete }) {
  if (!plans || plans.length === 0) {
    return (
      <div className="adms-cards-grid" style={{ display: 'grid' }}>
        <div className="adms-empty" style={{ gridColumn: '1 / -1' }}><i className="fa-solid fa-boxes-stacked" /><h3>No Plans Found</h3></div>
      </div>
    );
  }
  return (
    <div className="adms-cards-grid">
      {plans.map(p => (
        <div className={`adms-plan-card ${p.popular ? 'adms-plan-card--popular' : ''}`} key={p.id} onClick={() => onSelect(p)}>
          {p.popular && <div className="adms-compare-badge">Popular</div>}
          <div className="adms-plan-card-header">
            <div className="adms-plan-dot" style={{ background: p.color || '#8B5CF6', width: 18, height: 18 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0F172A' }}>{p.name}</div>
              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>{p.description}</div>
            </div>
            <span className={`adms-badge adms-badge--${p.status}`}>{p.status === 'active' ? 'Active' : p.status === 'archived' ? 'Archived' : 'Draft'}</span>
          </div>
          <div className="adms-plan-card-body">
            <div className="adms-plan-card-stat"><span>Price</span><span>{p.price === 0 ? 'Free' : formatCurrency(p.price, p.currency)}</span></div>
            <div className="adms-plan-card-stat"><span>Duration</span><span>{durationLabels[p.duration] || p.duration}</span></div>
            <div className="adms-plan-card-stat"><span>Trial</span><span>{p.trialDays > 0 ? `${p.trialDays} days` : 'None'}</span></div>
            <div className="adms-plan-card-stat"><span>Companies</span><span>{p.companiesCount}</span></div>
            <div className="adms-plan-card-stat" style={{ border: 'none' }}><span>Revenue</span><span>{formatCurrency(p.revenue, p.currency)}</span></div>
          </div>
          <div className="adms-plan-card-actions">
            <button className="adms-action-btn adms-action-btn--view" title="View" onClick={e => { e.stopPropagation(); onSelect(p); }}><i className="fa-solid fa-eye" /></button>
            <button className="adms-action-btn adms-action-btn--edit" title="Edit" onClick={e => { e.stopPropagation(); onEdit(p); }}><i className="fa-solid fa-pen" /></button>
            <button className="adms-action-btn adms-action-btn--copy" title="Duplicate" onClick={e => { e.stopPropagation(); onDuplicate(p); }}><i className="fa-solid fa-copy" /></button>
            {p.status !== 'archived'
              ? <button className="adms-action-btn adms-action-btn--archive" title="Archive" onClick={e => { e.stopPropagation(); onArchive(p); }}><i className="fa-solid fa-box-archive" /></button>
              : <button className="adms-action-btn adms-action-btn--unarchive" title="Reactivate" onClick={e => { e.stopPropagation(); onArchive(p); }}><i className="fa-solid fa-box-open" /></button>}
            <button className="adms-action-btn adms-action-btn--delete" title="Delete" onClick={e => { e.stopPropagation(); onDelete(p); }}><i className="fa-solid fa-trash-can" /></button>
          </div>
        </div>
      ))}
    </div>
  );
}
