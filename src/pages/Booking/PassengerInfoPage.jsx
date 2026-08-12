import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ROUTES } from '@routes/routeConstants';
import useAuth from '@hooks/useAuth';
import bookingService from '@services/booking.service';
import PiStepper from '@components/booking/PiStepper';
import PiPassengerCard from '@components/booking/PiPassengerCard';
import PiTripSummary from '@components/booking/PiTripSummary';
import '@assets/styles/passengerInfo.css';

const EMPTY_EMERGENCY_CONTACT = {
  fullName: '',
  phone: '',
  relationship: '',
  address: '',
};

const EMPTY_PASSENGER = {
  firstName: '',
  lastName: '',
  gender: '',
  dateOfBirth: '',
  phone: '',
  email: '',
  idType: 'cni',
  idNumber: '',
  emergencyContact: { ...EMPTY_EMERGENCY_CONTACT },
};

const validateEmergencyContact = (ec = {}) => {
  const errs = {};
  const filled = ['fullName', 'phone', 'relationship'].filter((k) => String(ec[k] || '').trim());
  if (filled.length) {
    if (!ec.fullName?.trim()) errs.fullName = 'Nom du contact requis';
    if (!ec.phone?.trim()) errs.phone = 'Téléphone du contact requis';
    else if (!/^(\+?237)?[69]\d{8}$/.test(ec.phone.replace(/\s/g, ''))) errs.phone = 'Numéro camerounais invalide';
    if (!ec.relationship?.trim()) errs.relationship = 'Lien requis';
  }
  errs._hasError = Object.keys(errs).filter((k) => k !== '_hasError').length > 0;
  return errs;
};

const validatePassenger = (pax) => {
  const errs = {};
  if (!pax.firstName.trim()) errs.firstName = 'Prénom requis';
  if (!pax.lastName.trim()) errs.lastName = 'Nom requis';
  if (!pax.gender) errs.gender = 'Sexe requis';
  if (!pax.dateOfBirth) errs.dateOfBirth = 'Date de naissance requise';
  if (!pax.phone.trim()) errs.phone = 'Téléphone requis';
  else if (!/^(\+?237)?[69]\d{8}$/.test(pax.phone.replace(/\s/g, ''))) errs.phone = 'Numéro camerounais invalide';
  if (pax.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(pax.email)) errs.email = 'Email invalide';
  if (!pax.idNumber.trim()) errs.idNumber = 'Numéro requis';
  const ecErrs = validateEmergencyContact(pax.emergencyContact);
  if (ecErrs._hasError) errs.emergencyContact = ecErrs;
  errs._hasError = Object.keys(errs).length > 0;
  return errs;
};

const PassengerInfoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { selectedSeats = [], tripId, trip } = location.state || {};

  const defaultTrip = useMemo(() => trip || {
    from: 'Douala',
    to: 'Yaoundé',
    date: '2026-07-28',
    departure: '06:30',
    arrival: '09:45',
    company: 'Guillaume Express',
    price: '8 500',
  }, [trip]);

  const [passengers, setPassengers] = useState([
    { ...EMPTY_PASSENGER },
  ]);
  const [errors, setErrors] = useState([{}]);
  const [validated, setValidated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const updatePassenger = useCallback((index, field, value) => {
    setPassengers((prev) => {
      const next = [...prev];
      const [root, sub] = field.split('.');
      if (sub) {
        next[index] = {
          ...next[index],
          [root]: { ...(next[index][root] || {}), [sub]: value },
        };
      } else {
        next[index] = { ...next[index], [root]: value };
      }
      return next;
    });
    setErrors((prev) => {
      const next = [...prev];
      if (next[index]) {
        const updated = { ...next[index] };
        const [root, sub] = field.split('.');
        if (sub && updated[root]) {
          const nested = { ...updated[root] };
          delete nested[sub];
          if (Object.keys(nested).filter((k) => k !== '_hasError').length === 0) delete updated[root];
          else updated[root] = nested;
        } else {
          delete updated[root];
        }
        if (Object.keys(updated).filter((k) => k !== '_hasError').length === 0) {
          next[index] = {};
        } else {
          next[index] = updated;
        }
      }
      return next;
    });
  }, []);

  const addPassenger = useCallback(() => {
    const max = selectedSeats.length || 1;
    if (passengers.length < max) {
      setPassengers((prev) => [...prev, { ...EMPTY_PASSENGER }]);
      setErrors((prev) => [...prev, {}]);
    }
  }, [passengers.length, selectedSeats.length]);

  const removePassenger = useCallback((index) => {
    setPassengers((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleContinue = useCallback(async () => {
    const allErrors = passengers.map(validatePassenger);
    setErrors(allErrors);
    setValidated(true);
    setSubmitError('');

    const hasError = allErrors.some((e) => e._hasError);
    if (hasError || passengers.length !== (selectedSeats.length || 1)) return;

    setIsSubmitting(true);
    try {
      const payload = {
        departId: tripId,
        seats: selectedSeats.map((s) => ({
          siege: String(s.number),
          tarif: Number(s.price) || null,
        })),
        passengers: passengers.map((p) => ({
          firstName: p.firstName.trim(),
          lastName: p.lastName.trim(),
          gender: p.gender,
          birthDate: p.dateOfBirth || null,
          phone: p.phone.trim(),
          email: p.email?.trim() || null,
          documentType: p.idType || 'cni',
          documentNumber: p.idNumber.trim(),
          nationality: null,
          emergencyContact: {
            fullName: p.emergencyContact?.fullName?.trim() || null,
            phone: p.emergencyContact?.phone?.trim() || null,
            relationship: p.emergencyContact?.relationship?.trim() || null,
            address: p.emergencyContact?.address?.trim() || null,
          },
        })),
        modeReservation: 'en_ligne',
        statut: 'en_attente',
      };

      const booking = await bookingService.createBooking(payload);
      navigate(ROUTES.BOOKING_PAYMENT, {
        state: {
          bookingId: booking.id,
          reservation: booking,
          selectedSeats,
          passengers,
          trip: defaultTrip,
        },
      });
    } catch (err) {
      setSubmitError(err.message || 'La réservation a échoué. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  }, [navigate, passengers, selectedSeats, tripId, defaultTrip]);

  const handleBack = useCallback(() => {
    navigate(ROUTES.BOOKING_SEATS, { state: { tripId, trip: defaultTrip } });
  }, [navigate, tripId, defaultTrip]);

  const allValid = passengers.every(
    (p) => p.firstName.trim() && p.lastName.trim() && p.gender && p.dateOfBirth && p.phone.trim() && p.idNumber.trim()
  );
  const requiredCount = selectedSeats.length || 1;
  const countOk = passengers.length === requiredCount;

  if (authLoading && !isAuthenticated) {
    return (
      <div className="pi-page">
        <div className="pi-container" style={{ display: 'flex', justifyContent: 'center', padding: '120px 0' }}>
          <i className="bi bi-arrow-repeat" style={{ fontSize: 36, color: 'var(--text-muted)', animation: 'btcSpin 1s linear infinite' }} />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location, checkout: location.state }}
      />
    );
  }

  return (
    <div className="pi-page">
      <div className="pi-container">
        <PiStepper currentStep={3} />

        <div className="pi-content">
          <div className="pi-main">
            {passengers.map((pax, idx) => (
              <PiPassengerCard
                key={idx}
                index={idx}
                passenger={pax}
                onChange={updatePassenger}
                onRemove={removePassenger}
                canRemove={passengers.length > 1}
                errors={validated ? errors[idx] || {} : {}}
              />
            ))}

            {passengers.length < requiredCount && (
              <button type="button" className="pi-add-btn" onClick={addPassenger}>
                <i className="bi bi-plus-circle" />
                Ajouter un passager
              </button>
            )}

            {!countOk && (
              <p className="pi-count-hint">
                {requiredCount - passengers.length} passager(s) manquant(s) pour {requiredCount} siège(s) sélectionné(s).
              </p>
            )}

            {submitError && (
              <div
                role="alert"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 16px',
                  borderRadius: 10,
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  color: '#DC2626',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 600,
                  marginBottom: 16,
                }}
              >
                <i className="bi bi-exclamation-triangle-fill" />
                {submitError}
              </div>
            )}

            <div className="pi-actions">
              <button type="button" className="pi-actions__back" onClick={handleBack}>
                <i className="bi bi-arrow-left" />
                Retour
              </button>
              <button
                type="button"
                className="pi-actions__next"
                onClick={handleContinue}
                disabled={!allValid || !countOk || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <i className="bi bi-arrow-repeat" style={{ animation: 'btcSpin 1s linear infinite' }} />
                    Création de la réservation…
                  </>
                ) : (
                  <>
                    Continuer vers le paiement
                    <i className="bi bi-arrow-right" />
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="pi-side">
            <PiTripSummary trip={defaultTrip} selectedSeats={selectedSeats.length ? selectedSeats : ['A12']} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassengerInfoPage;
