import React from 'react';

const statusColors = {
  pending: 'warning',
  under_review: 'info',
  more_info: 'danger-light',
  approved: 'success',
  refused: 'danger',
  suspended: 'danger-light',
  flagged: 'accent',
};

const statusIcons = {
  pending: 'fa-clock',
  under_review: 'fa-magnifying-glass',
  more_info: 'fa-circle-exclamation',
  approved: 'fa-check-circle',
  refused: 'fa-xmark-circle',
  suspended: 'fa-pause-circle',
  flagged: 'fa-flag',
};

const statusLabels = {
  pending: 'Pending',
  under_review: 'Under Review',
  more_info: 'More Info',
  approved: 'Approved',
  refused: 'Refused',
  suspended: 'Suspended',
  flagged: 'Flagged',
};

const uniqColor = (n) => {
  const colors = ['#1E1B4B','#065F46','#92400E','#991B1B','#1E40AF','#6D28D9','#0F766E','#7C2D12','#3730A3','#78350F'];
  return colors[n % colors.length];
};

export default function AdminApprovalTable({
  requests, onSelect, onViewDocs, onApprove, onRefuse, onMarkInfo, onSuspend, onReactivate, onHistory,
}) {
  if (!requests || requests.length === 0) {
    return (
      <div className="adma-table-wrapper">
        <div className="adma-empty"><i className="fa-solid fa-file-circle-check" /><h3>No Requests Found</h3><p>Try adjusting your search or filters.</p></div>
      </div>
    );
  }
  return (
    <>
      <div className="adma-table-wrapper">
        <table className="adma-table">
          <thead>
            <tr>
              <th>Company</th>
              <th>Owner</th>
              <th>Type</th>
              <th>Submitted</th>
              <th>Urgency</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r, i) => (
              <tr key={r.id} onClick={() => onSelect(r)}>
                <td>
                  <div className="adma-table-name-row">
                    <div className={`adma-logo adma-logo--${i % 8}`}>{r.company?.charAt(0)}</div>
                    <div>
                      <div className="adma-table-name">{r.company}</div>
                      <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>#{r.id}</div>
                    </div>
                  </div>
                </td>
                <td>{r.owner}</td>
                <td>{r.type}</td>
                <td>{r.submitted}</td>
                <td>
                  <span className="adma-badge" style={{
                    background: r.urgency === 'urgent' ? 'rgba(239,68,68,0.1)' : r.urgency === 'high' ? 'rgba(245,158,11,0.1)' : 'rgba(107,114,128,0.1)',
                    color: r.urgency === 'urgent' ? '#EF4444' : r.urgency === 'high' ? '#F59E0B' : '#6B7280',
                  }}>
                    {r.urgency === 'urgent' ? '🔴' : r.urgency === 'high' ? '🟡' : '⚪'} {r.urgency}
                  </span>
                </td>
                <td>
                  <span className={`adma-badge adma-badge--${statusColors[r.status] || 'warning'}`}>
                    <i className={`fa-solid ${statusIcons[r.status] || 'fa-circle'}`} /> {statusLabels[r.status] || r.status}
                  </span>
                </td>
                <td onClick={e => e.stopPropagation()}>
                  <div className="adma-table-actions">
                    <button className="adma-action-btn adma-action-btn--view" title="View Details" onClick={() => onSelect(r)}><i className="fa-solid fa-eye" /></button>
                    <button className="adma-action-btn adma-action-btn--docs" title="Documents" onClick={() => onViewDocs(r)}><i className="fa-solid fa-file-lines" /></button>
                    {r.status === 'pending' && (
                      <button className="adma-action-btn adma-action-btn--approve" title="Approve" onClick={() => onApprove(r)}><i className="fa-solid fa-check" /></button>
                    )}
                    {(r.status === 'pending' || r.status === 'under_review') && (
                      <button className="adma-action-btn adma-action-btn--refuse" title="Refuse" onClick={() => onRefuse(r)}><i className="fa-solid fa-xmark" /></button>
                    )}
                    {(r.status === 'pending' || r.status === 'under_review') && (
                      <button className="adma-action-btn adma-action-btn--info" title="Request More Info" onClick={() => onMarkInfo(r)}><i className="fa-solid fa-circle-exclamation" /></button>
                    )}
                    {r.status === 'approved' && (
                      <button className="adma-action-btn adma-action-btn--suspend" title="Suspend" onClick={() => onSuspend(r)}><i className="fa-solid fa-pause" /></button>
                    )}
                    {(r.status === 'suspended' || r.status === 'refused') && (
                      <button className="adma-action-btn adma-action-btn--reactivate" title="Reactivate" onClick={() => onReactivate(r)}><i className="fa-solid fa-rotate" /></button>
                    )}
                    <button className="adma-action-btn adma-action-btn--history" title="History" onClick={() => onHistory(r)}><i className="fa-solid fa-clock-rotate-left" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="adma-cards">
        {requests.map((r, i) => (
          <div className="adma-card" key={r.id} onClick={() => onSelect(r)}>
            <div className="adma-card-header">
              <div className={`adma-logo adma-logo--${i % 8}`}>{r.company?.charAt(0)}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{r.company}</div>
                <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>#{r.id} • {r.owner}</div>
              </div>
              <span className={`adma-badge adma-badge--${statusColors[r.status] || 'warning'}`}>
                <i className={`fa-solid ${statusIcons[r.status] || 'fa-circle'}`} /> {statusLabels[r.status] || r.status}
              </span>
            </div>
            <div className="adma-card-body">
              <span><i className="fa-regular fa-building" /> {r.type}</span>
              <span><i className="fa-regular fa-calendar" /> {r.submitted}</span>
              <span>
                <i className="fa-solid fa-circle" style={{
                  color: r.urgency === 'urgent' ? '#EF4444' : r.urgency === 'high' ? '#F59E0B' : '#6B7280', fontSize: '0.5rem'
                }} /> {r.urgency}
              </span>
            </div>
            <div className="adma-card-actions">
              <button className="adma-action-btn adma-action-btn--view" title="View Details" onClick={e => { e.stopPropagation(); onSelect(r); }}><i className="fa-solid fa-eye" /></button>
              <button className="adma-action-btn adma-action-btn--docs" title="Documents" onClick={e => { e.stopPropagation(); onViewDocs(r); }}><i className="fa-solid fa-file-lines" /></button>
              {r.status === 'pending' && (
                <button className="adma-action-btn adma-action-btn--approve" title="Approve" onClick={e => { e.stopPropagation(); onApprove(r); }}><i className="fa-solid fa-check" /></button>
              )}
              {(r.status === 'pending' || r.status === 'under_review') && (
                <button className="adma-action-btn adma-action-btn--refuse" title="Refuse" onClick={e => { e.stopPropagation(); onRefuse(r); }}><i className="fa-solid fa-xmark" /></button>
              )}
              {(r.status === 'pending' || r.status === 'under_review') && (
                <button className="adma-action-btn adma-action-btn--info" title="Request More Info" onClick={e => { e.stopPropagation(); onMarkInfo(r); }}><i className="fa-solid fa-circle-exclamation" /></button>
              )}
              {r.status === 'approved' && (
                <button className="adma-action-btn adma-action-btn--suspend" title="Suspend" onClick={e => { e.stopPropagation(); onSuspend(r); }}><i className="fa-solid fa-pause" /></button>
              )}
              {(r.status === 'suspended' || r.status === 'refused') && (
                <button className="adma-action-btn adma-action-btn--reactivate" title="Reactivate" onClick={e => { e.stopPropagation(); onReactivate(r); }}><i className="fa-solid fa-rotate" /></button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
