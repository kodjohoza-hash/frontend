import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '@routes/routeConstants';
import {
  PayStepper,
  PayMethodGrid,
  PayForm,
  PayCardPreview,
  PaySummary,
  PayPromo,
  PayInsurance,
  PayTerms,
  PayTrust,
  PayCountdown,
  PayProcessing,
  PaySuccessModal,
  PayErrorModal,
  PayExpiredModal,
  PaySkeleton,
} from '@components/payment';
import { PAYMENT_METHODS, mockReservation, STEPS, INSURANCE_OPTION } from '@data/payment';
import PaymentService from '@services/paymentService';
import '@assets/styles/payment.css';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [formData, setFormData] = useState({});
  const [formValid, setFormValid] = useState(false);
  const [insurance, setInsurance] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoCode, setPromoCode] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [timerExpired, setTimerExpired] = useState(false);

  const reservation = mockReservation;

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const total = useMemo(() => {
    const subtotal = reservation.pricePerSeat * reservation.seats.length;
    const insurancePrice = insurance ? INSURANCE_OPTION.price : 0;
    const fees = 500;
    return subtotal + insurancePrice + fees - promoDiscount;
  }, [reservation, insurance, promoDiscount]);

  const selectedMethodData = PAYMENT_METHODS.find((m) => m.id === selectedMethod);
  const canPay = selectedMethod && formValid && acceptedTerms;

  const handleMethodSelect = useCallback((methodId) => {
    setSelectedMethod(methodId);
    setFormData({});
    setFormValid(false);
  }, []);

  const handleFormValid = useCallback((valid, data) => {
    setFormValid(valid);
    if (data) setFormData((p) => ({ ...p, ...data }));
  }, []);

  const handlePromoApply = useCallback((promo) => {
    if (!promo) { setPromoDiscount(0); setPromoCode(null); return; }
    const subtotal = reservation.pricePerSeat * reservation.seats.length;
    const discount = promo.type === 'percent' ? Math.round(subtotal * promo.discount / 100) : promo.discount;
    setPromoDiscount(discount);
    setPromoCode(promo);
  }, [reservation]);

  const handlePay = useCallback(async () => {
    if (!canPay) return;
    setIsProcessing(true);
    setError(null);
    try {
      const result = await PaymentService.processPayment({
        method: selectedMethod, amount: total, ...formData, currency: reservation.currency,
      });
      if (result.success) setSuccess(result);
      else setError(result.error);
    } catch {
      setError('Une erreur inattendue est survenue. Vérifiez votre connexion.');
    } finally {
      setIsProcessing(false);
    }
  }, [canPay, selectedMethod, total, formData, reservation.currency]);

  const handleTimerExpired = useCallback(() => setTimerExpired(true), []);

  if (isLoading) {
    return (
      <div className="pay-page">
        <div className="pay-container"><PaySkeleton /></div>
      </div>
    );
  }

  return (
    <div className="pay-page">
      <div className="pay-container">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="pay-breadcrumb">
          <ol style={{ listStyle: 'none', display: 'flex', alignItems: 'center', gap: 8, margin: 0, padding: 0, flexWrap: 'wrap' }}>
            <li><Link to={ROUTES.HOME} className="pay-bc-link">Accueil</Link></li>
            <li className="pay-bc-sep"><i className="bi bi-chevron-right" /></li>
            <li><Link to={ROUTES.BOOKING_SEARCH} className="pay-bc-link">Recherche</Link></li>
            <li className="pay-bc-sep"><i className="bi bi-chevron-right" /></li>
            <li><Link to={ROUTES.BOOKING_SEATS} className="pay-bc-link">Sièges</Link></li>
            <li className="pay-bc-sep"><i className="bi bi-chevron-right" /></li>
            <li className="pay-bc-current">Paiement</li>
          </ol>
        </nav>

        {/* Countdown */}
        <PayCountdown durationMinutes={10} onExpired={handleTimerExpired} />

        {/* Stepper */}
        <PayStepper steps={STEPS} currentStep={4} />

        {/* Processing */}
        {isProcessing && <PayProcessing />}

        {/* Modals */}
        {error && !isProcessing && (
          <PayErrorModal
            message={error}
            onRetry={() => setError(null)}
            onBack={() => { setError(null); navigate(ROUTES.BOOKING_SEATS); }}
          />
        )}
        {success && <PaySuccessModal transaction={success} />}
        {timerExpired && <PayExpiredModal />}

        {/* Main Split Layout */}
        {!isProcessing && !error && !success && !timerExpired && (
          <div className="pay-split">
            {/* LEFT — Dark Payment Panel */}
            <div className="pay-left">
              {/* Payment Methods */}
              <section>
                <h2 className="pay-section-title">Moyen de paiement</h2>
                <p className="pay-section-subtitle">Sélectionnez comment vous souhaitez payer</p>
                <div style={{ marginTop: 16 }}>
                  <PayMethodGrid
                    methods={PAYMENT_METHODS}
                    selectedMethod={selectedMethod}
                    onSelect={handleMethodSelect}
                  />
                </div>
              </section>

              {/* Dynamic Form */}
              {selectedMethod && selectedMethodData?.category !== 'agency' && (
                <section style={{ animation: 'paySlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) both' }}>
                  <h2 className="pay-section-title" style={{ fontSize: '0.95rem' }}>
                    {selectedMethodData?.category === 'mobile_money' ? 'Informations Mobile Money' : 'Informations de la carte'}
                  </h2>
                  <PayForm method={selectedMethod} onValid={handleFormValid} />
                </section>
              )}

              {/* Agency Info */}
              {selectedMethod && selectedMethodData?.category === 'agency' && (
                <section style={{ animation: 'paySlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) both' }}>
                  <div className="pay-form" style={{ padding: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: 'rgba(96, 165, 250, 0.15)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center', color: '#60A5FA', fontSize: '1.1rem'
                      }}>
                        <i className="bi bi-building" />
                      </div>
                      <div>
                        <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>Paiement à l'agence</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>Payez en espèces au comptoir</div>
                      </div>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: 16 }}>
                      Rendez-vous à l'agence Grand Littoral avec votre numéro de réservation pour effectuer le paiement en espèces.
                    </p>
                    {[
                      "Présentez-vous au comptoir avec votre pièce d'identité.",
                      "Communiquez votre numéro de réservation à l'agent.",
                      "Effectuez le paiement et conservez votre reçu.",
                    ].map((text, i) => (
                      <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: '50%', background: 'rgba(255,255,255,0.08)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, marginTop: 1
                        }}>{i + 1}</div>
                        <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', lineHeight: 1.5 }}>{text}</span>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setFormValid(true)}
                      style={{
                        width: '100%', padding: '12px', marginTop: 8, borderRadius: 10,
                        background: formValid ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.06)',
                        border: `1.5px solid ${formValid ? '#10b981' : 'rgba(255,255,255,0.1)'}`,
                        color: formValid ? '#10b981' : 'rgba(255,255,255,0.5)',
                        fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {formValid ? '✓ Réservation confirmée' : 'Confirmer la réservation'}
                    </button>
                  </div>
                </section>
              )}

              {/* Promo */}
              <PayPromo onApply={handlePromoApply} />

              {/* Insurance */}
              <PayInsurance insurance={INSURANCE_OPTION} isSelected={insurance} onToggle={setInsurance} />

              {/* Terms */}
              <PayTerms reservation={reservation} onAccept={setAcceptedTerms} isAccepted={acceptedTerms} />

              {/* Trust */}
              <PayTrust />

              {/* Actions */}
              <div className="pay-actions">
                <button type="button" className="pay-btn-back" onClick={() => navigate(ROUTES.BOOKING_SEATS)}>
                  <i className="bi bi-arrow-left" />
                  Retour
                </button>
                <button
                  type="button"
                  className="pay-btn-pay"
                  onClick={handlePay}
                  disabled={!canPay}
                  style={{ opacity: canPay ? 1 : 0.4, cursor: canPay ? 'pointer' : 'not-allowed' }}
                >
                  <i className="bi bi-lock-fill" />
                  Payer {total.toLocaleString()} FCFA
                </button>
              </div>
            </div>

            {/* RIGHT — Light Summary Panel */}
            <div className="pay-right">
              <PaySummary
                reservation={reservation}
                selectedSeats={reservation.seats}
                promoDiscount={promoDiscount}
                insurance={insurance}
                total={total}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
