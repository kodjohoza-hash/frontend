export default function AgencyQuickActions({ actions, onAction }) {
  return (
    <div className="apro-section">
      <div className="apro-section__header">
        <h3 className="apro-section__title"><i className="bi bi-lightning" /> Actions rapides</h3>
      </div>
      <div className="apro-section__body">
        <div className="apro-actions">
          {actions.map((action) => (
            <button key={action.id} className="apro-action-btn" onClick={() => onAction(action.id)}>
              <i className={`bi ${action.icon}`} />
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
