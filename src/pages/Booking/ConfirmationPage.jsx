import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  CnStepper,
  CnSuccessCard,
  CnETicket,
  CnTripSummary,
  CnPassengerList,
  CnPaymentInfo,
  CnAdvice,
  CnSupport,
  CnActions,
  CnSkeleton,
} from '@components/confirmation';
import { CONFIRMATION_STEPS, TRAVEL_ADVICE, SUPPORT_CONTACTS } from '@data/bookingConfirmation';
import bookingService from '@services/booking.service';
import '@assets/styles/confirmation.css';

const BOOKING_STORAGE_KEY = 'btc-last-booking';

const METHOD_LABEL = {
  mtn_money: 'MTN Mobile Money',
  orange_money: 'Orange Money',
  carte_bancaire: 'Carte bancaire',
  especes: 'Espèces (à l\'agence)',
  virement_bancaire: 'Virement bancaire',
  bon_reduction: 'Bon de réduction',
  code_promo: 'Code promo',
};

const toCode = (city) => (city ? city.slice(0, 3).toUpperCase() : '—');
const initialsOf = (name) => (name || 'BTC').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || 'CO';

const formatDuration = (dep, arr) => {
  if (!dep || !arr) return '—';
  const toMin = (t) => {
    const [h, m] = String(t).split(':');
    return (Number(h) || 0) * 60 + (Number(m) || 0);
  };
  let diff = toMin(arr) - toMin(dep);
  if (diff < 0) diff += 24 * 60;
  return `${Math.floor(diff / 60)}h ${String(diff % 60).padStart(2, '0')}min`;
};

const formatFrDate = (date) => {
  if (!date) return '';
  const d = new Date(`${date}T00:00:00`);
  if (Number.isNaN(d.getTime())) return String(date);
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
};

