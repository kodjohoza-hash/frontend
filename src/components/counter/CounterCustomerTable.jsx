import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import CounterCustomerCard from './CounterCustomerCard';
import { formatCurrency, formatDate } from '@data/counterCustomerData';

const STATUS_CONFIG = {
  nouveau: { color: '#10B981', label: 'Nouveau' },
  actif: { color: '#3B82F6', label: 'Actif' },
  vip: { color: '#8B5CF6', label: 'VIP' },
  inactif: { color: '#6B7280', label: 'Inactif' },
  suspendu: { color: '#EF4444', label: 'Suspendu' },
};

const ACTIONS = [
  { key: 'view', icon: 'bi-eye', label: 'Voir' },
  { key: 'edit', icon: 'bi-pencil', label: 'Modifier' },
  { key: 'reservation', icon: 'bi-plus-circle', label: 'Nouvelle réservation' },
  { key: 'sale', icon: 'bi-cart-plus', label: 'Nouvelle vente' },
  { key: 'tickets', icon: 'bi-ticket-perforated', label: 'Billets' },
  { key: 'payments', icon: 'bi-credit-card', label: 'Paiements' },
  { key: 'history', icon: 'bi-clock-history', label: 'Historique' },
  { key: 'notes', icon: 'bi-sticky', label: 'Note' },
];

const SORTABLE = ['nom', 'telephone', 'ville', 'totalVoyages', 'totalReservations', 'totalBillets', 'statut'];

const ITEMS_PER_PAGE = 10;

const CounterCustomerTable = ({ customers = [], onAction, page = 1, onPageChange, sortBy, onSortChange }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const menuRef = useRef(null);

  const totalPages = Math.max(1, Math.ceil(customers.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const paged = customers.slice(start, start + ITEMS_PER_PAGE);

  useEffect(() => {
    const handle = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(null);
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  const handleAction = (action, customer) => {
    setOpenMenu(null);
    onAction?.(action, customer);
  };

  const getInitials = (name) =>
    (name || '')
      .split(' ')
      .map((s) => s.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const handleSort = (key) => {
    if (!SORTABLE.includes(key)) return;
    if (sortBy?.key === key) {
      onSortChange?.({ key, dir: sortBy.dir === 'asc' ? 'desc' : 'asc' });
    } else {
      onSortChange?.({ key, dir: 'asc' });
    }
  };

  const renderSortIcon = (key) => {
    if (!SORTABLE.includes(key)) return null;
    if (sortBy?.key !== key) return <i className="bi bi-arrow-down-up acc-sort-icon muted" />;
    return (
      <i className={clsx('bi', sortBy.dir === 'asc' ? 'bi-sort-up' : 'bi-sort-down', 'acc-sort-icon active')} />
    );
  };

  if (customers.length === 0) {
    return (
      <div className="acc-table-container">
        <div className="acc-empty">
          <div className="acc-empty-icon"><i className="bi bi-people" /></div>
          <div className="acc-empty-title">Aucun client trouvé</div>
          <div className="acc-empty-text">
            Aucun client ne correspond à vos critères de recherche. Essayez de modifier vos filtres.
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="acc-table-container">
        <table className="acc-table">
          <thead>
            <tr>
              <th className="acc-th-photo">Photo</th>
              <th className={clsx('acc-th-sort', { sortable: SORTABLE.includes('nom') })} onClick={() => handleSort('nom')}>
                Nom {renderSortIcon('nom')}
              </th>
              <th className={clsx('acc-th-sort', { sortable: SORTABLE.includes('telephone') })} onClick={() => handleSort('telephone')}>
                Téléphone {renderSortIcon('telephone')}
              </th>
              <th>Email</th>
              <th className={clsx('acc-th-sort', { sortable: SORTABLE.includes('ville') })} onClick={() => handleSort('ville')}>
                Ville {renderSortIcon('ville')}
              </th>
              <th>Dernier voyage</th>
              <th className={clsx('acc-th-sort', { sortable: SORTABLE.includes('totalReservations') })} onClick={() => handleSort('totalReservations')}>
                Réservations {renderSortIcon('totalReservations')}
              </th>
              <th className={clsx('acc-th-sort', { sortable: SORTABLE.includes('totalBillets') })} onClick={() => handleSort('totalBillets')}>
                Billets {renderSortIcon('totalBillets')}
              </th>
              <th className={clsx('acc-th-sort', { sortable: SORTABLE.includes('statut') })} onClick={() => handleSort('statut')}>
                Statut {renderSortIcon('statut')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((c) => {
              const st = STATUS_CONFIG[c.status] || STATUS_CONFIG.actif;
              return (
                <tr key={c.id}>
                  <td>
                    <div className="acc-table-photo">
                      {c.photo ? (
                        <img src={c.photo} alt={c.nom} />
                      ) : (
                        <span>{getInitials(c.nom)}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="acc-table-name">{c.nom}</div>
                    {c.codeClient && <div className="acc-table-code">{c.codeClient}</div>}
                  </td>
                  <td><span className="acc-table-phone">{c.telephone}</span></td>
                  <td><span className="acc-table-email">{c.email}</span></td>
                  <td><span className="acc-table-city"><i className="bi bi-geo-alt" /> {c.ville}</span></td>
                  <td>
                    {c.dernierVoyage ? (
                      <div className="acc-table-date">{formatDate(c.dernierVoyage)}</div>
                    ) : (
                      <span className="acc-table-na">—</span>
                    )}
                  </td>
                  <td className="acc-table-count">{c.totalReservations || 0}</td>
                  <td className="acc-table-count">{c.totalBillets || 0}</td>
                  <td>
                    <span
                      className="acc-status-badge"
                      style={{ background: `${st.color}15`, color: st.color, borderColor: `${st.color}30` }}
                    >
                      {st.label}
                    </span>
                  </td>
                  <td>
                    <div className="acc-table-actions">
                      <button className="acc-action-btn" title="Voir" onClick={() => handleAction('view', c)}>
                        <i className="bi bi-eye" />
                      </button>
                      <div className="acc-actions-dropdown" ref={menuRef}>
                        <button
                          className="acc-action-btn"
                          title="Actions"
                          onClick={() => setOpenMenu(openMenu === c.id ? null : c.id)}
                        >
                          <i className="bi bi-three-dots-vertical" />
                        </button>
                        {openMenu === c.id && (
                          <div className="acc-actions-menu">
                            {ACTIONS.map((a) => (
                              <button
                                key={a.key}
                                className="acc-actions-menu-item"
                                onClick={() => handleAction(a.key, c)}
                              >
                                <i className={clsx('bi', a.icon)} />
                                <span>{a.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="acc-table-mobile">
          {paged.map((c, i) => (
            <CounterCustomerCard key={c.id} customer={c} onAction={onAction} index={i} />
          ))}
        </div>
      </div>

      {totalPages > 1 && (
        <div className="acc-pagination">
          <button
            className="acc-page-btn"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            <i className="bi bi-chevron-left" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((i) => (
            <button
              key={i}
              className={clsx('acc-page-btn', { active: i === currentPage })}
              onClick={() => onPageChange(i)}
            >
              {i}
            </button>
          ))}
          <button
            className="acc-page-btn"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            <i className="bi bi-chevron-right" />
          </button>
          <span className="acc-page-info">
            Page {currentPage}/{totalPages} ({customers.length} clients)
          </span>
        </div>
      )}
    </>
  );
};

export default CounterCustomerTable;
