import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '@routes/routeConstants';
import {
  PaymentStepper,
  PaymentMethodCard,
  MobileMoneyForm,
  CreditCardForm,
  PaymentSummary,
  PromoCodeCard,
  InsuranceCard,
  TermsCard,
  SecurityBadges,
  PaymentCountdown,
  PaymentLoader,
  PaymentSuccessModal,
  PaymentErrorModal,
  TimerExpiredModal,
  PaymentSkeleton,
  AgencyInfo,
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
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const total = useMemo(() => {
    const subtotal = reservation.pricePerSeat * reservation.seats.length;
    const insurancePrice = insurance ? INSURANCE_OPTION.price : 0;
    const fees = 500;
    const discount = promoDiscount;
    return subtotal + insurancePrice + fees - discount;
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
    if (!promo) {
      setPromoDiscount(0);
      setPromoCode(null);
      return;
    }
    const subtotal = reservation.pricePerSeat * reservation.seats.length;
    const discount = promo.type === 'percent'
      ? Math.round(subtotal * promo.discount / 100)
      : promo.discount;
    setPromoDiscount(discount);
    setPromoCode(promo);
  }, [reservation]);

  const handlePay = useCallback(async () => {
    if (!canPay) return;
    setIsProcessing(true);
    setError(null);
    try {
      const result = await PaymentService.processPayment({
        method: selectedMethod,
        amount: total,
        ...formData,
        currency: reservation.currency,
      });
      if (result.success) {
        setSuccess(result);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Une erreur inattendue est survenue. Vérifiez votre connexion.');
    } finally {
      setIsProcessing(false);
    }
  }, [canPay, selectedMethod, total, formData, reservation.currency]);

  const handleTimerExpired = useCallback(() => {
    setTimerExpired(true);
  }, []);

  const handleBackToSearch = useCallback(() => {
    navigate(ROUTES.BOOKING_SEARCH);
  }, [navigate]);

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(165deg, var(--color-primary-50, #EEF2FF) 0%, var(--color-gray-50, #F9FAFB) 40%, #FFFFFF 100%)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 24px 64px' }}>
          <PaymentSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="btc-pay-page">
      <div className="btc-pay-container">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" style={{ marginBottom: 20, animation: 'btcPayFadeInUp 0.3s ease both' }}>
          <ol style={{ listStyle: 'none', display: 'flex', alignItems: 'center', gap: 6, margin: 0, padding: 0, fontSize: 'var(--font-size-xs, 0.8125rem)', flexWrap: 'wrap' }}>
            <li>
              <Link to={ROUTES.HOME} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Accueil</Link>
            </li>
            <li style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}><i className="bi bi-chevron-right" /></li>
            <li>
              <Link to={ROUTES.BOOKING_SEARCH} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Recherche</Link>
            </li>
            <li style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}><i className="bi bi-chevron-right" /></li>
            <li>
              <Link to={ROUTES.BOOKING_SEATS} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Sièges</Link>
            </li>
            <li style={{ color: 'var(--text-muted)', fontSize: '0.6rem' }}><i className="bi bi-chevron-right" /></li>
            <li style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Paiement</li>
          </ol>
        </nav>

        {/* Stepper */}
        <PaymentStepper steps={STEPS} currentStep={4} />

        {/* Countdown */}
        <PaymentCountdown durationMinutes={10} onExpired={handleTimerExpired} />

        {/* Processing Overlay */}
        {isProcessing && <PaymentLoader />}

        {/* Error Modal */}
        {error && !isProcessing && (
          <PaymentErrorModal
            error={error}
            onRetry={() => setError(null)}
            onClose={() => { setError(null); navigate(ROUTES.BOOKING_SEATS); }}
          />
        )}

        {/* Success Modal */}
        {success && <PaymentSuccessModal transaction={success} />}

        {/* Timer Expired Modal */}
        {timerExpired && <TimerExpiredModal onBackToSearch={handleBackToSearch} />}

        {/* Main Content */}
        {!isProcessing && !error && !success && !timerExpired && (
          <div className="btc-pay-layout">
            {/* Left Column — Payment Methods & Forms */}
            <div className="btc-pay-left">
              {/* Payment Methods Card */}
              <div className="btc-pay-section-card">
                <div className="btc-pay-section-header">
                  <div className="btc-pay-section-icon" style={{ background: 'rgba(255, 107, 53, 0.1)', color: 'var(--color-accent, #FF6B35)' }}>
                    <i className="bi bi-credit-card-2-front-fill" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 'var(--font-size-base, 1rem)', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      Choisissez votre moyen de paiement
                    </h3>
                    <p style={{ fontSize: 'var(--font-size-xs, 0.8125rem)', color: 'var(--text-muted)', margin: 0, marginTop: 2 }}>
                      Toutes vos transactions sont sécurisées
                    </p>
                  </div>
                </div>
                <div className="btc-pay-methods-list">
                  {PAYMENT_METHODS.filter((m) => m.available).map((method) => (
                    <PaymentMethodCard
                      key={method.id}
                      method={method}
                      isSelected={selectedMethod === method.id}
                      onSelect={handleMethodSelect}
                    />
                  ))}
                </div>
              </div>

              {/* Dynamic Form — Mobile Money */}
              {selectedMethod && selectedMethodData?.category === 'mobile_money' && (
                <div className="btc-pay-section-card btc-pay-form-enter">
                  <MobileMoneyForm provider={selectedMethod} onValid={handleFormValid} />
                </div>
              )}

              {/* Dynamic Form — Card */}
              {selectedMethod && selectedMethodData?.category === 'card' && (
                <div className="btc-pay-section-card btc-pay-form-enter">
                  <CreditCardForm onValid={handleFormValid} />
                </div>
              )}

              {/* Dynamic Form — Agency */}
              {selectedMethod && selectedMethodData?.category === 'agency' && (
                <div className="btc-pay-section-card btc-pay-form-enter">
                  <AgencyInfo onConfirm={() => setFormValid(true)} />
                </div>
              )}

              {/* Promo Code */}
              <PromoCodeCard onApply={handlePromoApply} />

              {/* Insurance */}
              <InsuranceCard insurance={INSURANCE_OPTION} isSelected={insurance} onToggle={setInsurance} />

              {/* Terms */}
              <TermsCard reservation={reservation} onAccept={setAcceptedTerms} isAccepted={acceptedTerms} />

              {/* Security Badges */}
              <SecurityBadges />

              {/* Actions */}
              <div className="btc-pay-actions">
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.BOOKING_SEATS)}
                  className="btc-pay-btn-back"
                  aria-label="Retour aux sièges"
                >
                  <i className="bi bi-arrow-left" />
                  Retour aux sièges
                </button>
                <button
                  type="button"
                  onClick={handlePay}
                  disabled={!canPay}
                  className="btc-pay-btn-submit"
                  aria-label={`Payer ${total.toLocaleString()} FCFA`}
                  style={{ opacity: canPay ? 1 : 0.5, cursor: canPay ? 'pointer' : 'not-allowed' }}
                >
                  <i className="bi bi-lock-fill" />
                  Payer {total.toLocaleString()} FCFA
                </button>
              </div>
            </div>

            {/* Right Column — Summary (Sticky) */}
            <div className="btc-pay-right">
              <div className="btc-pay-right-sticky">
                <PaymentSummary
                  reservation={reservation}
                  selectedSeats={reservation.seats}
                  promoDiscount={promoDiscount}
                  insurance={insurance}
                  total={total}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
