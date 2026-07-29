import clsx from 'clsx';

const CounterQuickActions = ({ actions }) => (
  <div className="act-card">
    <div className="act-card__header">
      <h3 className="act-card__title">
        <i className="bi bi-lightning-fill" />
        Actions rapides
      </h3>
    </div>
    <div className="act-actions__grid">
      {actions.map((action) => (
        <a
          key={action.id}
          href={action.link}
          className="act-action-btn"
        >
          <div className={clsx('act-action-btn__icon', `act-action-btn__icon--${action.color}`)}>
            <i className={`bi ${action.icon}`} />
          </div>
          <span className="act-action-btn__label">{action.label}</span>
          <span className="act-action-btn__desc">{action.desc}</span>
        </a>
      ))}
    </div>
  </div>
);

export default CounterQuickActions;
