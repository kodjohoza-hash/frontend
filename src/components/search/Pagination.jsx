import React from 'react';

const Pagination = React.memo(({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages = [];
    const delta = 1;
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    pages.push(1);
    if (left > 2) pages.push('...');
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push('...');
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const pages = getVisiblePages();

  const btnBase = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
    height: 40,
    borderRadius: 12,
    border: 'none',
    fontSize: 'var(--font-size-sm, 0.875rem)',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
    padding: '0 12px',
  };

  return (
    <nav
      aria-label="Pagination des résultats"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 32,
        padding: '16px 0',
      }}
    >
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Page précédente"
        style={{
          ...btnBase,
          background: currentPage === 1 ? 'var(--color-gray-100, #f3f4f6)' : 'var(--color-white, #fff)',
          color: currentPage === 1 ? 'var(--text-muted, #9ca3af)' : 'var(--text-secondary, #4b5563)',
          border: `1px solid ${currentPage === 1 ? 'transparent' : 'var(--color-gray-200, #e5e7eb)'}`,
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          gap: 6,
        }}
      >
        <i className="bi bi-chevron-left" style={{ fontSize: '0.7rem' }} />
        <span style={{ fontSize: 'var(--font-size-xs, 0.75rem)' }}>Précédent</span>
      </button>

      {/* Page numbers */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {pages.map((page, idx) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${idx}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                  color: 'var(--text-muted, #9ca3af)',
                  fontSize: 'var(--font-size-sm, 0.875rem)',
                  letterSpacing: 2,
                }}
                aria-hidden="true"
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              aria-label={`Page ${page}`}
              aria-current={isActive ? 'page' : undefined}
              style={{
                ...btnBase,
                background: isActive ? 'var(--color-primary, #0B1D51)' : 'transparent',
                color: isActive ? '#fff' : 'var(--text-secondary, #4b5563)',
                border: isActive ? 'none' : '1px solid transparent',
                minWidth: isActive ? 44 : 36,
                height: isActive ? 44 : 36,
                fontWeight: isActive ? 700 : 500,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--color-gray-100, #f3f4f6)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {page}
            </button>
          );
        })}
      </div>

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Page suivante"
        style={{
          ...btnBase,
          background: currentPage === totalPages ? 'var(--color-gray-100, #f3f4f6)' : 'var(--color-white, #fff)',
          color: currentPage === totalPages ? 'var(--text-muted, #9ca3af)' : 'var(--text-secondary, #4b5563)',
          border: `1px solid ${currentPage === totalPages ? 'transparent' : 'var(--color-gray-200, #e5e7eb)'}`,
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          gap: 6,
        }}
      >
        <span style={{ fontSize: 'var(--font-size-xs, 0.75rem)' }}>Suivant</span>
        <i className="bi bi-chevron-right" style={{ fontSize: '0.7rem' }} />
      </button>

      {/* Page info */}
      <span
        style={{
          position: 'absolute',
          right: 0,
          fontSize: 'var(--font-size-xs, 0.75rem)',
          color: 'var(--text-muted, #9ca3af)',
        }}
        aria-live="polite"
      >
        Page {currentPage} sur {totalPages}
      </span>
    </nav>
  );
});

Pagination.displayName = 'Pagination';

export default Pagination;
