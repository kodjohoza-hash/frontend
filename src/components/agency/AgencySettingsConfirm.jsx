export default function AgencySettingsConfirm({
  show, title, message, type = 'warning',
  confirmLabel, cancelLabel,
  onConfirm, onCancel, loading,
}) {
  if (!show) return null;

  return (
    <div className="aset-modal-overlay" onClick={onCancel}>
      <div className="aset-modal" onClick={(e) => e.stopPropagation()}>
        <div className={`aset-modal__icon aset-modal__icon--${type}`}>
          <i className={type === 'danger' ? 'bi bi-exclamation-triangle' : 'bi bi-exclamation-circle'} />
        </div>
        <h3 className="aset-modal__title">{title}</h3>
        <p className="aset-modal__desc">{message}</p>
        <div className="aset-modal__actions">
          <button className="aset-btn aset-btn--outline" onClick={onCancel}>
            {cancelLabel || 'Annuler'}
          </button>
          <button
            className={`aset-btn ${type === 'danger' ? 'aset-btn--danger' : 'aset-btn--primary'}`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? <span className="aset-btn--loading">Saving</span> : confirmLabel || 'Confirmer'}
          </button>
        </div>
      </div>
    </div>
  );
}
