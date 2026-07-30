import React from 'react';

export default function AdminSubscriptionFilters({
  search, onSearchChange, statusFilter, onStatusChange,
  durationFilter, onDurationChange, currencyFilter, onCurrencyChange,
  minPrice, onMinPriceChange, maxPrice, onMaxPriceChange,
  sortBy, onSortChange, showFilters, onToggleFilters, onReset,
}) {
  return (
    <div className="adms-filters-bar">
      <div className="adms-filters-top">
        <div className="adms-search-wrapper">
          <i className="fa-solid fa-search" />
          <input type="text" placeholder="Search plans by name or description..."
            value={search} onChange={e => onSearchChange(e.target.value)} />
        </div>
        <button className="adms-filters-toggler" onClick={onToggleFilters}>
          <i className="fa-solid fa-sliders" /> Filters
        </button>
      </div>
      {showFilters && (
        <div className="adms-filters-panel">
          <div className="adms-filter-group">
            <label>Status</label>
            <select value={statusFilter} onChange={e => onStatusChange(e.target.value)}>
              <option value="">All</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <div className="adms-filter-group">
            <label>Duration</label>
            <select value={durationFilter} onChange={e => onDurationChange(e.target.value)}>
              <option value="">All</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="biannual">Biannual</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="adms-filter-group">
            <label>Currency</label>
            <select value={currencyFilter} onChange={e => onCurrencyChange(e.target.value)}>
              <option value="">All</option>
              <option value="XOF">XOF (FCFA)</option>
              <option value="EUR">EUR (€)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>
          <div className="adms-filter-group">
            <label>Min Price</label>
            <input type="number" placeholder="0" value={minPrice} onChange={e => onMinPriceChange(e.target.value)} />
          </div>
          <div className="adms-filter-group">
            <label>Max Price</label>
            <input type="number" placeholder="999999" value={maxPrice} onChange={e => onMaxPriceChange(e.target.value)} />
          </div>
          <div className="adms-filter-group">
            <label>Sort</label>
            <select value={sortBy} onChange={e => onSortChange(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_asc">Price (Low→High)</option>
              <option value="price_desc">Price (High→Low)</option>
              <option value="name">Name A→Z</option>
              <option value="companies">Most Companies</option>
            </select>
          </div>
          <button className="adms-btn--reset" onClick={onReset}>
            <i className="fa-solid fa-rotate-left" /> Reset
          </button>
        </div>
      )}
    </div>
  );
}