/** Construit les objets d'affichage à partir de la réservation backend. */
const buildFromBooking = (booking) => {
  const d = booking.depart || {};
  const trajet = d.trajet || {};
  const comp = d.compagnie || {};
  const from = trajet.departureCity || '—';
  const to = trajet.arrivalCity || '—';

  const trip = {
    company: {
      name: comp.nom || 'Compagnie',
      initial: initialsOf(comp.nom),
      color: comp.couleur || '#0B1D51',
      rating: 4.5,
      verified: true,
    },
    bus: {
      type: (d.bus?.typeBus || 'standard').toUpperCase(),
      number: d.bus?.immatriculation || '—',
      photo: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=250&fit=crop&q=80',
    },
    tripNumber: d.code || booking.reference,
    route: { from, fromCode: toCode(from), to, toCode: toCode(to) },
    schedule: {
      date: d.dateDepart || '',
      dateFormatted: formatFrDate(d.dateDepart),
      departure: d.heureDepart || '--:--',
      arrival: d.heureArrivee || '--:--',
      duration: formatDuration(d.heureDepart, d.heureArrivee),
      distance: '—',
    },
    boarding: d.quai || '—',
    arrivalPoint: '—',
    baggage: '2 bagages (23 kg + 7 kg)',
  };

  const priceBySeat = new Map((booking.places || []).map((p) => [String(p.siege).toUpperCase(), Number(p.price) || 0]));
  const passengers = (booking.passengers || []).map((p) => ({
    id: p.id || `pax_${p.placeReserveeId || Math.random()}`,
    firstName: p.firstName || '',
    lastName: p.lastName || '',
    phone: p.phone || '',
    email: p.email || '',
    seat: {
      number: p.siege || '—',
      type: 'Standard',
      price: priceBySeat.get(String(p.siege || '').toUpperCase()) || 0,
    },
  }));

  const paidPayments = (booking.paiements || []).filter((p) => p.statut === 'paye');
  const last = paidPayments[paidPayments.length - 1];
  const isPaid = booking.statut === 'payee' || paidPayments.length > 0;

  const payment = {
    method: last ? METHOD_LABEL[last.methode] || last.methode : (isPaid ? 'En ligne' : 'Paiement à l\'agence'),
    methodIcon: 'bi-phone-fill',
    amount: Number(booking.montant) || 0,
    fees: 0,
    insurance: 0,
    subtotal: Number(booking.montant) || 0,
    discount: 0,
    paidAt: last?.datePaiement || booking.dateCreation || new Date().toISOString(),
    status: isPaid ? 'paid' : 'pending',
    transactionId: last?.reference || booking.reference,
  };

  const bookingInfo = {
    id: booking.id,
    reference: booking.reference,
    createdAt: booking.dateCreation || new Date().toISOString(),
    status: booking.statut,
    currency: 'XAF',
  };

  return { trip, passengers, payment, booking: bookingInfo };
};

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const state = useMemo(() => location.state || {}, [location.state]);
  const bookingId = searchParams.get('id') || state.bookingId || sessionStorage.getItem(BOOKING_STORAGE_KEY) || null;
  const isReal = Boolean(bookingId);

  const [loading, setLoading] = useState(isReal);
  const [error, setError] = useState(null);
  const [realData, setRealData] = useState(null);
  const [qrUrl, setQrUrl] = useState(null);
  const [retryKey, setRetryKey] = useState(0);

  /* Persiste l'id pour survivre au rafraîchissement de la page. */
  useEffect(() => {
    if (bookingId) sessionStorage.setItem(BOOKING_STORAGE_KEY, bookingId);
  }, [bookingId]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (!isReal) return undefined;
    let active = true;
    let objUrl = null;
    (async () => {
      try {
        const booking = await bookingService.getBooking(bookingId);
        if (!active) return;
        let qr = null;
        try {
          const res = await bookingService.listTickets({ reservationId: bookingId });
          const tkts = Array.isArray(res) ? res : res?.items || [];
          if (tkts.length) {
            const blob = await bookingService.getTicketQr(tkts[0].id);
            objUrl = URL.createObjectURL(blob);
            qr = objUrl;
          }
        } catch {
          /* Billets / QR optionnels : la confirmation reste consultable. */
        }
        if (active) {
          setRealData(buildFromBooking(booking));
          setQrUrl(qr);
        }
      } catch (err) {
        if (active) setError(err.message || 'Impossible de charger votre réservation.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
      if (objUrl) URL.revokeObjectURL(objUrl);
    };
  }, [isReal, bookingId, retryKey]);

  if (!isReal) {
    return (
      <div className="cn-page">
        <div className="cn-wrap" style={{ textAlign: 'center', padding: '100px 20px' }}>
          <i className="bi bi-receipt" style={{ fontSize: 44, color: 'var(--text-muted)', marginBottom: 16 }} />
          <h2 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--text-primary)', margin: '0 0 8px' }}>
            Aucune réservation à afficher
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', margin: '0 0 24px' }}>
            Retrouvez vos réservations depuis votre espace client, ou effectuez une nouvelle recherche.
          </p>
          <button
            type="button"
            onClick={() => navigate('/')}
            style={{
              padding: '12px 28px',
              borderRadius: 10,
              border: 'none',
              background: 'var(--color-primary, #0B1D51)',
              color: '#fff',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Rechercher un voyage
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="cn-page">
        <div className="cn-wrap"><CnSkeleton /></div>
      </div>
    );
  }

  if (isReal && error) {
    return (
      <div className="cn-page">
        <div className="cn-wrap" style={{ textAlign: 'center', padding: '100px 20px' }}>
          <i className="bi bi-exclamation-triangle" style={{ fontSize: 44, color: '#DC2626', marginBottom: 16 }} />
          <h2 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--text-primary)', margin: '0 0 8px' }}>
            Réservation introuvable
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)', margin: '0 0 24px' }}>
            {error}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                padding: '12px 28px',
                borderRadius: 10,
                border: '1px solid var(--color-gray-300, #CBD5E1)',
                background: '#fff',
                color: 'var(--text-primary)',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Accueil
            </button>
            <button
              type="button"
              onClick={() => { setLoading(true); setError(null); setRetryKey((k) => k + 1); }}
              style={{
                padding: '12px 28px',
                borderRadius: 10,
                border: 'none',
                background: 'var(--color-primary, #0B1D51)',
                color: '#fff',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  const trip = realData?.trip || null;
  const booking = realData?.booking || null;
  const paxList = realData?.passengers || [];
  const payment = realData?.payment || null;

  return (
    <div className="cn-page">
      <div className="cn-wrap">
        <CnStepper steps={CONFIRMATION_STEPS} />
        <CnSuccessCard booking={booking} />

        <div className="cn-split">
          <div className="cn-left">
            <CnETicket
              booking={booking}
              trip={trip}
              passengers={paxList}
              payment={payment}
              qrUrl={qrUrl}
            />
            <CnActions bookingId={booking.id} />
          </div>

          <div className="cn-right">
            <CnTripSummary trip={trip} />
            <CnPassengerList passengers={paxList} />
            <CnPaymentInfo payment={payment} />
            <CnAdvice items={TRAVEL_ADVICE} />
            <CnSupport contacts={SUPPORT_CONTACTS} />
          </div>
        </div>

        <div className="cn-print-only" style={{ textAlign: 'center', paddingTop: 24, fontSize: '0.65rem', color: '#94a3b8' }}>
          <div>BUS TIX CONNECT — www.bustixconnect.com</div>
          <div>Ce billet a été généré électroniquement. Valide sans signature.</div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationPage;
