import React from 'react';
import { formatCurrency, billingStatusConfig } from '../../../data/adminSubscriptionData';

export default function AdminSubscriptionBilling({ records }) {
  if (!records || records.length === 0) {
    return (
      <div className="adms-empty" style={{ padding: '2rem 0' }}>
        <i className="fa-solid fa-file-invoice" style={{ fontSize: '2rem' }} />
        <h3 style={{ fontSize: '0.95rem' }}>No Billing Records</h3>
        <p style={{ fontSize: '0.8rem' }}>No payments recorded yet.</p>
      </div>
    );
  }
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="adms-billing-table">
        <thead>
          <tr>
            <th>Invoice</th>
            <th>Company</th>
            <th>Amount</th>
            <th>Tax</th>
            <th>Total</th>
            <th>Status</th>
            <th>Date</th>
            <th>Method</th>
          </tr>
        </thead>
        <tbody>
          {records.map(inv => {
            const sc = billingStatusConfig[inv.status] || { label: inv.status, color: '#6B7280', bg: 'transparent' };
            return (
              <tr key={inv.id}>
                <td style={{ fontWeight: 600, fontSize: '0.75rem', color: '#0F172A' }}>{inv.id}</td>
                <td style={{ fontSize: '0.78rem' }}>{inv.companyName}</td>
                <td style={{ fontWeight: 600 }}>{formatCurrency(inv.amount, 'XAF')}</td>
                <td style={{ fontSize: '0.78rem', color: '#64748B' }}>{formatCurrency(inv.tax, 'XAF')}</td>
                <td style={{ fontWeight: 700, color: '#0F172A' }}>{formatCurrency(inv.total, 'XAF')}</td>
                <td>
                  <span className={`adms-badge adms-badge--${inv.status}`} style={{ background: sc.bg, color: sc.color }}>
                    {sc.label}
                  </span>
                </td>
                <td style={{ fontSize: '0.75rem', color: '#64748B' }}>{inv.paymentDate || '—'}</td>
                <td style={{ fontSize: '0.75rem', color: '#64748B' }}>{inv.paymentMethod || '—'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
