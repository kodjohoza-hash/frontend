import React, { useState, useCallback } from 'react';
import { COMPANIES, SERVICES } from '@data/searchResults';

const timeSlots = [
  { id: 'morning', label: 'Matin', sub: '06h — 12h', icon: 'bi-sunrise-fill', iconColor: '#F59E0B' },
  { id: 'afternoon', label: 'Après-midi', sub: '12h — 18h', icon: 'bi-sun-fill', iconColor: '#FF6B35' },
  { id: 'evening', label: 'Soir', sub: '18h — 22h', icon: 'bi-moon-stars-fill', iconColor: '#0B1D51' },
  { id: 'night', label: 'Nuit', sub: '22h — 06h', icon: 'bi-stars', iconColor: '#6366F1' },
];

const durationOptions = [
  { id: 'direct', label: 'Direct', desc: 'Sans escale', icon: 'bi-arrow-right-circle' },
  { id: 'with_stops', label: 'Avec escales', desc: '1+ arrêts', icon: 'bi-signpost-split' },
];

const classOptions = [
  { id: 'vip', label: 'VIP', icon: 'bi-star-fill' },
  { id: 'business', label: 'Business', icon: 'bi-briefcase-fill' },
  { id: 'economy', label: 'Économique', icon: 'bi-bus-front' },
];

const FilterSection = React.memo(({ title, icon, expanded, onToggle, children, badge }) => (
  <div style={{ borderBottom: '1px solid var(--color-gray-100, #f3f4f6)' }}>
    <button
      onClick={onToggle}
      aria-expanded={expanded}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '16px 0',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        outline: 'none',
      }}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 'var(--font-size-sm, 0.875rem)',
          fontWeight: 600,
          color: 'var(--text-primary, #111827)',
        }}
      >
        <i className={icon} style={{ color: 'var(--color-primary, #0B1D51)', fontSize: '0.85rem' }} />
        {title}
        {badge != null && badge > 0 && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 20,
              height: 20,
              borderRadius: 10,
              background: 'var(--color-accent, #FF6B35)',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 700,
            }}
          >
            {badge}
          </span>
        )}
      </span>
      <i
        className="bi bi-chevron-down"
        style={{
          fontSize: '0.7rem',
          color: 'var(--text-muted, #9ca3af)',
          transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}
      />
    </button>
    <div
      style={{
        maxHeight: expanded ? 600 : 0,
        opacity: expanded ? 1 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease',
      }}
    >
      <div style={{ paddingBottom: 16 }}>{children}</div>
    </div>
  </div>
));
FilterSection.displayName = 'FilterSection';

const CustomCheckbox = React.memo(({ checked, onChange, label, ariaLabel }) => (
  <button
    role="checkbox"
    aria-checked={checked}
    aria-label={ariaLabel || label}
    onClick={onChange}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      width: '100%',
      padding: '8px 0',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      textAlign: 'left',
      outline: 'none',
    }}
  >
    <span
      style={{
        width: 20,
        height: 20,
        borderRadius: 6,
        border: `2px solid ${checked ? 'var(--color-primary, #0B1D51)' : 'var(--color-gray-300, #d1d5db)'}`,
        background: checked ? 'var(--color-primary, #0B1D51)' : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        flexShrink: 0,
      }}
    >
      {checked && (
        <i className="bi bi-check-lg" style={{ color: '#fff', fontSize: '0.75rem', fontWeight: 700 }} />
      )}
    </span>
    <span style={{ fontSize: 'var(--font-size-sm, 0.875rem)', color: 'var(--text-secondary, #4b5563)', flex: 1 }}>
      {label}
    </span>
  </button>
));
CustomCheckbox.displayName = 'CustomCheckbox';

