import { useState, useMemo, useCallback, Suspense } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { mockTrips } from '@data/searchResults';
import '@assets/styles/booking-create.css';

const STEPS = ['Recherche', 'Choix du trajet', 'Confirmation'];

const StepIndicator = ({ current }) => (
  <div className="bc-step-indicator">
    {STEPS.map((label, i) => (
      <div key={i} className={`bc-step ${i <= current ? 'bc-step--active' : ''} ${i < current ? 'bc-step--done' : ''}`}>
        <div className="bc-step__circle">{i < current ? <i className="bi bi-check" /> : i + 1}</div>
        <span className="bc-step__label">{label}</span>
        {i < STEPS.length - 1 && <div className={`bc-step__line ${i < current ? 'bc-step__line--done' : ''}`} />}
      </div>
    ))}
  </div>
);

const SearchStep = ({ form, onChange, onSubmit }) => {
  const cities = [...new Set(mockTrips.flatMap(t => [t.departureCity, t.arrivalCity]))].sort();
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="bc-card">
      <h3 className="bc-card__title">Où souhaitez-vous aller ?</h3>
      <form className="bc-form" onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <div className="bc-form__row">
          <div className="bc-form__group">
            <label className="bc-form__label">Départ</label>
            <select className="bc-form__select" value={form.from} onChange={(e) => onChange({ from: e.target.value, to: e.target.value === form.to ? '' : form.to })} required>
              <option value="">Ville de départ</option>
              {cities.filter(c => c !== form.to).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button type="button" className="bc-form__swap" onClick={() => onChange({ from: form.to, to: form.from })} title="Échanger">
            <i className="bi bi-arrow-left-right" />
          </button>
          <div className="bc-form__group">
            <label className="bc-form__label">Arrivée</label>
            <select className="bc-form__select" value={form.to} onChange={(e) => onChange({ to: e.target.value })} required>
              <option value="">Ville d'arrivée</option>
              {cities.filter(c => c !== form.from).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="bc-form__row">
          <div className="bc-form__group">
            <label className="bc-form__label">Date de départ</label>
            <input type="date" className="bc-form__input" value={form.date} min={today} onChange={(e) => onChange({ date: e.target.value })} required />
          </div>
          <div className="bc-form__group">
            <label className="bc-form__label">Passagers</label>
            <div className="bc-passenger-select">
              <button type="button" className="bc-passenger-btn" onClick={() => onChange({ passengers: Math.max(1, form.passengers - 1) })} disabled={form.passengers <= 1}>
                <i className="bi bi-dash" />
              </button>
              <span className="bc-passenger-count">{form.passengers}</span>
              <button type="button" className="bc-passenger-btn" onClick={() => onChange({ passengers: Math.min(10, form.passengers + 1) })} disabled={form.passengers >= 10}>
                <i className="bi bi-plus" />
              </button>
            </div>
          </div>
        </div>
        <button type="submit" className="bc-btn bc-btn--primary bc-btn--full">
          <i className="bi bi-search" /> Rechercher des trajets
        </button>
      </form>
    </div>
  );
};

const TripCard = ({ trip, selected, onSelect }) => (
  <div className={`bc-trip-card ${selected ? 'bc-trip-card--selected' : ''}`} onClick={() => onSelect(trip.id)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onSelect(trip.id)}>
    <div className="bc-trip-card__radio">
      <div className={`bc-radio ${selected ? 'bc-radio--checked' : ''}`} />
    </div>
    <div className="bc-trip-card__route">
      <div className="bc-trip-card__time">{trip.departureTime}</div>
      <div className="bc-trip-card__city">{trip.departureCity}</div>
    </div>
    <div className="bc-trip-card__path">
      <div className="bc-trip-card__line" />
      <div className="bc-trip-card__duration">{trip.duration}</div>
      <div className="bc-trip-card__line" />
    </div>
    <div className="bc-trip-card__route bc-trip-card__route--arrival">
      <div className="bc-trip-card__time">{trip.arrivalTime}</div>
      <div className="bc-trip-card__city">{trip.arrivalCity}</div>
    </div>
    <div className="bc-trip-card__info">
      <span className="bc-trip-card__company" style={{ color: trip.companyColor }}>{trip.companyName}</span>
      <span className={`bc-trip-card__type bc-trip-card__type--${trip.busType.toLowerCase()}`}>{trip.busType}</span>
    </div>
    <div className="bc-trip-card__price">
      <span className="bc-trip-card__amount">{trip.price.toLocaleString()} <small>XAF</small></span>
      {trip.originalPrice > trip.price && <span className="bc-trip-card__original">{trip.originalPrice.toLocaleString()} XAF</span>}
    </div>
  </div>
);

const TripSelectStep = ({ trips, selectedTripId, onSelect, onBack, onNext }) => (
  <div className="bc-card">
    <div className="bc-card__header">
      <h3 className="bc-card__title">Choisissez votre trajet</h3>
      <span className="bc-card__count">{trips.length} trajet{trips.length > 1 ? 's' : ''} trouvé{trips.length > 1 ? 's' : ''}</span>
    </div>
    <div className="bc-trip-list">
      {trips.map(trip => (
        <TripCard key={trip.id} trip={trip} selected={selectedTripId === trip.id} onSelect={onSelect} />
      ))}
    </div>
    <div className="bc-card__actions">
      <button type="button" className="bc-btn bc-btn--outline" onClick={onBack}>
        <i className="bi bi-arrow-left" /> Retour
      </button>
      <button type="button" className="bc-btn bc-btn--primary" onClick={onNext} disabled={!selectedTripId}>
        Continuer <i className="bi bi-arrow-right" />
      </button>
    </div>
  </div>
);

const ConfirmationStep = ({ trip, passengers, onBack, onConfirm }) => {
  if (!trip) return null;

  return (
    <>
      <div className="bc-card">
        <h3 className="bc-card__title">Résumé de votre réservation</h3>
        <div className="bc-summary">
          <div className="bc-summary__header" style={{ borderLeftColor: trip.companyColor }}>
            <div className="bc-summary__company">
              <span style={{ color: trip.companyColor }}>{trip.companyName}</span>
              <span className={`bc-trip-card__type bc-trip-card__type--${trip.busType.toLowerCase()}`}>{trip.busType}</span>
            </div>
            <div className="bc-summary__rating">
              <i className="bi bi-star-fill" /> {trip.companyRating}
            </div>
          </div>
          <div className="bc-summary__route">
            <div className="bc-summary__point">
              <div className="bc-summary__time">{trip.departureTime}</div>
              <div className="bc-summary__city">{trip.departureCity}</div>
              <div className="bc-summary__place">{trip.departurePoint}</div>
            </div>
            <div className="bc-summary__path">
              <div className="bc-summary__line" />
              <div className="bc-summary__duration"><i className="bi bi-clock" /> {trip.duration}</div>
              <div className="bc-summary__dist">{trip.distance}</div>
              <div className="bc-summary__line" />
            </div>
            <div className="bc-summary__point bc-summary__point--arrival">
              <div className="bc-summary__time">{trip.arrivalTime}</div>
              <div className="bc-summary__city">{trip.arrivalCity}</div>
              <div className="bc-summary__place">{trip.arrivalPoint}</div>
            </div>
          </div>
          <div className="bc-summary__detail-row">
            <span><i className="bi bi-people" /> Passagers</span>
            <span>{passengers} {passengers > 1 ? 'personnes' : 'personne'}</span>
          </div>
          <div className="bc-summary__detail-row">
            <span><i className="bi bi-calendar" /> Date</span>
            <span>{new Date().toLocaleDateString('fr-FR')}</span>
          </div>
          <div className="bc-summary__detail-row">
            <span><i className="bi bi-cup-straw" /> Services inclus</span>
            <span className="bc-summary__services">
              {trip.services.slice(0, 4).map(s => (
                <span key={s} className="bc-summary__service">{s}</span>
              ))}
              {trip.services.length > 4 && <span className="bc-summary__service">+{trip.services.length - 4}</span>}
            </span>
          </div>
        </div>
      </div>

      <div className="bc-card">
        <h3 className="bc-card__title">Détails des prix</h3>
        <div className="bc-pricing">
          <div className="bc-pricing__row">
            <span>Prix unitaire</span>
            <span>{trip.price.toLocaleString()} XAF</span>
          </div>
          <div className="bc-pricing__row">
            <span>× {passengers} passager{passengers > 1 ? 's' : ''}</span>
            <span>{(trip.price * passengers).toLocaleString()} XAF</span>
          </div>
          <div className="bc-pricing__row bc-pricing__row--fee">
            <span>Frais de service</span>
            <span>Gratuit</span>
          </div>
          <div className="bc-pricing__divider" />
          <div className="bc-pricing__total">
            <span>Total à payer</span>
            <span className="bc-pricing__amount">{(trip.price * passengers).toLocaleString()} XAF</span>
          </div>
        </div>
        <p className="bc-pricing__notice">
          <i className="bi bi-info-circle" /> Annulation gratuite jusqu'à 2h avant le départ.
        </p>
      </div>

      <div className="bc-card__actions">
        <button type="button" className="bc-btn bc-btn--outline" onClick={onBack}>
          <i className="bi bi-arrow-left" /> Retour
        </button>
        <button type="button" className="bc-btn bc-btn--primary" onClick={onConfirm}>
          <i className="bi bi-check-circle" /> Confirmer la réservation
        </button>
      </div>
    </>
  );
};

const SuccessView = ({ trip, passengers }) => (
  <div className="bc-success">
    <div className="bc-success__icon"><i className="bi bi-check-circle-fill" /></div>
    <h2 className="bc-success__title">Réservation confirmée !</h2>
    <p className="bc-success__text">
      Votre voyage {trip.departureCity} → {trip.arrivalCity} du {new Date().toLocaleDateString('fr-FR')} à {trip.departureTime} a bien été réservé.
    </p>
    <div className="bc-success__ref">
      Réf: <strong>BTC-{Date.now().toString(36).toUpperCase()}</strong>
    </div>
    <p className="bc-success__text">Un email de confirmation vous a été envoyé avec vos billets électroniques.</p>
  </div>
);

const CreateBookingPage = () => {
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  const [step, setStep] = useState(0);
  const [searchForm, setSearchForm] = useState({ from: '', to: '', date: today, passengers: 1 });
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const updateForm = useCallback((updates) => {
    setSearchForm(prev => ({ ...prev, ...updates }));
  }, []);

  const searchResults = useMemo(() => {
    if (!searchForm.from || !searchForm.to) return [];
    return mockTrips.filter(t =>
      t.departureCity === searchForm.from && t.arrivalCity === searchForm.to
    );
  }, [searchForm.from, searchForm.to]);

  const selectedTrip = useMemo(() => {
    return selectedTripId ? mockTrips.find(t => t.id === selectedTripId) : null;
  }, [selectedTripId]);

  const handleSearch = useCallback(() => {
    if (searchForm.from && searchForm.to) setStep(1);
  }, [searchForm]);

  const handleConfirm = useCallback(() => {
    setConfirmed(true);
  }, []);

  if (confirmed && selectedTrip) {
    return (
      <div className="bc-page">
        <SuccessView trip={selectedTrip} passengers={searchForm.passengers} />
      </div>
    );
  }

  return (
    <div className="bc-page">
      <div className="bc-page__header">
        <h1 className="bc-page__title">Nouvelle réservation</h1>
        <p className="bc-page__subtitle">Réservez votre voyage en quelques étapes.</p>
      </div>
      <StepIndicator current={step} />
      <div className="bc-content">
        {step === 0 && (
          <SearchStep form={searchForm} onChange={updateForm} onSubmit={handleSearch} />
        )}
        {step === 1 && (
          <TripSelectStep
            trips={searchResults}
            selectedTripId={selectedTripId}
            onSelect={setSelectedTripId}
            onBack={() => { setStep(0); setSelectedTripId(null); }}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <ConfirmationStep
            trip={selectedTrip}
            passengers={searchForm.passengers}
            onBack={() => setStep(1)}
            onConfirm={handleConfirm}
          />
        )}
      </div>
    </div>
  );
};

const CreateBooking = () => (
  <Suspense fallback={<div className="bc-page"><div className="bc-skeleton" /></div>}>
    <CreateBookingPage />
  </Suspense>
);

export default CreateBooking;
