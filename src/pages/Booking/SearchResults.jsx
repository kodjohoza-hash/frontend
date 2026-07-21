import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchSummary, FilterSidebar, TripResults, SearchSkeleton } from '@components/search';
import { mockTrips, defaultSearchParams } from '@data/searchResults';
import '@assets/styles/search.css';

const LoadingDelay = 1500;

const SearchResults = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useState(defaultSearchParams);
  const [filters, setFilters] = useState({
    companies: [],
    priceMin: 0,
    priceMax: 15000,
    departureTimes: [],
    duration: null,
    classes: [],
    minSeats: 0,
    services: [],
  });
  const [sortBy, setSortBy] = useState('recommended');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), LoadingDelay);
    return () => clearTimeout(timer);
  }, []);

  const filteredTrips = useMemo(() => {
    let result = [...mockTrips];

    if (filters.companies.length > 0) {
      result = result.filter((t) => filters.companies.includes(t.companyId));
    }
    if (filters.priceMin > 0) {
      result = result.filter((t) => t.price >= filters.priceMin);
    }
    if (filters.priceMax < 15000) {
      result = result.filter((t) => t.price <= filters.priceMax);
    }
    if (filters.departureTimes.length > 0) {
      result = result.filter((t) => {
        const hour = parseInt(t.departureTime.split(':')[0], 10);
        return filters.departureTimes.some((slot) => {
          if (slot === 'morning') return hour >= 6 && hour < 12;
          if (slot === 'afternoon') return hour >= 12 && hour < 18;
          if (slot === 'evening') return hour >= 18 && hour < 22;
          if (slot === 'night') return hour >= 22 || hour < 6;
          return false;
        });
      });
    }
    if (filters.classes.length > 0) {
      const classMap = { economy: 'Economique', business: 'Business', vip: 'VIP' };
      result = result.filter((t) => filters.classes.includes(
        Object.entries(classMap).find(([, v]) => v === t.busType)?.[0]
      ));
    }
    if (filters.minSeats > 0) {
      result = result.filter((t) => t.availableSeats >= filters.minSeats);
    }
    if (filters.services.length > 0) {
      result = result.filter((t) => filters.services.every((s) => t.services.includes(s)));
    }

    switch (sortBy) {
      case 'price_asc': result.sort((a, b) => a.price - b.price); break;
      case 'price_desc': result.sort((a, b) => b.price - a.price); break;
      case 'duration': result.sort((a, b) => a.duration.localeCompare(b.duration)); break;
      case 'departure': result.sort((a, b) => a.departureTime.localeCompare(b.departureTime)); break;
      case 'rating': result.sort((a, b) => b.companyRating - a.companyRating); break;
      default: break;
    }

    return result;
  }, [filters, sortBy]);

  const handleResetFilters = useCallback(() => {
    setFilters({
      companies: [],
      priceMin: 0,
      priceMax: 15000,
      departureTimes: [],
      duration: null,
      classes: [],
      minSeats: 0,
      services: [],
    });
  }, []);

  const handleModifySearch = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleBook = useCallback((trip) => {
    navigate(`/booking/seats?trip=${trip.id}`);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="container py-4">
        <SearchSkeleton count={4} />
      </div>
    );
  }

  return (
    <div className="btc-search-results-page">
      <div className="container py-4">
        <SearchSummary
          searchParams={searchParams}
          resultCount={filteredTrips.length}
          onModifySearch={handleModifySearch}
        />

        {/* Mobile filter toggle */}
        <button
          className="btn btn-sm d-flex d-lg-none align-items-center gap-2 mb-3 w-100 justify-content-center"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          style={{
            color: 'var(--color-primary)',
            background: 'var(--color-primary-50)',
            borderRadius: 'var(--radius-lg)',
            fontSize: 'var(--font-size-sm)',
            padding: '10px 16px',
            border: '1px solid var(--color-primary-200)',
            fontWeight: 'var(--font-weight-medium)',
          }}
          aria-expanded={mobileFiltersOpen}
          aria-controls="filter-sidebar"
        >
          <i className="bi bi-funnel" />
          Filtres
          {(() => {
            const count = (filters.companies?.length || 0) + (filters.departureTimes?.length || 0) + (filters.classes?.length || 0) + (filters.services?.length || 0);
            return count > 0 ? (
              <span
                className="d-inline-flex align-items-center justify-content-center rounded-pill"
                style={{ width: 18, height: 18, fontSize: '0.65rem', background: 'var(--color-accent)', color: 'var(--color-white)' }}
              >
                {count}
              </span>
            ) : null;
          })()}
        </button>

        <div className="row g-4">
          {/* Mobile filter overlay */}
          {mobileFiltersOpen && (
            <div className="btc-filter-overlay d-lg-none" onClick={() => setMobileFiltersOpen(false)} />
          )}

          {/* Filter Sidebar */}
          <div
            id="filter-sidebar"
            className={`col-12 col-lg-3 ${mobileFiltersOpen ? 'btc-filter-mobile-open' : ''}`}
          >
            <div className={`btc-filter-sticky ${mobileFiltersOpen ? 'btc-filter-mobile-visible' : ''}`}>
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                onReset={handleResetFilters}
              />
            </div>
          </div>

          {/* Results */}
          <div className="col-12 col-lg-9">
            <TripResults
              trips={filteredTrips}
              onBook={handleBook}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
