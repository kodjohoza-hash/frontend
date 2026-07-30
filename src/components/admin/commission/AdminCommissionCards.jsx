import React from 'react';
import { formatCurrency, commissionStatusConfig } from '../../../data/adminCommissionData';

export default function AdminCommissionCards({ commissions, onSelect }) {
  if (!commissions || commissions.length === 0) return null;
  return (
    <div className="adcm-cards-grid">
      {commissions.map(c => {
        const sc = commissionStatusConfig[c.status] || {};
        return (
          <div className="adcm-card" key={c.id} onClick={() => onSelect(c)}>
            <div className="adcm-card-header">
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{c.ref}</div>
                <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{c.companyName}</div>
              </div>
              <span className={`adcm-badge adcm-badge--${c.status}`} style={{ background: sc.bg, color: sc.color }}>{sc.label || c.status}</span>
            </div>
            <div className="adcm-card-body">
              <span><i className="fa-solid fa-bus" /> {c.tripName}</span>
              <span><i className="fa-solid fa-ticket" /> {c.ticketRef}</span>
              <span><i className="fa-solid fa-coins" /> Comm: {formatCurrency(c.commission)}</span>
              <span><i className="fa-regular fa-calendar" /> {c.date}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem' }}>
              <span>Gross: <strong>{formatCurrency(c.grossAmount)}</strong></span>
              <span>Net: <strong>{formatCurrency(c.netAmount)}</strong></span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
