import { useState } from 'react';
import CounterTripCard from './CounterTripCard';
import { cities, busClasses, passengerCounts } from '@data/counterSaleData';

const CounterTripSearch = ({ search, results, selectedTrip, onSearch, onSelect, loading, error }) => {
  const [form, setForm] = useState(search);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(form);
  };

  return (
    <div>
      <div className="acs-step__header">
        <h2 className="acs-step__title">Recherche de voyage</h2>
        <p className="acs-step__desc">Trouvez le voyage idéal pour votre client</p>
      </div>

      <form className="acs-search-form" onSubmit={handleSubmit}>
        <div className="acs-field">
          <label className="acs-field__label">Départ</label>
          <select className="acs-field__select" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} required>
            <option value="">Ville de départ</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="acs-field">
          <label className="acs-field__label">Arrivée</label>
          <select className="acs-field__select" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} required>
            <option value="">Ville d'arrivée</option>
            {cities.filter((c) => c !== form.from).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="acs-field">
          <label className="acs-field__label">Date</label>
          <input type="date" className="acs-field__input" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <div className="acs-field">
          <label className="acs-field__label">Passagers</label>
          <select className="acs-field__select" value={form.passengers} onChange={(e) => setForm({ ...form, passengers: Number(e.target.value) })}>
            {passengerCounts.map((n) => <option key={n} value={n}>{n} {n > 1 ? 'passagers' : 'passager'}</option>)}
          </select>
        </div>
        <div className="acs-field">
          <label className="acs-field__label">Classe</label>
          <select className="acs-field__select" value={form.busClass} onChange={(e) => setForm({ ...form, busClass: e.target.value })}>
            {busClasses.map((bc) => <option key={bc.id} value={bc.id}>{bc.label}</option>)}
          </select>
        </div>
        <button type="submit" className="acs-btn acs-btn--primary" disabled={loading}>
          {loading ? (
            <i className="bi bi-arrow-repeat" style={{ animation: 'btcSpin 1s linear infinite' }} />
          ) : (
            <i className="bi bi-search" />
          )}{' '}
          {loading ? 'Recherche…' : 'Rechercher'}
        </button>
      </form>

      {error && (
        <div className="acs-empty" style={{ padding: '20px' }}>
          <div className="acs-empty__icon"><i className="bi bi-exclamation-triangle" /></div>
          <h3 className="acs-empty__title">Erreur</h3>
          <p className="acs-empty__desc">{error}</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="acs-results">
          <div className="acs-results__count">
            {results.length} voyage{results.length > 1 ? 's' : ''} trouvé{results.length > 1 ? 's' : ''}
          </div>
          {results.map((trip) => (
            <CounterTripCard key={trip.id} trip={trip} selected={selectedTrip?.id === trip.id} onSelect={onSelect} />
          ))}
        </div>
      )}

      {form.from && form.to && !loading && !error && results.length === 0 && (
        <div className="acs-empty">
          <div className="acs-empty__icon"><i className="bi bi-search" /></div>
          <h3 className="acs-empty__title">Aucun voyage trouvé</h3>
          <p className="acs-empty__desc">Essayez de modifier vos critères de recherche</p>
        </div>
      )}
    </div>
  );
};

export default CounterTripSearch;