const CustomToggle = React.memo(({ checked, onChange, label, sublabel }) => (
  <button
    role="switch"
    aria-checked={checked}
    aria-label={label}
    onClick={onChange}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      padding: '10px 0',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      textAlign: 'left',
      outline: 'none',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1 }}>
      <span style={{ fontSize: 'var(--font-size-sm, 0.875rem)', color: 'var(--text-secondary, #4b5563)' }}>
        {label}
      </span>
      {sublabel && (
        <span style={{ fontSize: 'var(--font-size-xs, 0.75rem)', color: 'var(--text-muted, #9ca3af)' }}>
          {sublabel}
        </span>
      )}
    </div>
    <span
      style={{
        width: 42,
        height: 24,
        borderRadius: 12,
        background: checked ? 'var(--color-primary, #0B1D51)' : 'var(--color-gray-200, #e5e7eb)',
        position: 'relative',
        transition: 'background 0.25s ease',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: 3,
          left: checked ? 21 : 3,
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
          transition: 'left 0.25s cubic-bezier(0.4,0,0.2,1)',
        }}
      />
    </span>
  </button>
));
CustomToggle.displayName = 'CustomToggle';

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

  const activeFilterCount =
    (filters.companies?.length || 0) +
    (filters.departureTimes?.length || 0) +
    (filters.classes?.length || 0) +
    (filters.services?.length || 0) +
    (filters.priceMin ? 1 : 0) +
    (filters.priceMax && filters.priceMax < 15000 ? 1 : 0) +
    (filters.duration ? 1 : 0) +
    (filters.minSeats ? 1 : 0);

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

  const rangeSliderTrackStyle = (min, max, valueMin, valueMax, minVal = 0, maxVal = 15000) => {
    const left = ((valueMin - minVal) / (maxVal - minVal)) * 100;
    const right = 100 - ((valueMax - minVal) / (maxVal - minVal)) * 100;
    return `linear-gradient(to right, var(--color-gray-200, #e5e7eb) 0%, var(--color-gray-200, #e5e7eb) ${left}%, var(--color-primary, #0B1D51) ${left}%, var(--color-primary, #0B1D51) ${100 - right}%, var(--color-gray-200, #e5e7eb) ${100 - right}%, var(--color-gray-200, #e5e7eb) 100%)`;
  };

  return (
    <aside
      role="search"
      aria-label="Filtres de recherche"
      style={{
        background: 'var(--color-white, #fff)',
        borderRadius: 'var(--radius-xl, 16px)',
        boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.06))',
        border: '1px solid var(--color-gray-100, #f3f4f6)',
        padding: '24px',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <i className="bi bi-funnel-fill" style={{ color: 'var(--color-primary, #0B1D51)', fontSize: '1rem' }} />
          <h6
            style={{
              margin: 0,
              fontSize: 'var(--font-size-base, 1rem)',
              fontWeight: 700,
              color: 'var(--text-primary, #111827)',
            }}
          >
            Filtres
          </h6>
          {activeFilterCount > 0 && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 22,
                height: 22,
                borderRadius: 11,
                background: 'var(--color-accent, #FF6B35)',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 700,
              }}
            >
              {activeFilterCount}
            </span>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={onReset}
            aria-label="Effacer tous les filtres"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 'var(--font-size-xs, 0.75rem)',
              color: 'var(--color-danger, #ef4444)',
              fontWeight: 600,
              padding: 0,
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.7'; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
          >
            Tout effacer
          </button>
        )}
      </div>

      {/* Company filters - Toggle switches with ratings */}
      <FilterSection
        title="Compagnies"
        icon="bi-building"
        expanded={expandedSections.company}
        onToggle={() => toggleSection('company')}
        badge={filters.companies?.length}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {COMPANIES.map((company) => (
            <div key={company.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '6px 0' }}>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: 'var(--color-primary-50, rgba(11,29,81,0.06))',
                  color: 'var(--color-primary, #0B1D51)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                {company.name.charAt(0)}
              </div>
              <span style={{ flex: 1, fontSize: 'var(--font-size-sm, 0.875rem)', color: 'var(--text-secondary, #4b5563)' }}>
                {company.name}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 'var(--font-size-xs, 0.75rem)', color: 'var(--text-muted, #9ca3af)' }}>
                <i className="bi bi-star-fill" style={{ color: '#F59E0B', fontSize: '0.6rem' }} />
                {company.rating}
              </span>
              <CustomToggle
                checked={(filters.companies || []).includes(company.id)}
                onChange={() => handleCompanyToggle(company.id)}
                label={company.name}
              />
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Price dual range */}
      <FilterSection
        title="Prix"
        icon="bi-cash-stack"
        expanded={expandedSections.price}
        onToggle={() => toggleSection('price')}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 'var(--font-size-xs, 0.75rem)', color: 'var(--text-muted, #9ca3af)' }}>Minimum</span>
              <span style={{ fontSize: 'var(--font-size-sm, 0.875rem)', fontWeight: 600, color: 'var(--text-primary, #111827)' }}>
                {(filters.priceMin || 0).toLocaleString()} FCFA
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={15000}
              step={500}
              value={filters.priceMin || 0}
              onChange={(e) => onFilterChange({ ...filters, priceMin: Number(e.target.value) })}
              aria-label="Prix minimum"
              style={{
                width: '100%',
                height: 4,
                borderRadius: 2,
                appearance: 'none',
                WebkitAppearance: 'none',
                outline: 'none',
                cursor: 'pointer',
                background: rangeSliderTrackStyle(0, 15000, filters.priceMin || 0, filters.priceMax || 15000),
              }}
            />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 'var(--font-size-xs, 0.75rem)', color: 'var(--text-muted, #9ca3af)' }}>Maximum</span>
              <span style={{ fontSize: 'var(--font-size-sm, 0.875rem)', fontWeight: 600, color: 'var(--text-primary, #111827)' }}>
                {(filters.priceMax || 15000).toLocaleString()} FCFA
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={15000}
              step={500}
              value={filters.priceMax || 15000}
              onChange={(e) => onFilterChange({ ...filters, priceMax: Number(e.target.value) })}
              aria-label="Prix maximum"
              style={{
                width: '100%',
                height: 4,
                borderRadius: 2,
                appearance: 'none',
                WebkitAppearance: 'none',
                outline: 'none',
                cursor: 'pointer',
                background: rangeSliderTrackStyle(0, 15000, filters.priceMin || 0, filters.priceMax || 15000),
              }}
            />
          </div>
        </div>
      </FilterSection>

      {/* Departure time - selectable cards */}
      <FilterSection
        title="Heure de départ"
        icon="bi-clock"
        expanded={expandedSections.time}
        onToggle={() => toggleSection('time')}
        badge={filters.departureTimes?.length}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {timeSlots.map((slot) => {
            const isActive = (filters.departureTimes || []).includes(slot.id);
            return (
              <button
                key={slot.id}
                role="checkbox"
                aria-checked={isActive}
                aria-label={`${slot.label} ${slot.sub}`}
                onClick={() => handleTimeToggle(slot.id)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  padding: '14px 8px',
                  borderRadius: 12,
                  border: `2px solid ${isActive ? 'var(--color-primary, #0B1D51)' : 'var(--color-gray-100, #f3f4f6)'}`,
                  background: isActive ? 'var(--color-primary-50, rgba(11,29,81,0.06))' : 'var(--color-white, #fff)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                }}
              >
                <i className={slot.icon} style={{ fontSize: '1.1rem', color: isActive ? slot.iconColor : 'var(--text-muted, #9ca3af)' }} />
                <span style={{ fontSize: 'var(--font-size-xs, 0.75rem)', fontWeight: 600, color: isActive ? 'var(--text-primary, #111827)' : 'var(--text-secondary, #4b5563)' }}>
                  {slot.label}
                </span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted, #9ca3af)' }}>{slot.sub}</span>
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Duration - Radio cards */}
      <FilterSection
        title="Durée"
        icon="bi-hourglass-split"
        expanded={expandedSections.duration}
        onToggle={() => toggleSection('duration')}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {durationOptions.map((opt) => {
            const isActive = filters.duration === opt.id;
            return (
              <button
                key={opt.id}
                role="radio"
                aria-checked={isActive}
                aria-label={opt.label}
                onClick={() => onFilterChange({ ...filters, duration: isActive ? null : opt.id })}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  borderRadius: 12,
                  border: `2px solid ${isActive ? 'var(--color-primary, #0B1D51)' : 'var(--color-gray-100, #f3f4f6)'}`,
                  background: isActive ? 'var(--color-primary-50, rgba(11,29,81,0.06))' : 'var(--color-white, #fff)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                  textAlign: 'left',
                }}
              >
                <i className={opt.icon} style={{ fontSize: '1rem', color: isActive ? 'var(--color-primary, #0B1D51)' : 'var(--text-muted, #9ca3af)' }} />
                <div>
                  <div style={{ fontSize: 'var(--font-size-sm, 0.875rem)', fontWeight: 600, color: 'var(--text-primary, #111827)' }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: 'var(--font-size-xs, 0.75rem)', color: 'var(--text-muted, #9ca3af)' }}>
                    {opt.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Class - Pill buttons */}
      <FilterSection
        title="Classe"
        icon="bi-gem"
        expanded={expandedSections.class}
        onToggle={() => toggleSection('class')}
        badge={filters.classes?.length}
      >
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {classOptions.map((cls) => {
            const isActive = (filters.classes || []).includes(cls.id);
            return (
              <button
                key={cls.id}
                role="checkbox"
                aria-checked={isActive}
                aria-label={cls.label}
                onClick={() => handleClassToggle(cls.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 16px',
                  borderRadius: 20,
                  border: `2px solid ${isActive ? 'var(--color-primary, #0B1D51)' : 'var(--color-gray-200, #e5e7eb)'}`,
                  background: isActive ? 'var(--color-primary, #0B1D51)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-secondary, #4b5563)',
                  fontSize: 'var(--font-size-sm, 0.875rem)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                }}
              >
                <i className={cls.icon} style={{ fontSize: '0.75rem' }} />
                {cls.label}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* Seats range */}
      <FilterSection
        title="Sièges"
        icon="bi-person-check"
        expanded={expandedSections.seats}
        onToggle={() => toggleSection('seats')}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 'var(--font-size-xs, 0.75rem)', color: 'var(--text-muted, #9ca3af)' }}>Minimum</span>
            <span style={{ fontSize: 'var(--font-size-sm, 0.875rem)', fontWeight: 600, color: 'var(--text-primary, #111827)' }}>
              {filters.minSeats || 0} place{(filters.minSeats || 0) !== 1 ? 's' : ''}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={30}
            step={1}
            value={filters.minSeats || 0}
            onChange={(e) => onFilterChange({ ...filters, minSeats: Number(e.target.value) })}
            aria-label="Nombre minimum de sièges"
            style={{
              width: '100%',
              height: 4,
              borderRadius: 2,
              appearance: 'none',
              WebkitAppearance: 'none',
              outline: 'none',
              cursor: 'pointer',
              background: `linear-gradient(to right, var(--color-primary, #0B1D51) 0%, var(--color-primary, #0B1D51) ${((filters.minSeats || 0) / 30) * 100}%, var(--color-gray-200, #e5e7eb) ${((filters.minSeats || 0) / 30) * 100}%, var(--color-gray-200, #e5e7eb) 100%)`,
            }}
          />
        </div>
      </FilterSection>

      {/* Services - Toggle pills with icons */}
      <FilterSection
        title="Services"
        icon="bi-list-check"
        expanded={expandedSections.services}
        onToggle={() => toggleSection('services')}
        badge={filters.services?.length}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SERVICES.map((service) => {
            const isActive = (filters.services || []).includes(service.id);
            return (
              <button
                key={service.id}
                role="checkbox"
                aria-checked={isActive}
                aria-label={service.label}
                onClick={() => handleServiceToggle(service.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  borderRadius: 20,
                  border: `2px solid ${isActive ? 'var(--color-primary, #0B1D51)' : 'var(--color-gray-200, #e5e7eb)'}`,
                  background: isActive ? 'var(--color-primary, #0B1D51)' : 'transparent',
                  color: isActive ? '#fff' : 'var(--text-secondary, #4b5563)',
                  fontSize: 'var(--font-size-xs, 0.75rem)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  outline: 'none',
                }}
              >
                <i className={service.icon} style={{ fontSize: '0.8rem' }} />
                {service.label}
              </button>
            );
          })}
        </div>
      </FilterSection>
    </aside>
  );
};

export { FilterSection };
export default FilterSidebar;
