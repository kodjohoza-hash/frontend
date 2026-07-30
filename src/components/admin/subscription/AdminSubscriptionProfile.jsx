import React from 'react';
import { formatCurrency, durationLabels } from '../../../data/adminSubscriptionData';

export default function AdminSubscriptionProfile({ plan }) {
  if (!plan) return null;
  return (
    <>
      <div className="adms-profile-header">
        <div className="adms-profile-dot" style={{ background: `linear-gradient(135deg, ${plan.color}, ${plan.color}dd)` }}>
          <i className="fa-solid fa-box" style={{ color: '#fff', fontSize: '1.3rem' }} />
        </div>
        <div className="adms-profile-meta">
          <h4>{plan.name}</h4>
          <p>
            <span className="adms-badge" style={{ background: plan.status === 'active' ? 'rgba(16,185,129,0.1)' : 'rgba(107,114,128,0.08)', color: plan.status === 'active' ? '#065F46' : '#4B5563' }}>
              {plan.status === 'active' ? 'Active' : plan.status === 'archived' ? 'Archived' : 'Draft'}
            </span>
            {plan.popular && <span className="adms-badge adms-badge--popular">POPULAR</span>}
            <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{formatCurrency(plan.price, plan.currency)}</span>
            <span style={{ color: '#94A3B8' }}>/ {durationLabels[plan.duration] || plan.duration}</span>
          </p>
        </div>
      </div>
      <div className="adms-profile-grid">
        <div className="adms-profile-field"><label>Trial Period</label><span>{plan.trialDays > 0 ? `${plan.trialDays} days` : 'No trial'}</span></div>
        <div className="adms-profile-field"><label>Currency</label><span>{plan.currency}</span></div>
        <div className="adms-profile-field"><label>Companies</label><span>{plan.companiesCount} subscribed</span></div>
        <div className="adms-profile-field"><label>Max Buses</label><span>{plan.maxBuses === -1 ? 'Unlimited' : plan.maxBuses}</span></div>
        <div className="adms-profile-field"><label>Max Agents</label><span>{plan.maxAgents === -1 ? 'Unlimited' : plan.maxAgents}</span></div>
        <div className="adms-profile-field"><label>Max Branches</label><span>{plan.maxBranches === -1 ? 'Unlimited' : plan.maxBranches}</span></div>
        <div className="adms-profile-field"><label>Max Trips</label><span>{plan.maxTrips === -1 ? 'Unlimited' : plan.maxTrips}</span></div>
        <div className="adms-profile-field"><label>Storage</label><span>{plan.storage}</span></div>
        <div className="adms-profile-field"><label>Support</label><span>{plan.supportIncluded || '—'}</span></div>
        <div className="adms-profile-field"><label>API Access</label><span>{plan.apiIncluded ? '✓ Included' : '✗ Not included'}</span></div>
        <div className="adms-profile-field"><label>Created</label><span>{plan.createdAt}</span></div>
        <div className="adms-profile-field"><label>Revenue</label><span>{formatCurrency(plan.revenue, plan.currency)}</span></div>
      </div>
      {plan.description && (
        <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', background: '#F8FAFC', borderRadius: 10, fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, border: '1px solid #F1F5F9' }}>
          <i className="fa-solid fa-quote-left" style={{ color: '#CBD5E1', marginRight: '0.4rem' }} />{plan.description}
        </div>
      )}
    </>
  );
}
