import React from 'react';
import { formatCurrency, durationLabels, planStatusConfig } from '../../../data/adminSubscriptionData';

export default function AdminSubscriptionTable({
  plans, onSelect, onEdit, onDuplicate, onArchive, onDelete, onViewCompanies, onViewRevenue, onHistory, perPage, page,
}) {
  if (!plans || plans.length === 0) {
    return (
      <div className="adms-table-wrapper">
        <div className="adms-empty"><i className="fa-solid fa-boxes-stacked" /><h3>No Plans Found</h3><p>Try adjusting your filters or create a new plan.</p></div>
      </div>
    );
  }
  return (
    <div className="adms-table-wrapper">
      <table className="adms-table">
        <thead>
          <tr>
            <th>Plan</th>
            <th>Price</th>
            <th>Duration</th>
            <th>Companies</th>
            <th>Trial</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {plans.map(p => {
            const sc = planStatusConfig[p.status] || { label: p.status, color: '#6B7280', bg: 'transparent' };
            return (
              <tr key={p.id} onClick={() => onSelect(p)}>
                <td>
                  <div className="adms-plan-name-row">
                    <div className="adms-plan-dot" style={{ background: p.color || '#8B5CF6' }} />
                    <div>
                      <div className="adms-plan-name">{p.name} {p.popular && <span className="adms-badge adms-badge--popular">POPULAR</span>}</div>
                      <div className="adms-plan-desc">{p.description}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={p.price === 0 ? 'adms-price-free' : 'adms-price'}>
                    {p.price === 0 ? 'Free' : formatCurrency(p.price, p.currency)}
                  </span>
                  <div style={{ fontSize: '0.68rem', color: '#94A3B8' }}>{p.currency}</div>
                </td>
                <td><span className="adms-badge" style={{ background: '#F1F5F9', color: '#475569' }}>{durationLabels[p.duration] || p.duration}</span></td>
                <td style={{ fontWeight: 600 }}>{p.companiesCount}</td>
                <td style={{ fontSize: '0.8rem' }}>{p.trialDays > 0 ? `${p.trialDays} days` : '—'}</td>
                <td>
                  <span className={`adms-badge adms-badge--${p.status}`} style={{ background: sc.bg, color: sc.color }}>
                    <i className={`fa-solid ${p.status === 'active' ? 'fa-circle' : p.status === 'archived' ? 'fa-box-archive' : 'fa-pen'}`} style={{ fontSize: '0.5rem' }} /> {sc.label}
                  </span>
                </td>
                <td style={{ fontSize: '0.8rem', color: '#64748B' }}>{p.createdAt}</td>
                <td onClick={e => e.stopPropagation()}>
                  <div className="adms-table-actions">
                    <button className="adms-action-btn adms-action-btn--view" title="View" onClick={() => onSelect(p)}><i className="fa-solid fa-eye" /></button>
                    <button className="adms-action-btn adms-action-btn--edit" title="Edit" onClick={() => onEdit(p)}><i className="fa-solid fa-pen" /></button>
                    <button className="adms-action-btn adms-action-btn--copy" title="Duplicate" onClick={() => onDuplicate(p)}><i className="fa-solid fa-copy" /></button>
                    {p.status !== 'archived'
                      ? <button className="adms-action-btn adms-action-btn--archive" title="Archive" onClick={() => onArchive(p)}><i className="fa-solid fa-box-archive" /></button>
                      : <button className="adms-action-btn adms-action-btn--unarchive" title="Reactivate" onClick={() => onArchive(p)}><i className="fa-solid fa-box-open" /></button>}
                    <button className="adms-action-btn adms-action-btn--delete" title="Delete" onClick={() => onDelete(p)}><i className="fa-solid fa-trash-can" /></button>
                    <button className="adms-action-btn adms-action-btn--users" title="Companies" onClick={() => onViewCompanies(p)}><i className="fa-solid fa-building" /></button>
                    <button className="adms-action-btn adms-action-btn--revenue" title="Revenue" onClick={() => onViewRevenue(p)}><i className="fa-solid fa-chart-simple" /></button>
                    <button className="adms-action-btn adms-action-btn--history" title="History" onClick={() => onHistory(p)}><i className="fa-solid fa-clock-rotate-left" /></button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
