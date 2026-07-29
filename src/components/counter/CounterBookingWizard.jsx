import { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import {
  companiesList, tripsList, busesList, clientsList, salePointsList,
  formatCurrency, paymentMethodsList
} from '@data/counterBookingData';

const STEPS = [
  { key: 'trip', label: 'Voyage', icon: 'bi-geo-alt' },
  { key: 'bus', label: 'Bus', icon: 'bi-bus-front' },
  { key: 'seats', label: 'Sièges', icon: 'bi-grid-3x3' },
  { key: 'passenger', label: 'Passager', icon: 'bi-person' },
  { key: 'validation', label: 'Validation', icon: 'bi-check2-square' },
];

const STORAGE_KEY = 'btc_booking_wizard';

const generateSeatMap = (capacity) => {
  const cols = 5;
  const rows = Math.ceil(capacity / cols);
  const seats = [];
  for (let r = 0; r < rows; r++) {
    const rowLetter = String.fromCharCode(65 + r);
    for (let c = 1; c <= cols; c++) {
      const seatId = `${rowLetter}${c}`;
      const isTaken = Math.random() < 0.25;
      seats.push({ id: seatId, taken: isTaken, selected: false });
    }
  }
  return seats;
};

const generateTripOptions = () => {
  const hours = ['06:00', '07:30', '09:00', '10:30', '12:00', '13:30', '15:00', '16:30', '18:00', '19:30', '21:00'];
  return tripsList.flatMap((trip) =>
    hours.slice(0, 4).map((time, idx) => ({
      id: `${trip.id}-${idx}`,
      tripId: trip.id,
      from: trip.from,
      to: trip.to,
      duration: trip.duration,
      distance: trip.distance,
      time,
      company: companiesList[idx % companiesList.length],
      price: Math.floor(Math.random() * 15000 + 5000),
    }))
  );
};

const CounterBookingWizard = ({ onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [tripOptions] = useState(() => generateTripOptions());
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [seatMap, setSeatMap] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [passenger, setPassenger] = useState({ name: '', phone: '', email: '', notes: '' });
  const [salePoint, setSalePoint] = useState(salePointsList[0]);
  const [saveTimer, setSaveTimer] = useState(null);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.step) setStep(data.step);
        if (data.selectedTrip) setSelectedTrip(data.selectedTrip);
        if (data.selectedBus) setSelectedBus(data.selectedBus);
        if (data.selectedSeats) setSelectedSeats(data.selectedSeats);
        if (data.passenger) setPassenger(data.passenger);
        if (data.salePoint) setSalePoint(data.salePoint);
        if (data.seatMap) setSeatMap(data.seatMap);
      }
    } catch {}
  }, []);

  const autoSave = useCallback((data) => {
    if (saveTimer) clearTimeout(saveTimer);
    const timer = setTimeout(() => {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {}
    }, 500);
    setSaveTimer(timer);
  }, [saveTimer]);

  useEffect(() => {
    autoSave({ step, selectedTrip, selectedBus, selectedSeats, passenger, salePoint, seatMap });
  }, [step, selectedTrip, selectedBus, selectedSeats, passenger, salePoint, seatMap, autoSave]);

  const handleSelectTrip = (trip) => {
    setSelectedTrip(trip);
    setSelectedBus(null);
    setSeatMap([]);
    setSelectedSeats([]);
  };

  const handleSelectBus = (bus) => {
    setSelectedBus(bus);
    setSeatMap(generateSeatMap(bus.capacity));
    setSelectedSeats([]);
  };

  const toggleSeat = (seatId) => {
    setSeatMap((prev) =>
      prev.map((s) => (s.id === seatId ? { ...s, selected: !s.selected } : s))
    );
    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

  const canProceed = () => {
    switch (step) {
      case 1: return !!selectedTrip;
      case 2: return !!selectedBus;
      case 3: return selectedSeats.length > 0;
      case 4: return passenger.name.trim() && passenger.phone.trim();
      case 5: return true;
      default: return false;
    }
  };

  const handleNext = () => {
    if (step < 5 && canProceed()) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = () => {
    const booking = {
      id: `RES-2026-${String(Date.now()).slice(-4)}`,
      clientName: passenger.name,
      phone: passenger.phone,
      email: passenger.email,
      from: selectedTrip.from,
      to: selectedTrip.to,
      companyId: selectedTrip.company.id,
      company: selectedTrip.company,
      busPlate: selectedBus.plate,
      busModel: selectedBus.model,
      seats: selectedSeats,
      amount: selectedTrip.price * selectedSeats.length,
      status: 'pending',
      salePoint,
      notes: passenger.notes,
      createdAt: new Date().toISOString(),
      createdBy: 'Kodjo Jojo',
      history: [
        { action: 'Réservation créée', timestamp: new Date().toISOString(), user: 'Kodjo Jojo', icon: 'bi-plus-circle' },
      ],
      payment: null,
    };
    sessionStorage.removeItem(STORAGE_KEY);
    onComplete?.(booking);
  };

  const renderStepIndicator = () => (
    <div className="acb-wizard-steps">
      {STEPS.map((s, i) => {
        const idx = i + 1;
        const isCompleted = idx < step;
        const isActive = idx === step;
        return (
          <div
            key={s.key}
            className={clsx('acb-wizard-step', {
              completed: isCompleted,
              active: isActive,
            })}
          >
            <div className="acb-wizard-step-number">
              {isCompleted ? <i className="bi bi-check" /> : idx}
            </div>
            <span className="acb-wizard-step-label">{s.label}</span>
          </div>
        );
      })}
    </div>
  );

  const renderTripStep = () => (
    <>
      <h3 className="acb-step-title">Recherche du voyage</h3>
      <p className="acb-step-desc">Sélectionnez le trajet et l'heure de départ.</p>
      <div className="acb-wizard-trip-list">
        {tripOptions.map((trip) => (
          <div
            key={trip.id}
            className={clsx('acb-wizard-trip-item', { selected: selectedTrip?.id === trip.id })}
            onClick={() => handleSelectTrip(trip)}
          >
            <div className="acb-wizard-trip-radio" />
            <div className="acb-wizard-trip-info">
              <div className="acb-wizard-trip-route">{trip.from} → {trip.to}</div>
              <div className="acb-wizard-trip-meta">
                <span><i className="bi bi-clock" /> {trip.time}</span>
                <span><i className="bi bi-building" /> {trip.company.name}</span>
                <span><i className="bi bi-signpost-2" /> {trip.duration}</span>
              </div>
            </div>
            <div className="acb-wizard-trip-price">{formatCurrency(trip.price)}</div>
          </div>
        ))}
      </div>
    </>
  );

  const renderBusStep = () => {
    const availableBuses = busesList;
    return (
      <>
        <h3 className="acb-step-title">Choix du bus</h3>
        <p className="acb-step-desc">Choisissez le bus pour ce voyage {selectedTrip ? `${selectedTrip.from} → ${selectedTrip.to}` : ''}.</p>
        <div className="acb-wizard-trip-list">
          {availableBuses.map((bus) => (
            <div
              key={bus.id}
              className={clsx('acb-wizard-trip-item', { selected: selectedBus?.id === bus.id })}
              onClick={() => handleSelectBus(bus)}
            >
              <div className="acb-wizard-trip-radio" />
              <div className="acb-wizard-trip-info">
                <div className="acb-wizard-trip-route">{bus.plate} — {bus.model}</div>
                <div className="acb-wizard-trip-meta">
                  <span><i className="bi bi-people" /> {bus.capacity} places</span>
                  {selectedTrip && (
                    <span><i className="bi bi-building" /> {selectedTrip.company.name}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  };

  const renderSeatsStep = () => (
    <>
      <h3 className="acb-step-title">Sélection des sièges</h3>
      <p className="acb-step-desc">
        Choisissez les sièges à réserver.
        {selectedSeats.length > 0 && (
          <span style={{ color: '#FF6B35', marginLeft: 8 }}>
            ({selectedSeats.length} sélectionné{selectedSeats.length > 1 ? 's' : ''})
          </span>
        )}
      </p>
      {seatMap.length > 0 && (
        <div className="acb-wizard-seat-grid">
          {seatMap.map((seat) => {
            const col = seatMap.indexOf(seat) % 5;
            return (
              <button
                key={seat.id}
                className={clsx('acb-wizard-seat', {
                  selected: seat.selected,
                })}
                disabled={seat.taken}
                onClick={() => toggleSeat(seat.id)}
                style={col === 2 ? { marginLeft: 16 } : {}}
              >
                {seat.taken ? <i className="bi bi-lock" /> : seat.id}
              </button>
            );
          })}
        </div>
      )}
    </>
  );

  const renderPassengerStep = () => {
    const handleFindClient = (e) => {
      const q = e.target.value.toLowerCase();
      if (q.length < 2) return;
      const found = clientsList.find((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q));
      if (found) setPassenger({ name: found.name, phone: found.phone, email: found.email, notes: passenger.notes });
    };

    return (
      <>
        <h3 className="acb-step-title">Informations du passager</h3>
        <p className="acb-step-desc">
          Recherchez un client existant ou saisissez les informations du nouveau passager.
        </p>
        <div className="acb-form-grid">
          <div className="acb-form-group full">
            <label className="acb-form-label">Recherche rapide client</label>
            <input
              className="acb-form-input"
              placeholder="Nom ou téléphone du client..."
              onBlur={handleFindClient}
            />
          </div>
          <div className="acb-form-group">
            <label className="acb-form-label">Nom complet *</label>
            <input
              className="acb-form-input"
              placeholder="Nom du passager"
              value={passenger.name}
              onChange={(e) => setPassenger({ ...passenger, name: e.target.value })}
            />
          </div>
          <div className="acb-form-group">
            <label className="acb-form-label">Téléphone *</label>
            <input
              className="acb-form-input"
              placeholder="6XXXXXXXX"
              value={passenger.phone}
              onChange={(e) => setPassenger({ ...passenger, phone: e.target.value })}
            />
          </div>
          <div className="acb-form-group">
            <label className="acb-form-label">Email</label>
            <input
              className="acb-form-input"
              placeholder="email@exemple.com"
              value={passenger.email}
              onChange={(e) => setPassenger({ ...passenger, email: e.target.value })}
            />
          </div>
          <div className="acb-form-group">
            <label className="acb-form-label">Point de vente</label>
            <select className="acb-form-select" value={salePoint} onChange={(e) => setSalePoint(e.target.value)}>
              {salePointsList.map((sp) => (
                <option key={sp} value={sp}>{sp}</option>
              ))}
            </select>
          </div>
          <div className="acb-form-group full">
            <label className="acb-form-label">Notes</label>
            <input
              className="acb-form-input"
              placeholder="Notes optionnelles..."
              value={passenger.notes}
              onChange={(e) => setPassenger({ ...passenger, notes: e.target.value })}
            />
          </div>
        </div>
      </>
    );
  };

  const renderValidationStep = () => {
    const total = selectedTrip ? selectedTrip.price * selectedSeats.length : 0;

    return (
      <>
        <h3 className="acb-step-title">Validation de la réservation</h3>
        <p className="acb-step-desc">Vérifiez tous les détails avant de confirmer la réservation.</p>
        <div className="acb-summary-grid">
          <div className="acb-summary-section">
            <div className="acb-summary-section-title">
              <i className="bi bi-geo-alt" /> Voyage
            </div>
            {selectedTrip && (
              <>
                <div className="acb-summary-row">
                  <span className="acb-summary-label">Trajet</span>
                  <span className="acb-summary-value">{selectedTrip.from} → {selectedTrip.to}</span>
                </div>
                <div className="acb-summary-row">
                  <span className="acb-summary-label">Départ</span>
                  <span className="acb-summary-value">{selectedTrip.time}</span>
                </div>
                <div className="acb-summary-row">
                  <span className="acb-summary-label">Durée</span>
                  <span className="acb-summary-value">{selectedTrip.duration}</span>
                </div>
                <div className="acb-summary-row">
                  <span className="acb-summary-label">Compagnie</span>
                  <span className="acb-summary-value">{selectedTrip.company.name}</span>
                </div>
              </>
            )}
          </div>

          <div className="acb-summary-section">
            <div className="acb-summary-section-title">
              <i className="bi bi-bus-front" /> Bus & Sièges
            </div>
            {selectedBus && (
              <>
                <div className="acb-summary-row">
                  <span className="acb-summary-label">Bus</span>
                  <span className="acb-summary-value">{selectedBus.plate} — {selectedBus.model}</span>
                </div>
                <div className="acb-summary-row">
                  <span className="acb-summary-label">Sièges</span>
                  <span className="acb-summary-value">{selectedSeats.join(', ') || '—'}</span>
                </div>
                <div className="acb-summary-row">
                  <span className="acb-summary-label">Places</span>
                  <span className="acb-summary-value">{selectedSeats.length}</span>
                </div>
              </>
            )}
          </div>

          <div className="acb-summary-section">
            <div className="acb-summary-section-title">
              <i className="bi bi-person" /> Passager
            </div>
            <div className="acb-summary-row">
              <span className="acb-summary-label">Nom</span>
              <span className="acb-summary-value">{passenger.name || '—'}</span>
            </div>
            <div className="acb-summary-row">
              <span className="acb-summary-label">Téléphone</span>
              <span className="acb-summary-value">{passenger.phone || '—'}</span>
            </div>
            <div className="acb-summary-row">
              <span className="acb-summary-label">Email</span>
              <span className="acb-summary-value">{passenger.email || '—'}</span>
            </div>
          </div>

          <div className="acb-summary-section">
            <div className="acb-summary-section-title">
              <i className="bi bi-shop" /> Point de vente
            </div>
            <div className="acb-summary-row">
              <span className="acb-summary-label">Guichet</span>
              <span className="acb-summary-value">{salePoint}</span>
            </div>
            <div className="acb-summary-row">
              <span className="acb-summary-label">Agent</span>
              <span className="acb-summary-value">Kodjo Jojo</span>
            </div>
            {passenger.notes && (
              <div className="acb-summary-row">
                <span className="acb-summary-label">Notes</span>
                <span className="acb-summary-value">{passenger.notes}</span>
              </div>
            )}
          </div>

          <div className="acb-summary-section full">
            <div className="acb-summary-row">
              <span className="acb-summary-label">Prix unitaire</span>
              <span className="acb-summary-value">{selectedTrip ? formatCurrency(selectedTrip.price) : '—'}</span>
            </div>
            <div className="acb-summary-row">
              <span className="acb-summary-label">Nombre de places</span>
              <span className="acb-summary-value">{selectedSeats.length}</span>
            </div>
            <div className="acb-summary-total">
              Total: {formatCurrency(total)}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="acb-wizard-overlay" onClick={onClose}>
      <div className="acb-wizard" onClick={(e) => e.stopPropagation()}>
        <div className="acb-wizard-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 className="acb-wizard-title" style={{ margin: 0 }}>
              <i className="bi bi-plus-circle" style={{ marginRight: 8 }} />
              Nouvelle réservation
            </h2>
            <button className="acb-modal-close" onClick={onClose}>
              <i className="bi bi-x-lg" />
            </button>
          </div>
          {renderStepIndicator()}
        </div>

        <div className="acb-wizard-body">
          {step === 1 && renderTripStep()}
          {step === 2 && renderBusStep()}
          {step === 3 && renderSeatsStep()}
          {step === 4 && renderPassengerStep()}
          {step === 5 && renderValidationStep()}
        </div>

        <div className="acb-wizard-footer">
          <div className="acb-wizard-footer-left">
            {step > 1 && (
              <button className="acb-btn acb-btn-outline" onClick={handlePrev}>
                <i className="bi bi-arrow-left" /> Précédent
              </button>
            )}
          </div>
          <div className="acb-wizard-footer-right">
            <button className="acb-btn acb-btn-secondary" onClick={onClose}>
              Annuler
            </button>
            {step < 5 ? (
              <button className="acb-btn acb-btn-primary" onClick={handleNext} disabled={!canProceed()}>
                Suivant <i className="bi bi-arrow-right" />
              </button>
            ) : (
              <button className="acb-btn acb-btn-primary" onClick={handleComplete}>
                <i className="bi bi-check-lg" /> Confirmer la réservation
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounterBookingWizard;
