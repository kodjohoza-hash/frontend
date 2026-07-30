import clsx from 'clsx';
import CounterNotificationCard from './CounterNotificationCard';

const ITEMS_PER_PAGE = 12;

const CounterNotificationList = ({ notifications = [], onAction, onSelect, selectedId, page = 1, onPageChange }) => {
  const totalPages = Math.max(1, Math.ceil(notifications.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * ITEMS_PER_PAGE;
  const pageItems = notifications.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  if (!notifications || notifications.length === 0) {
    return (
      <div className="acn-list-empty">
        <div className="acn-list-empty-icon">
          <i className="bi bi-inbox" />
        </div>
        <div className="acn-list-empty-title">Aucune notification</div>
        <div className="acn-list-empty-text">
          Aucune notification ne correspond à vos critères pour le moment.
        </div>
      </div>
    );
  }

  return (
    <div className="acn-list">
      <div className="acn-list-header">
        <div className="acn-list-count">
          <i className="bi bi-bell" />
          <span>{notifications.length} notification{notifications.length > 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="acn-list-cards">
        {pageItems.map((n) => (
          <CounterNotificationCard
            key={n.id}
            notification={n}
            onAction={onAction}
            onSelect={onSelect}
            isSelected={selectedId === n.id}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="acn-pagination">
          <button
            className="acn-pagination-btn"
            disabled={safePage <= 1}
            onClick={() => onPageChange?.(safePage - 1)}
          >
            <i className="bi bi-chevron-left" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={clsx('acn-pagination-btn', { active: p === safePage })}
              onClick={() => onPageChange?.(p)}
            >
              {p}
            </button>
          ))}
          <button
            className="acn-pagination-btn"
            disabled={safePage >= totalPages}
            onClick={() => onPageChange?.(safePage + 1)}
          >
            <i className="bi bi-chevron-right" />
          </button>
        </div>
      )}
    </div>
  );
};

export default CounterNotificationList;
