import React from 'react';
import { commissionTypes } from '../../../data/adminCommissionData';

export default function AdminCommissionFilters({
  search, onSearchChange, companyFilter, onCompanyChange,
  cityFilter, onCityChange, statusFilter, onStatusChange,
  typeFilter, onTypeChange, dateFrom, onDateFromChange,
  dateTo, onDateToChange, sortBy, onSortChange,
  showFilters, onToggleFilters, onReset,
}) {
  return (
    <div className="adcm-filters-bar">
      <div className="adcm-filters-top">
        <div className="adcm-search-wrapper">
          <i className="fa-solid fa-search" />
          <input type="text" placeholder="Search by ref, company, trip, or client..."
            value={search} onChange={e => onSearchChange(e.target.value)} />
        </div>
        <button className="adcm-filters-toggler" onClick={onToggleFilters}>
          <i className="fa-solid fa-sliders" /> Filters
        </button>
      </div>
      {showFilters && (
        <div className="adcm-filters-panel">
          <div className="adcm-filter-group">
            <label>Status</label>
            <select value={statusFilter} onChange={e => onStatusChange(e.target.value)}>
              <option value="">All</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
              <option value="pending_review">Review</option>
              <option value="cancelled">Cancelled</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          <div className="adcm-filter-group">
            <label>Type</label>
            <select value={typeFilter} onChange={e => onTypeChange(e.target.value)}>
              <option value="">All</option>
              {commissionTypes.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
          <div className="adcm-filter-group">
            <label>City</label>
            <input type="text" placeholder="e.g. Douala" value={cityFilter} onChange={e => onCityChange(e.target.value)} />
          </div>
          <div className="adcm-filter-group">
            <label>From</label>
            <input type="date" value={dateFrom} onChange={e => onDateFromChange(e.target.value)} />
          </div>
          <div className="adcm-filter-group">
            <label>To</label>
            <input type="date" value={dateTo} onChange={e => onDateToChange(e.target.value)} />
          </div>
          <div className="adcm-filter-group">
            <label>Sort</label>
            <select value={sortBy} onChange={e => onSortChange(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount_desc">Amount (High→Low)</option>
              <option value="amount_asc">Amount (Low→High)</option>
              <option value="company">Company A→Z</option>
            </select>
          </div>
          <button className="adcm-btn--reset" onClick={onReset}>
            <i className="fa-solid fa-rotate-left" /> Reset
          </button>
        </div>
      )}
    </div>
  );
}
