import { useState, useCallback, useEffect } from 'react';
import CounterCustomerStats from '@components/counter/CounterCustomerStats';
import CounterCustomerFilters from '@components/counter/CounterCustomerFilters';
import CounterCustomerTable from '@components/counter/CounterCustomerTable';
import CounterCustomerSearch from '@components/counter/CounterCustomerSearch';
import CounterCustomerProfile from '@components/counter/CounterCustomerProfile';
import CounterCustomerNotes from '@components/counter/CounterCustomerNotes';
import CounterCustomerSkeleton from '@components/counter/CounterCustomerSkeleton';
import {
  customers as allCustomers,
  customerStats,
  customerFilterOptions,
  filterCustomers,
  sortCustomers,
  generateCustomerId,
  findCustomerByPhone,
  findCustomerByEmail,
} from '@data/counterCustomerData';

const PAGE_SIZE = 10;

const newCustomerDefaults = {
  firstName: '',
  lastName: '',
  phone: '',
  email: '',
  address: '',
  city: '',
  country: 'Cameroun',
  idDocumentType: '',
  idDocumentNumber: '',
};

const CounterCustomersPage = () => {
  const [loading, setLoading] = useState(true);
  const [customers, setCustomers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    city: '',
    dateFrom: '',
    dateTo: '',
  });
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [showQuickSearch, setShowQuickSearch] = useState(false);
  const [showProfile, setShowProfile] = useState(null);
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [newCustomer, setNewCustomer] = useState(newCustomerDefaults);
  const [formErrors, setFormErrors] = useState({});
  const [notes, setNotes] = useState({});
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCustomers(allCustomers);
      setFiltered(allCustomers);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let result = filterCustomers(customers, filters);
    result = sortCustomers(result, sortBy);
    setFiltered(result);
    setPage(1);
  }, [customers, filters, sortBy]);

  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowQuickSearch(true);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (!showQuickSearch) return;
    const handler = (e) => {
      if (e.key === 'Escape') setShowQuickSearch(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [showQuickSearch]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleReset = useCallback(() => {
    setFilters({ search: '', status: '', city: '', dateFrom: '', dateTo: '' });
  }, []);

  const handleViewProfile = useCallback((customer) => {
    setShowProfile(customer);
  }, []);

  const handleAddNote = useCallback((customerId, text) => {
    if (!text.trim()) return;
    const note = {
      id: Date.now(),
      author: 'Kodjo Jojo',
      text: text.trim(),
      date: new Date().toISOString(),
    };
    setNotes((prev) => ({
      ...prev,
      [customerId]: [...(prev[customerId] || []), note],
    }));
    addToast('Note ajoutée');
  }, [addToast]);

  const validateForm = () => {
    const errors = {};
    if (!newCustomer.firstName.trim()) errors.firstName = 'Prénom requis';
    if (!newCustomer.lastName.trim()) errors.lastName = 'Nom requis';
    if (!newCustomer.phone.trim()) errors.phone = 'Téléphone requis';
    else if (findCustomerByPhone(customers, newCustomer.phone.trim()))
      errors.phone = 'Ce numéro existe déjà';
    if (newCustomer.email.trim() && findCustomerByEmail(customers, newCustomer.email.trim()))
      errors.email = 'Cet email existe déjà';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNewCustomerChange = useCallback((field, value) => {
    setNewCustomer((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const handleNewCustomerSubmit = useCallback(() => {
    if (!validateForm()) return;
    const customer = {
      ...newCustomer,
      id: generateCustomerId(),
      name: `${newCustomer.firstName} ${newCustomer.lastName}`,
      status: 'nouveau',
      createdAt: new Date().toISOString(),
      totalBookings: 0,
      totalSpent: 0,
      lastVisit: null,
    };
    setCustomers((prev) => [customer, ...prev]);
    setShowNewCustomer(false);
    setNewCustomer(newCustomerDefaults);
    setFormErrors({});
    addToast(`Client ${customer.name} créé avec succès`);
  }, [newCustomer, customers, addToast]);

  const handleCloseNewCustomer = useCallback(() => {
    setShowNewCustomer(false);
    setNewCustomer(newCustomerDefaults);
    setFormErrors({});
  }, []);

  const handleCloseProfile = useCallback(() => {
    setShowProfile(null);
  }, []);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <CounterCustomerSkeleton />;

  return (
    <div className="acc-wrapper">
      {/* Header */}
      <div className="acc-header">
        <div className="acc-header-left">
          <h1 className="acc-title">Gestion des clients</h1>
          <p className="acc-subtitle">
            Gérez les profils clients de votre guichet — <strong>{customers.length}</strong> clients
          </p>
        </div>
        <div className="acc-header-actions">
          <button
            className="acc-btn acc-btn-secondary"
            onClick={() => setShowQuickSearch(true)}
          >
            <i className="bi bi-search" /> Recherche rapide{' '}
            <span style={{
              background: '#E5E7EB',
              padding: '1px 6px',
              borderRadius: 4,
              fontSize: 11,
              color: '#6B7280',
              fontWeight: 600,
            }}>Ctrl+K</span>
          </button>
          <button
            className="acc-btn acc-btn-primary"
            onClick={() => setShowNewCustomer(true)}
          >
            <i className="bi bi-plus-lg" /> Nouveau client
          </button>
        </div>
      </div>

      {/* Stats */}
      <CounterCustomerStats stats={customerStats} />

      {/* Filters */}
      <CounterCustomerFilters
        filters={filters}
        filterOptions={customerFilterOptions}
        onFilterChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Results Info */}
      <div className="acc-results">
        <span className="acc-results-count">
          <strong>{filtered.length}</strong> client{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
          {filtered.length !== customers.length && ` (sur ${customers.length})`}
        </span>
        <select
          className="acc-sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Plus récents</option>
          <option value="oldest">Plus anciens</option>
          <option value="name_asc">Nom A-Z</option>
          <option value="name_desc">Nom Z-A</option>
          <option value="bookings_desc">Réservations ↓</option>
          <option value="spent_desc">Dépenses ↓</option>
        </select>
      </div>

      {/* Table */}
      {filtered.length > 0 ? (
        <CounterCustomerTable
          customers={paginated}
          onViewProfile={handleViewProfile}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          allNotes={notes}
        />
      ) : (
        <div className="acc-empty">
          <div className="acc-empty-icon">
            <i className="bi bi-people" />
          </div>
          <div className="acc-empty-title">Aucun client trouvé</div>
          <div className="acc-empty-text">
            Aucun résultat ne correspond à vos critères. Essayez de modifier vos filtres.
          </div>
        </div>
      )}

      {/* Quick Search Modal */}
      {showQuickSearch && (
        <CounterCustomerSearch
          customers={customers}
          onClose={() => setShowQuickSearch(false)}
          onSelect={(customer) => {
            setShowQuickSearch(false);
            setShowProfile(customer);
          }}
        />
      )}

      {/* Profile Modal */}
      {showProfile && (
        <CounterCustomerProfile
          customer={showProfile}
          notes={notes[showProfile.id] || []}
          onClose={handleCloseProfile}
          onAddNote={(text) => handleAddNote(showProfile.id, text)}
        />
      )}

      {/* New Customer Modal */}
      {showNewCustomer && (
        <div className="acc-modal-overlay" onClick={handleCloseNewCustomer}>
          <div className="acc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="acc-modal-header">
              <h2 className="acc-modal-title">
                <i className="bi bi-person-plus" /> Nouveau client
              </h2>
              <button className="acc-modal-close" onClick={handleCloseNewCustomer}>
                <i className="bi bi-x" />
              </button>
            </div>
            <div className="acc-modal-body">
              <div className="acc-form-grid">
                <div className="acc-form-group">
                  <label className="acc-form-label">
                    Prénom <span className="acc-form-required">*</span>
                  </label>
                  <input
                    className={`acc-form-input${formErrors.firstName ? ' error' : ''}`}
                    value={newCustomer.firstName}
                    onChange={(e) => handleNewCustomerChange('firstName', e.target.value)}
                    placeholder="Jean"
                  />
                  {formErrors.firstName && <span className="acc-form-error">{formErrors.firstName}</span>}
                </div>
                <div className="acc-form-group">
                  <label className="acc-form-label">
                    Nom <span className="acc-form-required">*</span>
                  </label>
                  <input
                    className={`acc-form-input${formErrors.lastName ? ' error' : ''}`}
                    value={newCustomer.lastName}
                    onChange={(e) => handleNewCustomerChange('lastName', e.target.value)}
                    placeholder="Kamga"
                  />
                  {formErrors.lastName && <span className="acc-form-error">{formErrors.lastName}</span>}
                </div>
                <div className="acc-form-group">
                  <label className="acc-form-label">
                    Téléphone <span className="acc-form-required">*</span>
                  </label>
                  <input
                    className={`acc-form-input${formErrors.phone ? ' error' : ''}`}
                    value={newCustomer.phone}
                    onChange={(e) => handleNewCustomerChange('phone', e.target.value)}
                    placeholder="691234567"
                  />
                  {formErrors.phone && <span className="acc-form-error">{formErrors.phone}</span>}
                </div>
                <div className="acc-form-group">
                  <label className="acc-form-label">Email</label>
                  <input
                    className={`acc-form-input${formErrors.email ? ' error' : ''}`}
                    value={newCustomer.email}
                    onChange={(e) => handleNewCustomerChange('email', e.target.value)}
                    placeholder="jean.kamga@email.com"
                  />
                  {formErrors.email && <span className="acc-form-error">{formErrors.email}</span>}
                </div>
                <div className="acc-form-group full">
                  <label className="acc-form-label">Adresse</label>
                  <input
                    className="acc-form-input"
                    value={newCustomer.address}
                    onChange={(e) => handleNewCustomerChange('address', e.target.value)}
                    placeholder="123 Rue Principale"
                  />
                </div>
                <div className="acc-form-group">
                  <label className="acc-form-label">Ville</label>
                  <input
                    className="acc-form-input"
                    value={newCustomer.city}
                    onChange={(e) => handleNewCustomerChange('city', e.target.value)}
                    placeholder="Douala"
                  />
                </div>
                <div className="acc-form-group">
                  <label className="acc-form-label">Pays</label>
                  <input
                    className="acc-form-input"
                    value={newCustomer.country}
                    onChange={(e) => handleNewCustomerChange('country', e.target.value)}
                  />
                </div>
                <div className="acc-form-group">
                  <label className="acc-form-label">Type de pièce</label>
                  <select
                    className="acc-form-select"
                    value={newCustomer.idDocumentType}
                    onChange={(e) => handleNewCustomerChange('idDocumentType', e.target.value)}
                  >
                    <option value="">Sélectionner</option>
                    <option value="CNI">CNI</option>
                    <option value="Passeport">Passeport</option>
                    <option value="Permis">Permis de conduire</option>
                  </select>
                </div>
                <div className="acc-form-group">
                  <label className="acc-form-label">N° de pièce</label>
                  <input
                    className="acc-form-input"
                    value={newCustomer.idDocumentNumber}
                    onChange={(e) => handleNewCustomerChange('idDocumentNumber', e.target.value)}
                    placeholder="Numéro du document"
                  />
                </div>
              </div>
            </div>
            <div className="acc-modal-footer">
              <button className="acc-btn acc-btn-secondary" onClick={handleCloseNewCustomer}>
                Annuler
              </button>
              <button className="acc-btn acc-btn-primary" onClick={handleNewCustomerSubmit}>
                <i className="bi bi-check-lg" /> Créer le client
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toasts */}
      {toasts.length > 0 && (
        <div className="acc-toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`acc-toast acc-toast-${toast.type}`}>
              <i
                className={`bi ${
                  toast.type === 'success'
                    ? 'bi-check-circle-fill'
                    : toast.type === 'error'
                    ? 'bi-x-circle-fill'
                    : 'bi-info-circle-fill'
                } acc-toast-icon`}
              />
              {toast.message}
              <button
                className="acc-toast-close"
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              >
                <i className="bi bi-x" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CounterCustomersPage;
