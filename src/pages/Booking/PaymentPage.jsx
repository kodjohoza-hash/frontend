import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate, useLocation, Link, Navigate } from 'react-router-dom';
import { ROUTES } from '@routes/routeConstants';
import useAuth from '@hooks/useAuth';
import bookingService from '@services/booking.service';
import {
  CkStepper,
  CkMethodGrid,
  CkMobileForm,
  CkCardForm,
  CkCardPreview,
  CkAgencyPanel,
  CkSummary,
  CkPromo,
  CkInsurance,
  CkTerms,
  CkTrustBar,
  CkTimer,
  CkProcessing,
  CkSuccessModal,
  CkErrorModal,
  CkExpiredModal,
  CkSkeleton,
} from '@components/payment';
import { BOOKING_STEPS, PAYMENT_METHODS, MOCK_RESERVATION, INSURANCE } from '@data/payment';
import { buildReservationFromState } from '@utils/booking';
import '@assets/styles/payment.css';

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const bookingState = location.state;
  const { bookingId, reservation: backendReservation } = bookingState || {};
  const isRealBooking = Boolean(bookingId);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [formValid, setFormValid] = useState(false);
  const [formData, setFormData] = useState({});
  const [insurance, setInsurance] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [expired, setExpired] = useState(false);

  const reservation = useMemo(
    () => buildReservationFromState(bookingState || {}, MOCK_RESERVATION),
    [bookingState]
  );

  /* Montant facturé : calculé côté serveur à la création de la réservation.
     Le client ne fournit jamais un montant de confiance. */
  const serverAmount = backendReservation
    ? Number(backendReservation.resteAPayer ?? backendReservation.montant ?? 0)
    : 0;

  const displayReservation = useMemo(
    () => ({ ...reservation, fees: isRealBooking ? 0 : reservation.fees }),
    [reservation, isRealBooking]
  );

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const total = useMemo(() => {
    const subtotal = reservation.seats.reduce((a, s) => a + s.price, 0);
    const ins = insurance ? INSURANCE.price : 0;
    return subtotal + reservation.fees + ins - promoDiscount;
  }, [reservation, insurance, promoDiscount]);

  const payAmount = isRealBooking && serverAmount > 0 ? serverAmount : total;

  const methodData = PAYMENT_METHODS.find((m) => m.id === selectedMethod);
  const canPay = selectedMethod && formValid && acceptedTerms;

  const handleMethodSelect = useCallback((id) => {
    setSelectedMethod(id);
    setFormData({});
    setFormValid(false);
  }, []);

  const handleFormValid = useCallback((valid, data) => {
    setFormValid(valid);
    if (data) setFormData((p) => ({ ...p, ...data }));
  }, []);

  const handlePromo = useCallback((promo) => {
    if (!promo) { setPromoDiscount(0); return; }
    const subtotal = reservation.seats.reduce((a, s) => a + s.price, 0);
    const d = promo.type === 'percent' ? Math.round(subtotal * promo.discount / 100) : promo.discount;
    setPromoDiscount(d);
  }, [reservation]);

  const handlePay = useCallback(async () => {
    if (!canPay) return;
    setProcessing(true);
    setError(null);
    try {
      if (!isRealBooking) {
        setError('Aucune réservation en cours. Veuillez refaire votre réservation.');
        setProcessing(false);
        return;
      }

      /* Paiement à l'agence : la réservation reste en attente (payable sur place). */
      if (methodData?.category === 'agency') {
        const ts = new Date().toISOString();
        setSuccess({
          success: true,
          transactionId: backendReservation?.reference || bookingId,
          amount: payAmount,
          currency: reservation.currency,
          timestamp: ts,
          confirmation: {
            bookingId,
            reservation: backendReservation,
            pendingAgency: true,
          },
        });
        setProcessing(false);
        return;
      }

      const METHOD_MAP = {
        mtn_momo: 'mtn_money',
        orange_money: 'orange_money',
        express_union: 'virement_bancaire',
        visa: 'carte_bancaire',
        mastercard: 'carte_bancaire',
      };

      const updated = await bookingService.payBooking(bookingId, {
        methode: METHOD_MAP[selectedMethod] || 'carte_bancaire',
      });

      const ts = new Date().toISOString();
      setSuccess({
        success: true,
        transactionId: updated?.reference || updated?.id || bookingId,
        amount: Number(updated?.montant || payAmount),
        currency: reservation.currency,
        timestamp: ts,
        confirmation: { bookingId, reservation: updated },
      });
    } catch (err) {
      setError(err.message || 'Le paiement a échoué. Vérifiez vos informations et réessayez.');
    } finally {
      setProcessing(false);
    }
  }, [canPay, isRealBooking, methodData, backendReservation, selectedMethod, payAmount, bookingId, reservation.currency]);

  if (isRealBooking && authLoading && !isAuthenticated) {
    return (
      <div className="ck-page">
        <div className="ck-wrap" style={{ display: 'flex', justifyContent: 'center', padding: '120px 0' }}>
          <i className="bi bi-arrow-repeat" style={{ fontSize: 36, color: 'var(--text-muted)', animation: 'btcSpin 1s linear infinite' }} />
        </div>
      </div>
    );
  }

  if (isRealBooking && !isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location, checkout: location.state }}
      />
    );
  }

  if (loading) {
    return (
      <div className="ck-page">
        <div className="ck-wrap"><CkSkeleton /></div>
      </div>
    );
  }

  if (isRealBooking && !backendReservation) {
    return (
      <div className="ck-page">
        <div className="ck-wrap" style={{ textAlign: 'center', padding: '100px 20px' }}>
          <i className="bi bi-receipt" style={{ fontSize: 44, color: 'var(--text-muted)', marginBottom: 16 }} />
          <h2 style={{ fontSize: 'var(--font-size-lg)', color: 'var(--text-primary)', margin: '0 0 8px' }}>
            Aucune réservation en cours
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

  return (
    <div className="ck-page">
      <div className="ck-wrap">
        <nav aria-label="Fil d'Ariane" className="ck-breadcrumb">
          <ol className="ck-breadcrumb__list">
            <li><Link to={ROUTES.HOME} className="ck-breadcrumb__link">Accueil</Link></li>
            <li className="ck-breadcrumb__sep"><i className="bi bi-chevron-right" /></li>
            <li><Link to={ROUTES.BOOKING_SEARCH} className="ck-breadcrumb__link">Recherche</Link></li>
            <li className="ck-breadcrumb__sep"><i className="bi bi-chevron-right" /></li>
            <li><Link to={ROUTES.BOOKING_SEATS} className="ck-breadcrumb__link">Sièges</Link></li>
            <li className="ck-breadcrumb__sep"><i className="bi bi-chevron-right" /></li>
            <li className="ck-breadcrumb__current">Paiement</li>
          </ol>
        </nav>

        <CkStepper steps={BOOKING_STEPS} currentStep={3} />
        <CkTimer durationMinutes={10} onExpired={() => setExpired(true)} />

        {processing && <CkProcessing />}
        {error && !processing && (
          <CkErrorModal
            message={error}
            onRetry={() => setError(null)}
            onBack={() => { setError(null); navigate(ROUTES.BOOKING_SEATS); }}
          />
        )}
        {success && <CkSuccessModal transaction={success} />}
        {expired && <CkExpiredModal />}

        {!processing && !error && !success && !expired && (
          <div className="ck-split">
            <div className="ck-left">
              <div className="ck-card">
                <div className="ck-card__head">
                  <h2 className="ck-card__title">Choisissez votre mode de paiement</h2>
                  <p className="ck-card__subtitle">Votre transaction est sécurisée</p>
                </div>
                <div className="ck-card__body" style={{ paddingTop: 20 }}>
                  <CkMethodGrid methods={PAYMENT_METHODS} selectedMethod={selectedMethod} onSelect={handleMethodSelect} />
                </div>
              </div>

              {selectedMethod && methodData?.category === 'mobile_money' && (
                <CkMobileForm onValid={handleFormValid} />
              )}

              {selectedMethod && methodData?.category === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <CkCardPreview
                    cardData={formData}
                    brand={formData.cardBrand || (selectedMethod === 'visa' ? 'visa' : selectedMethod === 'mastercard' ? 'mastercard' : null)}
                  />
                  <CkCardForm onValid={handleFormValid} />
                </div>
              )}

              {selectedMethod && methodData?.category === 'agency' && (
                <CkAgencyPanel
                  onConfirm={() => setFormValid(true)}
                  confirmed={formValid}
                />
              )}

              {!isRealBooking && (
                <>
                  <CkPromo onApply={handlePromo} />
                  <CkInsurance insurance={INSURANCE} isSelected={insurance} onToggle={setInsurance} />
                </>
              )}
              <CkTerms reservation={reservation} isAccepted={acceptedTerms} onAccept={setAcceptedTerms} />
              <CkTrustBar />

              <div className="ck-actions">
                <button type="button" className="ck-btn-back" onClick={() => navigate(isRealBooking ? ROUTES.BOOKING_SEATS : ROUTES.BOOKING_SEATS)}>
                  <i className="bi bi-arrow-left" />
                  Retour aux sièges
                </button>
                <button
                  type="button"
                  className="ck-btn-pay"
                  onClick={handlePay}
                  disabled={!canPay || processing}
                >
                  <i className="bi bi-shield-lock-fill" />
                  {processing ? 'Paiement en cours…' : `Payer ${payAmount.toLocaleString()} XAF`}
                </button>
              </div>
            </div>

            <div className="ck-right">
              <CkSummary
                reservation={displayReservation}
                promoDiscount={promoDiscount}
                insurance={insurance}
                total={payAmount}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
