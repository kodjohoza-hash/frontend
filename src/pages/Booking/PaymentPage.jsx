import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PaymentStepper, PaymentMethodCard, MobileMoneyForm, CreditCardForm,
  SecureBadge, PaymentSummary, PromoCodeCard, InsuranceCard,
  ReservationRecap, PaymentLoader, PaymentErrorModal, PaymentSuccessModal,
  ReservationTimer, PaymentSkeleton,
} from '@components/payment';
import { PAYMENT_METHODS, mockReservation, STEPS, INSURANCE_OPTION } from '@data/payment';
import PaymentService from '@services/paymentService';
import '@assets/styles/payment.css';

const LoadingDelay = 1200;

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

  const reservation = mockReservation;

  useState(() => {
    const timer = setTimeout(() => setIsLoading(false), LoadingDelay);
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

  const handleMethodSelect = useCallback((methodId) => {
    setSelectedMethod(methodId);
    setFormData({});
    setFormValid(false);
    setError(null);
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
    if (!selectedMethod || !formValid || !acceptedTerms) return;
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
      setError('Une erreur inattendue est survenue. Verifiez votre connexion.');
    } finally {
      setIsProcessing(false);
    }
  }, [selectedMethod, formValid, acceptedTerms, total, formData, reservation.currency]);

  const handleTimerExpired = useCallback(() => {
    setError('Le delai de reservation a expire. Veuillez relancer votre recherche.');
  }, []);

  if (isLoading) {
    return (
      <div className="container py-4">
        <PaymentSkeleton />
      </div>
    );
  }

  return (
    <div className="btc-payment-page">
      <div className="container py-4">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="mb-3">
          <ol className="breadcrumb" style={{ fontSize: 'var(--font-size-xs)' }}>
            <li className="breadcrumb-item"><a href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Accueil</a></li>
            <li className="breadcrumb-item"><a href="/booking/search" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Recherche</a></li>
            <li className="breadcrumb-item"><a href="/booking/search" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Resultats</a></li>
            <li className="breadcrumb-item"><a href="/booking/seats" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Choix des sieges</a></li>
            <li className="breadcrumb-item active" style={{ color: 'var(--text-primary)' }}>Paiement</li>
          </ol>
        </nav>

        {/* Stepper */}
        <PaymentStepper steps={STEPS} currentStep={4} />

        {/* Timer */}
        <ReservationTimer durationMinutes={10} onExpired={handleTimerExpired} />

        {/* Processing Overlay */}
        {isProcessing && (
          <div className="btc-processing-overlay">
            <PaymentLoader />
          </div>
        )}

        {/* Error Modal */}
        {error && !isProcessing && (
          <PaymentErrorModal
            error={error}
            onRetry={() => { setError(null); }}
            onClose={() => { setError(null); navigate('/booking/seats'); }}
          />
        )}

        {/* Success Modal */}
        {success && (
          <PaymentSuccessModal transaction={success} />
        )}

        {/* Main Content */}
        {!isProcessing && !error && !success && (
          <div className="row g-4">
            {/* Left: Payment Methods */}
            <div className="col-12 col-lg-7">
              {/* Payment Methods Card */}
              <div className="card border-0 mb-3" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
                <div className="card-body p-4">
                  <h6 className="fw-bold mb-3" style={{ fontSize: 'var(--font-size-base)', color: 'var(--text-primary)' }}>
                    <i className="bi bi-credit-card-2-front-fill me-2" style={{ color: 'var(--color-accent)' }} />
                    Choisissez votre mode de paiement
                  </h6>

                  <div className="d-flex flex-column gap-2">
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
              </div>

              {/* Dynamic Form */}
              {selectedMethod && selectedMethodData?.category === 'mobile_money' && (
                <div className="card border-0 mb-3 btc-form-card" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
                  <div className="card-body p-4">
                    <MobileMoneyForm provider={selectedMethod} onValid={handleFormValid} />
                  </div>
                </div>
              )}

              {selectedMethod && selectedMethodData?.category === 'card' && (
                <div className="card border-0 mb-3 btc-form-card" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
                  <div className="card-body p-4">
                    <CreditCardForm onValid={handleFormValid} />
                  </div>
                </div>
              )}

              {selectedMethod && selectedMethodData?.category === 'agency' && (
                <div className="card border-0 mb-3" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
                  <div className="card-body p-4 text-center">
                    <i className="bi bi-building mb-2" style={{ fontSize: '1.5rem', color: 'var(--color-primary)' }} />
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
                      Rendez-vous a l'agence avec votre numero de reservation pour payer en especes.
                    </p>
                    <button onClick={() => setFormValid(true)} className="btn btn-sm" style={{ background: 'var(--color-primary-50)', color: 'var(--color-primary)', borderRadius: 'var(--radius-md)', fontWeight: 'var(--font-weight-semibold)' }}>
                      Confirmer le paiement a l'agence
                    </button>
                  </div>
                </div>
              )}

              {/* Promo Code */}
              <PromoCodeCard onApply={handlePromoApply} />

              {/* Insurance */}
              <InsuranceCard insurance={INSURANCE_OPTION} isSelected={insurance} onToggle={setInsurance} />

              {/* Terms */}
              <div className="card border-0 mb-3" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
                <div className="card-body p-4">
                  <label className="d-flex align-items-start gap-2 cursor-pointer mb-0" htmlFor="terms-accept">
                    <input
                      type="checkbox"
                      id="terms-accept"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="mt-1"
                      style={{ width: 18, height: 18, accentColor: 'var(--color-primary)', cursor: 'pointer' }}
                      aria-label="Accepter les conditions generales"
                    />
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', lineHeight: 'var(--line-height-relaxed)' }}>
                      J'accepte les <a href="#" style={{ color: 'var(--color-primary)', fontWeight: 'var(--font-weight-semibold)' }}>conditions generales de vente</a>,
                      la <a href="#" style={{ color: 'var(--color-primary)', fontWeight: 'var(--font-weight-semibold)' }}>politique de confidentialite</a>
                      et je confirme que les informations saisies sont exactes.
                    </span>
                  </label>
                </div>
              </div>

              {/* Security Badges */}
              <SecureBadge />

              {/* Actions */}
              <div className="d-flex gap-2 mt-3">
                <button
                  onClick={() => navigate('/booking/seats')}
                  className="btn btn-outline-secondary"
                  style={{ borderRadius: 'var(--radius-lg)', padding: '12px 20px', fontSize: 'var(--font-size-sm)' }}
                >
                  <i className="bi bi-arrow-left me-2" />
                  Retour aux sieges
                </button>
                <button
                  onClick={handlePay}
                  disabled={!selectedMethod || !formValid || !acceptedTerms}
                  className="btn btn-accent flex-fill"
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    padding: '12px 24px',
                    fontWeight: 'var(--font-weight-semibold)',
                    fontSize: 'var(--font-size-sm)',
                    opacity: (!selectedMethod || !formValid || !acceptedTerms) ? 0.6 : 1,
                  }}
                >
                  <i className="bi bi-lock-fill me-2" />
                  Payer {total.toLocaleString()} FCFA
                </button>
              </div>
            </div>

            {/* Right: Summary */}
            <div className="col-12 col-lg-5">
              <div className="btc-payment-right-sticky">
                <PaymentSummary
                  reservation={reservation}
                  selectedSeats={reservation.seats}
                  promoDiscount={promoDiscount}
                  insurance={insurance}
                  total={total}
                />
                <div className="mt-3">
                  <ReservationRecap reservation={reservation} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
