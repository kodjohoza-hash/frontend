import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { quickActions } from '@data/clientDashboard';

const DbQuickActions = () => {
  return (
    <section className="db-card db-actions">
      <div className="db-card__header">
        <h3 className="db-card__title">
          <i className="bi bi-lightning-charge" />
          Actions rapides
        </h3>
      </div>
      <div className="db-actions__grid">
        {quickActions.map((qa) => (
          <Link key={qa.id} to={qa.path} className={clsx('db-actions__item', `db-actions__item--${qa.color}`)}>
            <div className={clsx('db-actions__icon', `db-actions__icon--${qa.color}`)}>
              <i className={clsx('bi', qa.icon)} />
            </div>
            <span className="db-actions__label">{qa.label}</span>
            <span className="db-actions__desc">{qa.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default DbQuickActions;
