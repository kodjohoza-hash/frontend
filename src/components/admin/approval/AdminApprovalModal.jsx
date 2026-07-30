import React from 'react';

export default function AdminApprovalModal({
  isOpen, onClose, onConfirm, title, message, confirmLabel, confirmClass, icon,
}) {
  if (!isOpen) return null;
  return (
    <div className="adma-modal-overlay" onClick={onClose}>
      <div className="adma-modal" onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          <i className={`fa-solid ${icon || 'fa-circle-question'}`}
            style={{ color: confirmClass === 'danger' ? '#EF4444' : confirmClass === 'success' ? '#10B981' : 'var(--adm-accent)' }} />
        </div>
        <h3>{title || 'Confirm Action'}</h3>
        <p>{message || 'Are you sure you want to proceed?'}</p>
        <div className="adma-modal-actions">
          <button className="adma-btn--cancel" onClick={onClose}>Cancel</button>
          <button className={`adma-btn--${confirmClass || 'primary'}`} onClick={onConfirm}>
            {confirmLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}
