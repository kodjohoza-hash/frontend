import React from 'react';
import { formatCurrency, commissionStatusConfig } from '../../../data/adminCommissionData';

export default function AdminCommissionProfile({ commission }) {
  if (!commission) return null;
  const sc = commissionStatusConfig[commission.status] || {};
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{commission.ref}</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A' }}>{commission.companyName}</div>
        </div>
        <span className={`adcm-badge adcm-badge--${commission.status}`} style={{ background: sc.bg, color: sc.color }}>{sc.label || commission.status}</span>
      </div>
      <div className="adcm-profile-grid">
        <div className="adcm-profile-field"><label>Trip</label><span>{commission.tripName}</span></div>
        <div className="adcm-profile-field"><label>Bus</label><span>{commission.busNumber || '—'}</span></div>
        <div className="adcm-profile-field"><label>Ticket</label><span>{commission.ticketRef}</span></div>
        <div className="adcm-profile-field"><label>Client</label><span>{commission.clientName}</span></div>
        <div className="adcm-profile-field"><label>Gross Amount</label><span style={{ fontWeight: 700 }}>{formatCurrency(commission.grossAmount)}</span></div>
        <div className="adcm-profile-field"><label>Commission ({commission.rate})</label><span style={{ fontWeight: 700, color: '#059669' }}>{formatCurrency(commission.commission)}</span></div>
        <div className="adcm-profile-field"><label>Tax</label><span>{formatCurrency(commission.tax)}</span></div>
        <div className="adcm-profile-field"><label>Net Amount</label><span style={{ fontWeight: 700 }}>{formatCurrency(commission.netAmount)}</span></div>
        <div className="adcm-profile-field"><label>City</label><span>{commission.city}</span></div>
        <div className="adcm-profile-field"><label>Country</label><span>{commission.country}</span></div>
        <div className="adcm-profile-field"><label>Date</label><span>{commission.date}</span></div>
        <div className="adcm-profile-field"><label>Due Date</label><span>{commission.dueDate}</span></div>
        {commission.paidDate && <div className="adcm-profile-field"><label>Paid Date</label><span>{commission.paidDate}</span></div>}
      </div>
      {commission.notes && (
        <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: 10, fontSize: '0.85rem', color: '#475569', border: '1px solid #F1F5F9' }}>
          <i className="fa-solid fa-note-sticky" style={{ color: '#94A3B8', marginRight: '0.4rem' }} />{commission.notes}
        </div>
      )}
    </>
  );
}
