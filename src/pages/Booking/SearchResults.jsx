import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { SearchHero, FilterSidebar, TripResults, Pagination, SearchSkeleton } from '@components/search';
import tripService from '@services/trip.service';
import '@assets/styles/search.css';

const TRIPS_PER_PAGE = 5;

/* ── Mapper voyage API → carte de résultat + objet « trip » du parcours ──
   Complète les champs non fournis par l'API (note, avis, services, photos)
   avec des valeurs de repli explicites — jamais inventées au prix. */

const TYPE_LABEL = {
  vip: 'VIP',
  premium: 'VIP',
  confort: 'Business',
  standard: 'Business',
  double_deck: 'Business',
  economique: 'Economique',
  minibus: 'Economique',
};

const SERVICES_BY_TYPE = {
  VIP: ['wifi', 'climatisation', 'prise_electrique', 'eau_minerale', 'siege_pliable', 'toilettes', 'divertissement'],
  Business: ['climatisation', 'prise_electrique', 'eau_minerale', 'siege_pliable', 'emplacement_bagages'],
  Economique: ['climatisation', 'eau_minerale', 'emplacement_bagages'],
};

const formatDuration = (dep, arr) => {
  if (!dep || !arr) return '—';
  const toMin = (t) => {
    const [h, m] = String(t).split(':');
    return (Number(h) || 0) * 60 + (Number(m) || 0);
  };
  let diff = toMin(arr) - toMin(dep);
  if (diff < 0) diff += 24 * 60;
  return `${Math.floor(diff / 60)}h ${String(diff % 60).padStart(2, '0')}min`;
};

const mapTripToCard = (t) => {
  const busType = TYPE_LABEL[t?.bus?.type] || 'Business';
  const companyName = t.company?.name || 'Compagnie';
  const initials = companyName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || 'CO';
  return {
    id: t.id,
    companyId: t.companyId || `comp_${t.company?.id || '000'}`,
    companyName,
    companyInitial: initials,
    companyRating: 4.5,
    companyReviewCount: 0,
    companyColor: t.company?.color || '#0B1D51',
    busType,
    busPhoto: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=250&fit=crop&q=80',
    departureCity: t.from || '',
    arrivalCity: t.to || '',
    departureTime: t.departure || '--:--',
    arrivalTime: t.arrival || '--:--',
    duration: formatDuration(t.departure, t.arrival),
    distance: '—',
    availableSeats: t.availableSeats ?? 0,
    totalSeats: t.totalSeats ?? 0,
    price: Number(t.price) || 0,
    originalPrice: null,
    currency: t.currency || 'XAF',
    badges: [],
    services: SERVICES_BY_TYPE[busType],
    baggagePolicy: '1 bagage cabine (10 kg) + 1 bagage en soute (20 kg) inclus',
    cancellationPolicy: 'Annulation gratuite jusqu\'à 24h avant le départ',
    departurePoint: t.quai || 'À préciser',
    arrivalPoint: 'À préciser',
    /* Champs complémentaires pour le parcours de réservation. */
    departureDate: t.date || '',
    tripNumber: t.code || '',
    busNumber: t.bus?.internalNumber || t.bus?.plate || '',
    pricePerSeat: Number(t.price) || 0,
  };
};

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const date = searchParams.get('date') || '';
  const passengers = parseInt(searchParams.get('passengers'), 10) || 1;
  const travelClass = searchParams.get('class') || '';

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trips, setTrips] = useState([]);
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
  const [retryKey, setRetryKey] = useState(0);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const searchSummary = useMemo(
    () => ({ from, to, date, passengers, busType: travelClass || null }),
    [from, to, date, passengers, travelClass]
  );

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await tripService.searchPublic({ from, to, date, limit: 100 });
        if (active) setTrips((res.items || []).map(mapTripToCard));
      } catch (err) {
        if (active) {
          setError(err.message || 'Impossible de charger les voyages.');
          setTrips([]);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [from, to, date, retryKey]);

  const companies = useMemo(() => {
    const map = new Map();
    trips.forEach((t) => {
      if (!map.has(t.companyId)) {
        map.set(t.companyId, { id: t.companyId, name: t.companyName, rating: t.companyRating });
      }
    });
    return [...map.values()];
  }, [trips]);

  const filteredTrips = useMemo(() => {
    let result = [...trips];

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
  }, [trips, filters, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredTrips.length / TRIPS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedTrips = useMemo(() => {
    const start = (safePage - 1) * TRIPS_PER_PAGE;
    return filteredTrips.slice(start, start + TRIPS_PER_PAGE);
  }, [filteredTrips, safePage]);

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
    navigate(`/booking/seats?trip=${trip.id}`, { state: { trip } });
  }, [navigate]);

  const handleViewDetails = useCallback((trip) => {
    navigate(`/booking/trips/${trip.id}`);
  }, [navigate]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 320, behavior: 'smooth' });
  }, []);

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
        <SearchHero
          searchParams={searchSummary}
          resultCount={filteredTrips.length}
          onModifySearch={handleModifySearch}
        />

        {error && (
          <div
            role="alert"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              padding: '14px 18px',
              borderRadius: 12,
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#DC2626',
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              <i className="bi bi-exclamation-triangle-fill" style={{ marginRight: 8 }} />
              {error}
            </span>
            <button
              type="button"
              onClick={() => { setIsLoading(true); setError(null); setRetryKey((k) => k + 1); }}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                background: '#DC2626',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Réessayer
            </button>
          </div>
        )}

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

        <div className="btc-search-layout">
          {mobileFiltersOpen && (
            <div className="btc-filter-overlay" onClick={() => setMobileFiltersOpen(false)} />
          )}

          <aside
            id="btc-filter-sidebar"
            className={`btc-search-sidebar ${mobileFiltersOpen ? 'btc-sidebar-mobile-open' : ''}`}
          >
            <div className="btc-filter-sticky">
              <FilterSidebar
                filters={filters}
                onFilterChange={setFilters}
                onReset={handleResetFilters}
                companies={companies}
              />
            </div>
          </aside>

          <div className="btc-search-results-col">
            <TripResults
              trips={paginatedTrips}
              onBook={handleBook}
              sortBy={sortBy}
              onSortChange={setSortBy}
              onViewDetails={handleViewDetails}
              onModifySearch={handleModifySearch}
            />

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
