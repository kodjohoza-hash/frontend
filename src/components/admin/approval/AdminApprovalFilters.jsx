import React from 'react';

export default function AdminApprovalFilters({
  search, onSearchChange,
  statusFilter, onStatusChange,
  urgencyFilter, onUrgencyChange,
  sortBy, onSortChange,
  showFilters, onToggleFilters,
  onReset,
}) {
  return (
    <div className="adma-filters-bar">
      <div className="adma-filters-top">
        <div className="adma-search-wrapper">
          <i className="fa-solid fa-search" />
          <input type="text" placeholder="Search company, owner, or ID..."
            value={search} onChange={e => onSearchChange(e.target.value)} />
        </div>
        <button className="adma-filters-toggler" onClick={onToggleFilters}>
          <i className="fa-solid fa-filter" /> Filters
        </button>
      </div>
      {showFilters && (
        <div className="adma-filters-panel">
          <div className="adma-filter-group">
            <label>Status</label>
            <select value={statusFilter} onChange={e => onStatusChange(e.target.value)}>
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="more_info">More Info</option>
              <option value="approved">Approved</option>
              <option value="refused">Refused</option>
              <option value="suspended">Suspended</option>
              <option value="flagged">Flagged</option>
            </select>
          </div>
          <div className="adma-filter-group">
            <label>Urgency</label>
            <select value={urgencyFilter} onChange={e => onUrgencyChange(e.target.value)}>
              <option value="">All</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="normal">Normal</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="adma-filter-group">
            <label>Sort</label>
            <select value={sortBy} onChange={e => onSortChange(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="urgent">Urgency (High→Low)</option>
              <option value="company">Company A→Z</option>
            </select>
          </div>
          <button className="adma-btn--reset" onClick={onReset}>
            <i className="fa-solid fa-rotate-left" /> Reset
          </button>
        </div>
      )}
    </div>
  );
}
