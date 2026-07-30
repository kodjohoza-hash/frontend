import React from 'react';

export default function AdminSubscriptionModal({
  isOpen, onClose, onConfirm, title, message, confirmLabel, confirmClass, icon, children,
}) {
  if (!isOpen) return null;
  return (
    <div className="adms-modal-overlay" onClick={onClose}>
      <div className="adms-modal" onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: 'center', fontSize: '2.75rem', marginBottom: '0.5rem' }}>
          <i className={`fa-solid ${icon || 'fa-circle-question'}`}
            style={{ color: confirmClass === 'danger' ? '#EF4444' : confirmClass === 'success' ? '#10B981' : confirmClass === 'warning' ? '#F59E0B' : 'var(--adm-accent)' }} />
        </div>
        <h3>{title || 'Confirm Action'}</h3>
        <p>{message || 'Are you sure?'}</p>
        {children}
        <div className="adms-modal-actions">
          <button className="adms-btn--cancel" onClick={onClose}>Cancel</button>
          <button className={`adms-btn--${confirmClass || 'primary'}`} onClick={onConfirm}>
            {confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
