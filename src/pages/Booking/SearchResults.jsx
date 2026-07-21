import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchHero, FilterSidebar, TripResults, Pagination, SearchSkeleton } from '@components/search';
import { mockTrips, defaultSearchParams } from '@data/searchResults';
import '@assets/styles/search.css';

const TRIPS_PER_PAGE = 5;
const LoadingDelay = 1800;

const SearchResults = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useState(defaultSearchParams);
  const [filters, setFilters] = useState({
    companies: [],
    priceMin: 0,
    priceMax: 10000,
    departureTimes: [],
    duration: null,
    classes: [],
    minSeats: 0,
    services: [],
    minRating: 0,
  });
  const [sortBy, setSortBy] = useState('recommended');
  const [currentPage, setCurrentPage] = useState(1);
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
    if (filters.priceMax < 10000) {
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
    if (filters.minRating > 0) {
      result = result.filter((t) => t.companyRating >= filters.minRating);
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

  const totalPages = Math.ceil(filteredTrips.length / TRIPS_PER_PAGE);
  const paginatedTrips = useMemo(() => {
    const start = (currentPage - 1) * TRIPS_PER_PAGE;
    return filteredTrips.slice(start, start + TRIPS_PER_PAGE);
  }, [filteredTrips, currentPage]);

  const handleResetFilters = useCallback(() => {
    setFilters({
      companies: [],
      priceMin: 0,
      priceMax: 10000,
      departureTimes: [],
      duration: null,
      classes: [],
      minSeats: 0,
      services: [],
      minRating: 0,
    });
    setCurrentPage(1);
  }, []);

  const handleModifySearch = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleBook = useCallback((trip) => {
    navigate(`/booking/seats?trip=${trip.id}`);
  }, [navigate]);

  const handleViewDetails = useCallback((trip) => {
    navigate(`/booking/trips/${trip.id}`);
  }, [navigate]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 320, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy]);

  if (isLoading) {
    return (
      <div className="btc-search-results-page">
        <div className="btc-search-container">
          <SearchSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="btc-search-results-page">
      <div className="btc-search-container">
        {/* Hero Search Summary */}
        <SearchHero
          searchParams={searchParams}
          resultCount={filteredTrips.length}
          onModifySearch={handleModifySearch}
        />

        {/* Mobile filter toggle */}
        <button
          className="btc-mobile-filter-toggle"
          onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
          aria-expanded={mobileFiltersOpen}
          aria-controls="btc-filter-sidebar"
        >
          <i className="bi bi-sliders" />
          Filtres
          {(() => {
            const count = (filters.companies?.length || 0) + (filters.departureTimes?.length || 0) + (filters.classes?.length || 0) + (filters.services?.length || 0);
            return count > 0 ? (
              <span className="btc-mobile-filter-count">{count}</span>
            ) : null;
          })()}
        </button>

        {/* Main Layout: 25% Filters | 75% Results */}
        <div className="btc-search-layout">
          {/* Mobile filter overlay */}
          {mobileFiltersOpen && (
            <div className="btc-filter-overlay" onClick={() => setMobileFiltersOpen(false)} />
          )}

          {/* Filter Sidebar */}
          <aside
            id="btc-filter-sidebar"
            className={`btc-search-sidebar ${mobileFiltersOpen ? 'btc-sidebar-mobile-open' : ''}`}
          >
            <div className="btc-filter-sticky">
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                onReset={handleResetFilters}
              />
            </div>
          </aside>

          {/* Results */}
          <div className="btc-search-results-col">
            <TripResults
              trips={paginatedTrips}
              onBook={handleBook}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onViewDetails={handleViewDetails}
              onModifySearch={handleModifySearch}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
