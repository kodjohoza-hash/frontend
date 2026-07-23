import clsx from 'clsx';

const NotificationsHeader = ({ unreadCount, totalCount, onMarkAllRead, onDeleteRead }) => {
  return (
    <div className="nf-page__header">
      <div className="nf-page__title-group">
        <h1 className="nf-page__title">Notifications</h1>
        <p className="nf-page__subtitle">Retrouvez toutes vos activités et alertes importantes.</p>
      </div>
      <div className="nf-page__actions">
        <button
          type="button"
          className="nf-btn nf-btn--outline"
          onClick={onMarkAllRead}
          disabled={unreadCount === 0}
        >
          <i className="bi bi-check-all" />
          Tout marquer comme lu
        </button>
        <button
          type="button"
          className="nf-btn nf-btn--danger-outline"
          onClick={onDeleteRead}
        >
          <i className="bi bi-trash3" />
          Supprimer les lues
        </button>
      </div>
    </div>
  );
};

export default NotificationsHeader;
