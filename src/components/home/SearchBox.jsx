import { useState, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { CITIES } from '@data/landingPage';

const SearchBox = () => {
  const id = useId();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    departure: '', destination: '', departureDate: '', returnDate: '', passengers: 1, travelClass: 'economy',
  });

  const set = (field) => (e) => setForm((p) => ({ ...p, [field]: e.target.value }));
  const swap = () => setForm((p) => ({ ...p, departure: p.destination, destination: p.departure }));
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (form.departure) params.set('from', form.departure);
    if (form.destination) params.set('to', form.destination);
    if (form.departureDate) params.set('date', form.departureDate);
    if (form.passengers) params.set('passengers', form.passengers);
    if (form.travelClass) params.set('class', form.travelClass);
    navigate(`/booking/search?${params.toString()}`);
  };

  return (
    <section id="search" className="btc-search-section" aria-label="Rechercher un voyage">
      <div className="container">
        <div className="btc-search-card">
          <div className="btc-search-header">
            <div className="btc-search-header-icon">
              <i className="bi bi-search" />
            </div>
            <div>
              <h2 className="btc-search-title">Où souhaitez-vous aller ?</h2>
              <p className="btc-search-subtitle">Trouvez le meilleur voyage en quelques secondes</p>
            </div>
          </div>

          <div className="btc-search-divider" />

          <form className="btc-search-form" onSubmit={handleSubmit} noValidate>
            <div className="btc-search-fields">
              {/* Departure */}
              <div className="btc-search-field">
                <label className="btc-search-label" htmlFor={`${id}-dep`}>
                  <i className="bi bi-geo-alt" /> Départ
                </label>
                <select id={`${id}-dep`} className="btc-search-input" value={form.departure} onChange={set('departure')} required>
                  <option value="">Ville de départ</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Swap */}
              <button type="button" className="btc-search-swap" onClick={swap} aria-label="Inverser départ et destination">
                <i className="bi bi-arrow-left-right" />
              </button>

              {/* Destination */}
              <div className="btc-search-field">
                <label className="btc-search-label" htmlFor={`${id}-dest`}>
                  <i className="bi bi-flag" /> Destination
                </label>
                <select id={`${id}-dest`} className="btc-search-input" value={form.destination} onChange={set('destination')} required>
                  <option value="">Choisir une destination</option>
                  {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Departure date */}
              <div className="btc-search-field">
                <label className="btc-search-label" htmlFor={`${id}-dep-date`}>
                  <i className="bi bi-calendar-event" /> Date de départ
                </label>
                <input id={`${id}-dep-date`} type="date" className="btc-search-input" value={form.departureDate} onChange={set('departureDate')} min={today} required />
              </div>

              {/* Return date */}
              <div className="btc-search-field">
                <label className="btc-search-label" htmlFor={`${id}-ret-date`}>
                  <i className="bi bi-calendar-check" /> Date retour
                </label>
                <input id={`${id}-ret-date`} type="date" className="btc-search-input" value={form.returnDate} onChange={set('returnDate')} min={form.departureDate || today} />
                <span className="btc-search-optional">Optionnel</span>
              </div>

              {/* Passengers */}
              <div className="btc-search-field">
                <label className="btc-search-label" htmlFor={`${id}-pax`}>
                  <i className="bi bi-people" /> Voyageurs
                </label>
                <select id={`${id}-pax`} className="btc-search-input" value={form.passengers} onChange={set('passengers')} required>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? 'voyageur' : 'voyageurs'}</option>
                  ))}
                </select>
              </div>

              {/* Class */}
              <div className="btc-search-field">
                <label className="btc-search-label" htmlFor={`${id}-cls`}>
                  <i className="bi bi-gem" /> Classe
                </label>
                <select id={`${id}-cls`} className="btc-search-input" value={form.travelClass} onChange={set('travelClass')}>
                  <option value="economy">Économique</option>
                  <option value="business">Affaires</option>
                  <option value="first">VIP</option>
                </select>
              </div>

              {/* Submit */}
              <div className="btc-search-submit-wrap">
                <button type="submit" className="btn btn-accent btc-search-submit" aria-label="Rechercher un voyage">
                  <i className="bi bi-search me-2" />
                  Rechercher
                </button>
              </div>
            </div>
          </form>

          <div className="btc-search-quick">
            <span className="btc-search-quick-label">Départs populaires :</span>
            <div className="btc-search-quick-tags">
              {[
                { from: 'Yaoundé', to: 'Douala', label: 'Yaoundé → Douala' },
                { from: 'Douala', to: 'Bamenda', label: 'Douala → Bamenda' },
                { from: 'Yaoundé', to: 'Bafoussam', label: 'Yaoundé → Bafoussam' },
                { from: 'Douala', to: 'Kribi', label: 'Douala → Kribi' },
              ].map((tag) => (
                <button key={tag.label} className="btc-search-quick-tag" type="button" onClick={() => { navigate(`/booking/search?from=${tag.from}&to=${tag.to}`); }}>{tag.label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchBox;
