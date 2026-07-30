import { useState, useRef, useEffect, useCallback } from 'react';
import clsx from 'clsx';

const CounterCustomerSearch = ({ customers = [], onSelect, onClose, quick }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handle = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const getInitials = (name) =>
    (name || '').split(' ').map((s) => s.charAt(0)).join('').toUpperCase().slice(0, 2);

  const performSearch = useCallback((q) => {
    if (!q.trim()) {
      setResults([]);
      setActiveIndex(-1);
      return;
    }
    const lq = q.toLowerCase();
    const filtered = customers.filter((c) => {
      const name = (c.nom || '').toLowerCase();
      const phone = (c.telephone || '');
      const email = (c.email || '').toLowerCase();
      return name.includes(lq) || phone.includes(lq) || email.includes(lq);
    });
    setResults(filtered.slice(0, 10));
    setActiveIndex(-1);
  }, [customers]);

  useEffect(() => {
    if (customers.length > 0) {
      performSearch(query);
    }
  }, [query, customers, performSearch]);

  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    if (quick) {
      performSearch(q);
    }
  };

  const handleKeyDown = (e) => {
    if (results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(results[activeIndex]);
    }
  };

  const handleSelect = (customer) => {
    onSelect?.(customer);
    onClose?.();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  const STATUS_CONFIG = {
    nouveau: { color: '#10B981', label: 'Nouveau' },
    actif: { color: '#3B82F6', label: 'Actif' },
    vip: { color: '#8B5CF6', label: 'VIP' },
    inactif: { color: '#6B7280', label: 'Inactif' },
    suspendu: { color: '#EF4444', label: 'Suspendu' },
  };

  return (
    <div className="acc-search-overlay" onClick={handleOverlayClick}>
      <div className="acc-search-modal">
        <div className="acc-search-header">
          <div className="acc-search-input-group">
            <i className="bi bi-search acc-search-modal-icon" />
            <input
              ref={inputRef}
              type="text"
              className="acc-search-input-modal"
              placeholder="Rechercher par nom, téléphone ou email..."
              value={query}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
            {query && (
              <button className="acc-search-clear-modal" onClick={() => setQuery('')}>
                <i className="bi bi-x" />
              </button>
            )}
          </div>
          <button className="acc-search-close" onClick={onClose}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <div className="acc-search-body">
          {!query.trim() ? (
            <div className="acc-search-hint">
              <i className="bi bi-arrow-up" />
              <span>Commencez à taper pour rechercher des clients</span>
            </div>
          ) : results.length === 0 ? (
            <div className="acc-search-no-results">
              <i className="bi bi-search" />
              <span>Aucun résultat pour "<strong>{query}</strong>"</span>
            </div>
          ) : (
            <div className="acc-search-results" ref={listRef}>
              {results.map((c, i) => {
                const st = STATUS_CONFIG[c.status] || STATUS_CONFIG.actif;
                const isActive = i === activeIndex;
                return (
                  <div
                    key={c.id}
                    className={clsx('acc-search-result-item', { active: isActive })}
                    onClick={() => handleSelect(c)}
                    onMouseEnter={() => setActiveIndex(i)}
                  >
                    <div className="acc-search-result-photo">
                      {c.photo ? (
                        <img src={c.photo} alt={c.nom} />
                      ) : (
                        <span>{getInitials(c.nom)}</span>
                      )}
                    </div>
                    <div className="acc-search-result-info">
                      <div className="acc-search-result-name">{c.nom}</div>
                      <div className="acc-search-result-contact">
                        <span><i className="bi bi-telephone" /> {c.telephone}</span>
                        <span><i className="bi bi-envelope" /> {c.email}</span>
                      </div>
                    </div>
                    <span
                      className="acc-status-badge acc-status-sm"
                      style={{ background: `${st.color}15`, color: st.color, borderColor: `${st.color}30` }}
                    >
                      {st.label}
                    </span>
                  </div>
                );
              })}
              {customers.length > 10 && (
                <div className="acc-search-more">
                  {results.length <= 10 && customers.length > 10
                    ? 'Affinez votre recherche pour plus de résultats'
                    : ''}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CounterCustomerSearch;
