import React from 'react';
import { ruleStatusConfig, commissionTypes, formatCurrency } from '../../../data/adminCommissionData';

export default function AdminCommissionRules({ rules, onToggleStatus }) {
  if (!rules || rules.length === 0) {
    return <div className="adcm-empty"><i className="fa-solid fa-scale-balanced" /><h3>No Rules</h3><p>Create a commission rule.</p></div>;
  }
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="adcm-rules-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Value</th>
            <th>Applies To</th>
            <th>Priority</th>
            <th>Period</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rules.map(r => {
            const sc = ruleStatusConfig[r.status] || { label: r.status, color: '#6B7280', bg: 'transparent' };
            const typeLabel = commissionTypes.find(t => t.id === r.type)?.label || r.type;
            const valueStr = r.type === 'percentage' ? `${r.value}%` : r.type === 'mixed' ? `${r.value}% + ${formatCurrency(r.fixedPart || 0)}` : r.type === 'fixed' ? formatCurrency(r.value) : r.type === 'per_ticket' ? `${formatCurrency(r.value)}/ticket` : `${r.value}`;
            return (
              <tr key={r.id}>
                <td>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', color: '#0F172A' }}>{r.name}</div>
                  <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{r.description}</div>
                </td>
                <td><span className="adcm-badge" style={{ background: '#F1F5F9', color: '#475569' }}>{typeLabel}</span></td>
                <td style={{ fontWeight: 600 }}>{valueStr}</td>
                <td style={{ fontSize: '0.78rem', textTransform: 'capitalize' }}>{r.appliesTo?.replace(/_/g, ' ')}</td>
                <td style={{ textAlign: 'center' }}>{r.priority}</td>
                <td style={{ fontSize: '0.72rem', color: '#64748B' }}>{r.startDate}{r.endDate ? ` → ${r.endDate}` : ' → ∞'}</td>
                <td>
                  <span className={`adcm-badge adcm-badge--${r.status}`} style={{ background: sc.bg, color: sc.color }}>{sc.label}</span>
                </td>
                <td>
                  <button
                    className={`adcm-action-btn ${r.status === 'active' ? 'adcm-action-btn--suspend' : 'adcm-action-btn--reactivate'}`}
                    title={r.status === 'active' ? 'Suspend' : 'Reactivate'}
                    onClick={() => onToggleStatus(r)}
                  >
                    <i className={`fa-solid ${r.status === 'active' ? 'fa-pause' : 'fa-play'}`} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
