import clsx from 'clsx';

const CounterProfileQuickActions = ({ actions = [], onAction }) => {
  if (!actions.length) return null;

  return (
    <div className="acpr-card">
      <div className="acpr-card-header">
        <i className="bi bi-lightning-fill" />
        <span>Actions rapides</span>
      </div>
      <div className="acpr-actions-grid">
        {actions.map((action) => (
          <button
            key={action.id}
            className="acpr-action-card"
            onClick={() => onAction?.(action.id)}
          >
            <div
              className="acpr-action-icon"
              style={{
                background: action.color ? `${action.color}15` : '#F3F4F6',
                color: action.color || '#6B7280',
              }}
            >
              <i className={clsx('bi', action.icon || 'bi-circle')} />
            </div>
            <div className="acpr-action-body">
              <div className="acpr-action-title">{action.title}</div>
              {action.description && (
                <div className="acpr-action-desc">{action.description}</div>
              )}
            </div>
            <i className="bi bi-chevron-right acpr-action-arrow" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default CounterProfileQuickActions;
