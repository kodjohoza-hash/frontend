import { useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import CounterTripSearch from './CounterTripSearch';
import CounterSeatMap from './CounterSeatMap';
import CounterPassengerForm from './CounterPassengerForm';
import CounterPaymentForm from './CounterPaymentForm';
import CounterSaleSummary from './CounterSaleSummary';
import CounterTicketPreview from './CounterTicketPreview';
import CounterSaleSuccess from './CounterSaleSuccess';
import { mockTrips, generateSeatMap } from '@data/counterSaleData';

const STORAGE_KEY = 'btc_counter_sale';
const STEPS = [
  { id: 1, label: 'Recherche' },
  { id: 2, label: 'Sièges' },
  { id: 3, label: 'Passager' },
  { id: 4, label: 'Paiement' },
  { id: 5, label: 'Confirmation' },
  { id: 6, label: 'Billet' },
];

const initialState = {
  step: 1,
  search: { from: '', to: '', date: '', time: '', company: '', passengers: 1, busClass: 'standard' },
  searchResults: [],
  selectedTrip: null,
  seatMap: [],
  selectedSeats: [],
  passenger: { isExisting: false, existingClient: null, firstName: '', lastName: '', phone: '', email: '', idType: 'none', idNumber: '', notes: '' },
  payment: { method: '', amount: 0, discount: 0, taxes: 0, total: 0, cashGiven: 0, change: 0 },
  ticket: null,
  saleComplete: false,
};

const loadDraft = () => {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
};

const CounterSaleWizard = () => {
  const [state, setState] = useState(() => loadDraft() || initialState);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch { /* ignore */ }
  }, [state]);

  const update = useCallback((partial) => {
    setState((prev) => ({ ...prev, ...partial }));
  }, []);

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const goToStep = useCallback((step) => {
    update({ step });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [update]);

  const handleSearch = useCallback((searchData) => {
    const { from, to } = searchData;
    if (from && to) {
      const results = mockTrips.filter((t) =>
        t.from.toLowerCase().includes(from.toLowerCase()) &&
        t.to.toLowerCase().includes(to.toLowerCase())
      );
      update({ search: searchData, searchResults: results, step: 1 });
    }
  }, [update]);

  const handleSelectTrip = useCallback((trip) => {
    const reserved = [];
    const seatMap = generateSeatMap(trip.seats.total, reserved, []);
    update({ selectedTrip: trip, seatMap, selectedSeats: [], step: 2 });
  }, [update]);

  const handleSelectSeats = useCallback((seats) => {
    update({ selectedSeats: seats, step: 3 });
  }, [update]);

  const handlePassengerComplete = useCallback((passenger) => {
    update({ passenger, step: 4 });
  }, [update]);

  const handlePaymentComplete = useCallback((payment) => {
    const { selectedTrip, selectedSeats, search } = state;
    const basePrice = selectedTrip.basePrice * search.passengers;
    const discount = 0;
    const subtotal = basePrice - discount;
    const taxes = Math.round(subtotal * 0.05);
    const serviceFee = 500;
    const total = subtotal + taxes + serviceFee;
    update({ payment: { ...payment, amount: basePrice, discount, taxes, total }, step: 5 });
  }, [update, state.selectedTrip, state.selectedSeats, state.search]);

  const handleConfirm = useCallback(() => {
    const { selectedTrip, selectedSeats, passenger, search, payment } = state;
    const ref = `BT-${String(Date.now()).slice(-8)}`;
    const ticket = {
      ref,
      passenger: passenger.isExisting && passenger.existingClient
        ? passenger.existingClient
        : { firstName: passenger.firstName, lastName: passenger.lastName, phone: passenger.phone, email: passenger.email },
      trip: selectedTrip,
      seats: selectedSeats,
      passengers: search.passengers,
      payment: { ...payment, total: payment.total },
      date: new Date().toISOString(),
    };
    update({ ticket, step: 6, saleComplete: true });
    showToast(`Vente ${ref} confirmée avec succès !`);
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }, [state, showToast, update]);

  const handleNewSale = useCallback(() => {
    setState(initialState);
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const progressPct = ((state.step - 1) / (STEPS.length - 1)) * 100;

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return <CounterTripSearch search={state.search} results={state.searchResults} selectedTrip={state.selectedTrip} onSearch={handleSearch} onSelect={handleSelectTrip} />;
      case 2:
        return <CounterSeatMap trip={state.selectedTrip} seatMap={state.seatMap} selectedSeats={state.selectedSeats} onSelect={handleSelectSeats} onBack={() => goToStep(1)} />;
      case 3:
        return <CounterPassengerForm passenger={state.passenger} onComplete={handlePassengerComplete} onBack={() => goToStep(2)} />;
      case 4:
        return <CounterPaymentForm trip={state.selectedTrip} search={state.search} onComplete={handlePaymentComplete} onBack={() => goToStep(3)} />;
      case 5:
        return <CounterSaleSummary state={state} onConfirm={handleConfirm} onBack={() => goToStep(4)} />;
      case 6:
        return (
          <div>
            <CounterSaleSuccess ticket={state.ticket} onNewSale={handleNewSale} />
            {state.ticket && <CounterTicketPreview ticket={state.ticket} />}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="acs-wizard">
      <div className="acs-progress">
        <div className="acs-progress__bar" style={{ width: `${progressPct}%` }} />
        {STEPS.map((s) => (
          <div key={s.id} className={clsx('acs-progress__step', state.step === s.id && 'acs-progress__step--active', state.step > s.id && 'acs-progress__step--completed')}>
            <div className="acs-progress__circle">
              {state.step > s.id ? <i className="bi bi-check" /> : s.id}
            </div>
            <span className="acs-progress__label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="acs-step">
        {renderStep()}
      </div>

      {toast && (
        <div className={clsx('acs-toast', `acs-toast--${toast.type}`)}>
          <i className={clsx('acs-toast__icon', 'bi', toast.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-circle-fill')} />
          <span className="acs-toast__msg">{toast.msg}</span>
        </div>
      )}
    </div>
  );
};

export default CounterSaleWizard;
