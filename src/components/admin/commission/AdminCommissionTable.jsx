import React from 'react';
import { formatCurrency, commissionStatusConfig } from '../../../data/adminCommissionData';

export default function AdminCommissionTable({ commissions, onSelect, onViewTxn, onViewCompany, onHistory }) {
  if (!commissions || commissions.length === 0) {
    return (
      <div className="adcm-table-wrapper">
        <div className="adcm-empty"><i className="fa-solid fa-coins" /><h3>No Commissions Found</h3><p>Try adjusting your filters.</p></div>
      </div>
    );
  }
  return (
    <div className="adcm-table-wrapper">
      <table className="adcm-table">
        <thead>
          <tr>
            <th>Reference</th>
            <th>Company</th>
            <th>Trip</th>
            <th>Gross</th>
            <th>Commission</th>
            <th>Net</th>
            <th>Status</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {commissions.map(c => {
            const sc = commissionStatusConfig[c.status] || { label: c.status, color: '#6B7280', bg: 'transparent' };
            return (
              <tr key={c.id} onClick={() => onSelect(c)}>
                <td><span className="adcm-ref">{c.ref}</span></td>
                <td><span className="adcm-company-name">{c.companyName}</span></td>
                <td style={{ fontSize: '0.8rem', color: '#475569' }}>{c.tripName}</td>
                <td className="adcm-amount">{formatCurrency(c.grossAmount)}</td>
                <td className="adcm-amount" style={{ color: '#059669' }}>{formatCurrency(c.commission)} <span style={{ fontWeight: 400, fontSize: '0.7rem', color: '#94A3B8' }}>({c.rate})</span></td>
                <td className="adcm-amount">{formatCurrency(c.netAmount)}</td>
                <td>
                  <span className={`adcm-badge adcm-badge--${c.status}`} style={{ background: sc.bg, color: sc.color }}>
                    {sc.label}
                  </span>
                </td>
                <td style={{ fontSize: '0.78rem', color: '#64748B' }}>{c.date}</td>
                <td onClick={e => e.stopPropagation()}>
                  <div className="adcm-table-actions">
                    <button className="adcm-action-btn adcm-action-btn--view" title="View" onClick={() => onSelect(c)}><i className="fa-solid fa-eye" /></button>
                    <button className="adcm-action-btn adcm-action-btn--txn" title="Transaction" onClick={() => onViewTxn(c)}><i className="fa-solid fa-receipt" /></button>
                    <button className="adcm-action-btn adcm-action-btn--company" title="Company" onClick={() => onViewCompany(c)}><i className="fa-solid fa-building" /></button>
                    <button className="adcm-action-btn adcm-action-btn--history" title="History" onClick={() => onHistory(c)}><i className="fa-solid fa-clock-rotate-left" /></button>
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
