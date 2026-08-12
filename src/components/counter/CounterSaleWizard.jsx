import { useState, useCallback, useEffect } from 'react';
import clsx from 'clsx';
import CounterTripSearch from './CounterTripSearch';
import CounterSeatMap from './CounterSeatMap';
import CounterPassengerForm from './CounterPassengerForm';
import CounterPaymentForm from './CounterPaymentForm';
import CounterSaleSummary from './CounterSaleSummary';
import CounterTicketPreview from './CounterTicketPreview';
import CounterSaleSuccess from './CounterSaleSuccess';
import {
  getAgentContext,
  searchAgentTrips,
  buildSeatMap,
  createCounterBooking,
  payCounterBooking,
  getTicketsForReservation,
  downloadTicketPdf,
  PAYMENT_METHOD_MAP,
} from '@services/counter.sale.service';
import bookingService from '@services/booking.service';

const STORAGE_KEY = 'btc_counter_sale_v2';
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
  search: { from: '', to: '', date: '', passengers: 1, busClass: 'standard' },
  searchResults: [],
  selectedTrip: null,
  seatMap: [],
  selectedSeats: [],
  passenger: { isExisting: false, clientId: null, existingClient: null, firstName: '', lastName: '', phone: '', email: '', typePiece: 'aucune', numeroPiece: '' },
  payment: { method: '', amount: 0, taxes: 0, total: 0, cashGiven: 0, change: 0 },
  booking: null,
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
  const [agent, setAgent] = useState({ agenceId: null, guichetId: null });
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [seatLoading, setSeatLoading] = useState(false);
  const [seatError, setSeatError] = useState('');
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch { /* ignore */ }
  }, [state]);

  useEffect(() => {
    let active = true;
    getAgentContext().then((ctx) => {
      if (active) setAgent(ctx);
    });
    return () => { active = false; };
  }, []);

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

  const handleSearch = useCallback(async (searchData) => {
    if (!searchData.from || !searchData.to) return;
    setSearching(true);
    setSearchError('');
    try {
      const { items } = await searchAgentTrips({
        from: searchData.from,
        to: searchData.to,
        date: searchData.date || undefined,
        agenceId: agent.agenceId,
      });
      update({ search: searchData, searchResults: items, step: 1 });
    } catch (err) {
      setSearchError(err.message || 'La recherche de voyages a échoué.');
      update({ search: searchData, searchResults: [] });
    } finally {
      setSearching(false);
    }
  }, [agent.agenceId, update]);

  const handleSelectTrip = useCallback(async (trip) => {
    setSeatLoading(true);
    setSeatError('');
    update({ selectedTrip: trip, selectedSeats: [], step: 2 });
    try {
      const availability = await bookingService.getAvailability(trip.id);
      const seatMap = buildSeatMap(availability);
      if (seatMap.length === 0) {
        throw new Error('Ce voyage ne présente aucun siège à la vente.');
      }
      update({ seatMap, selectedSeats: [] });
    } catch (err) {
      setSeatError(err.message || 'Impossible de charger le plan du bus.');
    } finally {
      setSeatLoading(false);
    }
  }, [update]);

  const handleSelectSeats = useCallback((seats) => {
    update({ selectedSeats: seats, step: 3 });
  }, [update]);

  const handlePassengerComplete = useCallback((passenger) => {
    update({ passenger, step: 4 });
  }, [update]);

  const handlePaymentComplete = useCallback((payment) => {
    const { selectedTrip, selectedSeats } = state;
    const nbSeats = Math.max(1, selectedSeats.length);
    const basePrice = selectedTrip.basePrice * nbSeats;
    const taxes = Math.round(basePrice * 0.05);
    const total = basePrice + taxes;
    update({ payment: { ...payment, amount: basePrice, taxes, total }, step: 5 });
  }, [state, update]);

  const handleConfirm = useCallback(async () => {
    const { selectedTrip, selectedSeats, passenger, payment } = state;
    const clientId = passenger.clientId || passenger.existingClient?.id;
    if (!selectedTrip) { showToast('Voyage manquant.', 'error'); return; }
    if (!clientId) { showToast('Sélectionnez ou créez un client.', 'error'); goToStep(3); return; }
    if (selectedSeats.length === 0) { showToast('Sélectionnez au moins un siège.', 'error'); goToStep(2); return; }
    if (!payment.method) { showToast('Choisissez un mode de paiement.', 'error'); goToStep(4); return; }

    const client = passenger.existingClient || passenger;
    const siegeNumbers = selectedSeats.map((s) => String(s));
    const seats = siegeNumbers.map((siege) => ({ siege, tarif: selectedTrip.basePrice }));
    const passengers = siegeNumbers.map(() => ({
      firstName: client.firstName || passenger.firstName,
      lastName: client.lastName || passenger.lastName,
      phone: client.phone || passenger.phone,
      email: client.email || passenger.email || null,
      gender: null,
      birthDate: null,
      documentType: client.typePiece && client.typePiece !== 'aucune' ? client.typePiece : null,
      documentNumber: client.numeroPiece || null,
      nationality: null,
      emergencyContact: null,
    }));

    const methode = PAYMENT_METHOD_MAP[payment.method] || payment.method;
    const taxes = Math.round(selectedTrip.basePrice * siegeNumbers.length * 0.05);

    setConfirming(true);
    try {
      const booking = await createCounterBooking({
        departId: selectedTrip.id,
        clientId,
        guichetId: agent.guichetId || null,
        seats,
        passengers,
        modeReservation: 'guichet',
        modePaiement: methode,
        taxes,
        statut: 'en_attente',
      });

      await payCounterBooking(booking.id, methode);

      const billet = await getTicketsForReservation(booking.id);

      const ticket = {
        id: billet?.id || null,
        ref: billet?.reference || booking.reference,
        passenger: {
          firstName: client.firstName || passenger.firstName,
          lastName: client.lastName || passenger.lastName,
          phone: client.phone || passenger.phone,
          email: client.email || passenger.email || '',
        },
        trip: {
          company: selectedTrip.company,
          bus: selectedTrip.bus,
          from: selectedTrip.from,
          to: selectedTrip.to,
          departure: selectedTrip.departure,
          arrival: selectedTrip.arrival,
          duration: selectedTrip.duration,
        },
        seats: siegeNumbers,
        payment: { ...payment, total: payment.total },
        date: new Date().toISOString(),
        reservationId: booking.id,
      };

      update({ booking, ticket, step: 6, saleComplete: true });
      showToast(`Vente ${ticket.ref} confirmée — billet émis !`);
      try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    } catch (err) {
      showToast(err.message || 'La vente a échoué. Veuillez réessayer.', 'error');
    } finally {
      setConfirming(false);
    }
  }, [state, agent.guichetId, update, showToast, goToStep]);

  const handleNewSale = useCallback(() => {
    setState(initialState);
    try { sessionStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const progressPct = ((state.step - 1) / (STEPS.length - 1)) * 100;

  const renderStep = () => {
    switch (state.step) {
      case 1:
        return <CounterTripSearch search={state.search} results={state.searchResults} selectedTrip={state.selectedTrip} onSearch={handleSearch} onSelect={handleSelectTrip} loading={searching} error={searchError} />;
      case 2:
        return (
          <CounterSeatMap
            trip={state.selectedTrip}
            seatMap={state.seatMap}
            selectedSeats={state.selectedSeats}
            maxSeats={state.search.passengers}
            loading={seatLoading}
            error={seatError}
            onSelect={handleSelectSeats}
            onBack={() => goToStep(1)}
          />
        );
      case 3:
        return <CounterPassengerForm passenger={state.passenger} onComplete={handlePassengerComplete} onBack={() => goToStep(2)} />;
      case 4:
        return <CounterPaymentForm trip={state.selectedTrip} seatsCount={state.selectedSeats.length} onComplete={handlePaymentComplete} onBack={() => goToStep(3)} />;
      case 5:
        return <CounterSaleSummary state={state} onConfirm={handleConfirm} onBack={() => goToStep(4)} confirming={confirming} />;
      case 6:
        return (
          <div>
            <CounterSaleSuccess ticket={state.ticket} onNewSale={handleNewSale} onDownloadPdf={downloadTicketPdf} />
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
