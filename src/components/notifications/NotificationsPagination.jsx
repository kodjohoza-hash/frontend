import clsx from 'clsx';

const NotificationsPagination = ({ page, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  const pages = [];
  for (let i = start; i <= end; i += 1) pages.push(i);

  return (
    <div className="nf-pagination">
      <button
        type="button"
        className="nf-pagination__btn"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        aria-label="Page précédente"
      >
        <i className="bi bi-chevron-left" />
      </button>
      {start > 1 && <span className="nf-pagination__ellipsis">…</span>}
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          className={clsx('nf-pagination__btn', p === page && 'nf-pagination__btn--active')}
          onClick={() => onPageChange(p)}
          aria-current={p === page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}
      {end < totalPages && <span className="nf-pagination__ellipsis">…</span>}
      <button
        type="button"
        className="nf-pagination__btn"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        aria-label="Page suivante"
      >
        <i className="bi bi-chevron-right" />
      </button>
    </div>
  );
};

export default NotificationsPagination;
