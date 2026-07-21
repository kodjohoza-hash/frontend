import { useState, useCallback } from 'react';
import { CITIES } from '@data/landingPage';
import { COMPANIES, SERVICES } from '@data/searchResults';

const FilterSidebar = ({ filters, onFilterChange, onReset }) => {
  const [expandedSections, setExpandedSections] = useState({
    company: true,
    price: true,
    time: true,
    duration: true,
    class: true,
    seats: true,
    services: true,
  });

  const toggleSection = useCallback((section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  }, []);

  const timeSlots = [
    { id: 'morning', label: 'Matin', sub: '06:00 — 12:00', icon: 'bi-sunrise-fill', iconColor: 'var(--color-warning)' },
    { id: 'afternoon', label: 'Après-midi', sub: '12:00 — 18:00', icon: 'bi-sun-fill', iconColor: 'var(--color-accent)' },
    { id: 'evening', label: 'Soir', sub: '18:00 — 22:00', icon: 'bi-moon-stars-fill', iconColor: 'var(--color-primary)' },
    { id: 'night', label: 'Nuit', sub: '22:00 — 06:00', icon: 'bi-stars', iconColor: 'var(--color-info)' },
  ];

  const durationOptions = [
    { id: 'direct', label: 'Direct', desc: 'Sans escale' },
    { id: 'with_stops', label: 'Avec escales', desc: '1+ arrêts' },
  ];

  const classOptions = [
    { id: 'economy', label: 'Économique', icon: 'bi-bus-front' },
    { id: 'business', label: 'Business', icon: 'bi-bus-front-fill' },
    { id: 'vip', label: 'VIP', icon: 'bi-star-fill' },
  ];

  const handleCompanyToggle = (companyId) => {
    const current = filters.companies || [];
    const updated = current.includes(companyId)
      ? current.filter((id) => id !== companyId)
      : [...current, companyId];
    onFilterChange({ ...filters, companies: updated });
  };

  const handleTimeToggle = (timeId) => {
    const current = filters.departureTimes || [];
    const updated = current.includes(timeId)
      ? current.filter((id) => id !== timeId)
      : [...current, timeId];
    onFilterChange({ ...filters, departureTimes: updated });
  };

  const handleClassToggle = (classId) => {
    const current = filters.classes || [];
    const updated = current.includes(classId)
      ? current.filter((id) => id !== classId)
      : [...current, classId];
    onFilterChange({ ...filters, classes: updated });
  };

  const handleServiceToggle = (serviceId) => {
    const current = filters.services || [];
    const updated = current.includes(serviceId)
      ? current.filter((id) => id !== serviceId)
      : [...current, serviceId];
    onFilterChange({ ...filters, services: updated });
  };

  const activeFilterCount =
    (filters.companies?.length || 0) +
    (filters.departureTimes?.length || 0) +
    (filters.classes?.length || 0) +
    (filters.services?.length || 0) +
    (filters.priceMin ? 1 : 0) +
    (filters.priceMax ? 1 : 0) +
    (filters.duration ? 1 : 0) +
    (filters.minSeats ? 1 : 0);

  return (
    <div className="btc-filter-sidebar" role="search" aria-label="Filtres de recherche">
      <div className="card border-0" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
        <div className="card-body p-4">
          {/* Header */}
          <div className="d-flex align-items-center justify-content-between mb-4">
            <div className="d-flex align-items-center gap-2">
              <i className="bi bi-funnel-fill" style={{ color: 'var(--color-primary)' }} />
              <h6 className="fw-bold mb-0" style={{ fontSize: 'var(--font-size-base)', color: 'var(--text-primary)' }}>Filtres</h6>
              {activeFilterCount > 0 && (
                <span
                  className="d-inline-flex align-items-center justify-content-center rounded-pill"
                  style={{
                    width: 20,
                    height: 20,
                    fontSize: 'var(--font-size-2xs)',
                    fontWeight: 'var(--font-weight-bold)',
                    background: 'var(--color-accent)',
                    color: 'var(--color-white)',
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={onReset}
                className="btn btn-link p-0"
                style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger)', fontWeight: 'var(--font-weight-medium)', textDecoration: 'none' }}
              >
                Tout effacer
              </button>
            )}
          </div>

          {/* Compagnie */}
          <FilterSection title="Compagnie" icon="bi-building" expanded={expandedSections.company} onToggle={() => toggleSection('company')}>
            <div className="d-flex flex-column gap-2">
              {COMPANIES.map((company) => (
                <label key={company.id} className="btc-filter-checkbox d-flex align-items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="btc-checkbox"
                    checked={(filters.companies || []).includes(company.id)}
                    onChange={() => handleCompanyToggle(company.id)}
                    aria-label={company.name}
                  />
                  <span className="btc-checkbox-mark" />
                  <span className="flex-grow-1" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{company.name}</span>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>({company.reviewCount})</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <div className="btc-filter-divider" />

          {/* Prix */}
          <FilterSection title="Prix" icon="bi-cash-stack" expanded={expandedSections.price} onToggle={() => toggleSection('price')}>
            <div className="d-flex flex-column gap-3">
              <div>
                <label className="d-flex justify-content-between mb-1" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                  <span>Min</span>
                  <span className="fw-semibold" style={{ color: 'var(--text-primary)' }}>{(filters.priceMin || 0).toLocaleString()} FCFA</span>
                </label>
                <input
                  type="range"
                  className="btc-range-slider"
                  min={0}
                  max={15000}
                  step={500}
                  value={filters.priceMin || 0}
                  onChange={(e) => onFilterChange({ ...filters, priceMin: Number(e.target.value) })}
                  aria-label="Prix minimum"
                />
              </div>
              <div>
                <label className="d-flex justify-content-between mb-1" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                  <span>Max</span>
                  <span className="fw-semibold" style={{ color: 'var(--text-primary)' }}>{(filters.priceMax || 15000).toLocaleString()} FCFA</span>
                </label>
                <input
                  type="range"
                  className="btc-range-slider"
                  min={0}
                  max={15000}
                  step={500}
                  value={filters.priceMax || 15000}
                  onChange={(e) => onFilterChange({ ...filters, priceMax: Number(e.target.value) })}
                  aria-label="Prix maximum"
                />
              </div>
            </div>
          </FilterSection>

          <div className="btc-filter-divider" />

          {/* Heure de départ */}
          <FilterSection title="Heure de départ" icon="bi-clock" expanded={expandedSections.time} onToggle={() => toggleSection('time')}>
            <div className="d-flex flex-column gap-2">
              {timeSlots.map((slot) => (
                <label key={slot.id} className="btc-filter-checkbox d-flex align-items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="btc-checkbox"
                    checked={(filters.departureTimes || []).includes(slot.id)}
                    onChange={() => handleTimeToggle(slot.id)}
                    aria-label={slot.label}
                  />
                  <span className="btc-checkbox-mark" />
                  <i className={slot.icon} style={{ color: slot.iconColor, fontSize: '0.9rem', width: 18, textAlign: 'center' }} />
                  <div className="flex-grow-1">
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{slot.label}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{slot.sub}</div>
                  </div>
                </label>
              ))}
            </div>
          </FilterSection>

          <div className="btc-filter-divider" />

          {/* Durée */}
          <FilterSection title="Durée" icon="bi-hourglass-split" expanded={expandedSections.duration} onToggle={() => toggleSection('duration')}>
            <div className="d-flex flex-column gap-2">
              {durationOptions.map((opt) => (
                <label key={opt.id} className="btc-filter-checkbox d-flex align-items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="duration"
                    className="btc-radio"
                    checked={filters.duration === opt.id}
                    onChange={() => onFilterChange({ ...filters, duration: filters.duration === opt.id ? null : opt.id })}
                    aria-label={opt.label}
                  />
                  <span className="btc-radio-mark" />
                  <div className="flex-grow-1">
                    <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{opt.label}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </FilterSection>

          <div className="btc-filter-divider" />

          {/* Classe */}
          <FilterSection title="Classe" icon="bi-gem" expanded={expandedSections.class} onToggle={() => toggleSection('class')}>
            <div className="d-flex flex-column gap-2">
              {classOptions.map((cls) => (
                <label key={cls.id} className="btc-filter-checkbox d-flex align-items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="btc-checkbox"
                    checked={(filters.classes || []).includes(cls.id)}
                    onChange={() => handleClassToggle(cls.id)}
                    aria-label={cls.label}
                  />
                  <span className="btc-checkbox-mark" />
                  <i className={cls.icon} style={{ color: 'var(--color-primary)', fontSize: '0.85rem', width: 18, textAlign: 'center' }} />
                  <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{cls.label}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <div className="btc-filter-divider" />

          {/* Sièges restants */}
          <FilterSection title="Sièges restants" icon="bi-person-check" expanded={expandedSections.seats} onToggle={() => toggleSection('seats')}>
            <div>
              <label className="d-flex justify-content-between mb-1" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>
                <span>Minimum</span>
                <span className="fw-semibold" style={{ color: 'var(--text-primary)' }}>{filters.minSeats || 0} place{(filters.minSeats || 0) !== 1 ? 's' : ''}</span>
              </label>
              <input
                type="range"
                className="btc-range-slider"
                min={0}
                max={30}
                step={1}
                value={filters.minSeats || 0}
                onChange={(e) => onFilterChange({ ...filters, minSeats: Number(e.target.value) })}
                aria-label="Nombre minimum de sièges"
              />
            </div>
          </FilterSection>

          <div className="btc-filter-divider" />

          {/* Services */}
          <FilterSection title="Services" icon="bi-list-check" expanded={expandedSections.services} onToggle={() => toggleSection('services')}>
            <div className="d-flex flex-column gap-2">
              {SERVICES.map((service) => (
                <label key={service.id} className="btc-filter-checkbox d-flex align-items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="btc-checkbox"
                    checked={(filters.services || []).includes(service.id)}
                    onChange={() => handleServiceToggle(service.id)}
                    aria-label={service.label}
                  />
                  <span className="btc-checkbox-mark" />
                  <i className={service.icon} style={{ color: 'var(--color-primary)', fontSize: '0.85rem', width: 18, textAlign: 'center' }} />
                  <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>{service.label}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        </div>
      </div>
    </div>
  );
};

const FilterSection = ({ title, icon, expanded, onToggle, children }) => (
  <div className="btc-filter-section">
    <button
      onClick={onToggle}
      className="d-flex align-items-center justify-content-between w-100 p-0 mb-2 bg-transparent border-0"
      aria-expanded={expanded}
    >
      <span className="d-flex align-items-center gap-2 fw-semibold" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
        <i className={icon} style={{ color: 'var(--color-primary)', fontSize: '0.85rem' }} />
        {title}
      </span>
      <i className={`bi bi-chevron-${expanded ? 'up' : 'down'}`} style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }} />
    </button>
    {expanded && <div className="mt-2">{children}</div>}
  </div>
);

export default FilterSidebar;
