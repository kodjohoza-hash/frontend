import React from 'react';

const AdminSupportSkeleton = ({ rows = 4, type = 'table' }) => {
  if (type === 'table') {
    return (
      <div className="ads-table-wrapper">
        <table className="ads-table">
          <thead><tr><th colSpan={8}>&nbsp;</th></tr></thead>
          <tbody>
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 8 }).map((_, j) => (
                  <td key={j}><div className="ads-skeleton-pulse" style={{ height: 14, width: j === 1 ? '80%' : j === 6 ? 70 : 60 }} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="ads-skeleton" style={{ height: 100, position: 'relative', overflow: 'hidden' }}>
          <div className="ads-skeleton-pulse" style={{ position: 'absolute', inset: 0 }} />
        </div>
      ))}
    </div>
  );
};
export default AdminSupportSkeleton;
