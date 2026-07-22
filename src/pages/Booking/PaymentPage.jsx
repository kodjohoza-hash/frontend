import { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ROUTES } from '@routes/routeConstants';
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
import PaymentService from '@services/paymentService';
import '@assets/styles/payment.css';

const PaymentPage = () => {
  const navigate = useNavigate();
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

  const reservation = MOCK_RESERVATION;

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1100);
    return () => clearTimeout(t);
  }, []);

  const total = useMemo(() => {
    const subtotal = reservation.seats.reduce((a, s) => a + s.price, 0);
    const ins = insurance ? INSURANCE.price : 0;
    return subtotal + reservation.fees + ins - promoDiscount;
  }, [reservation, insurance, promoDiscount]);

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
      const result = await PaymentService.processPayment({
        method: selectedMethod,
        amount: total,
        ...formData,
        currency: reservation.currency,
      });
      if (result.success) setSuccess(result);
      else setError(result.error);
    } catch {
      setError('Une erreur inattendue est survenue. Vérifiez votre connexion.');
    } finally {
      setProcessing(false);
    }
  }, [canPay, selectedMethod, total, formData, reservation.currency]);

  if (loading) {
    return (
      <div className="ck-page">
        <div className="ck-wrap"><CkSkeleton /></div>
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

              <CkPromo onApply={handlePromo} />
              <CkInsurance insurance={INSURANCE} isSelected={insurance} onToggle={setInsurance} />
              <CkTerms reservation={reservation} isAccepted={acceptedTerms} onAccept={setAcceptedTerms} />
              <CkTrustBar />

              <div className="ck-actions">
                <button type="button" className="ck-btn-back" onClick={() => navigate(ROUTES.BOOKING_SEATS)}>
                  <i className="bi bi-arrow-left" />
                  Retour aux sièges
                </button>
                <button
                  type="button"
                  className="ck-btn-pay"
                  onClick={handlePay}
                  disabled={!canPay}
                >
                  <i className="bi bi-shield-lock-fill" />
                  Payer {total.toLocaleString()} FCFA
                </button>
              </div>
            </div>

            <div className="ck-right">
              <CkSummary
                reservation={reservation}
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
