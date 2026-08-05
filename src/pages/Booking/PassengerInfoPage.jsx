import { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@routes/routeConstants';
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
  errs._hasError = Object.keys(errs).length > 1;
  return errs;
};

const PassengerInfoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedSeats = [], tripId, trip } = location.state || {};

  const defaultTrip = trip || {
    from: 'Douala',
    to: 'Yaoundé',
    date: '2026-07-28',
    departure: '06:30',
    arrival: '09:45',
    company: 'Guillaume Express',
    price: '8 500',
  };

  const [passengers, setPassengers] = useState([
    { ...EMPTY_PASSENGER },
  ]);
  const [errors, setErrors] = useState([{}]);
  const [validated, setValidated] = useState(false);

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
    if (passengers.length < (selectedSeats.length || 10)) {
      setPassengers((prev) => [...prev, { ...EMPTY_PASSENGER }]);
      setErrors((prev) => [...prev, {}]);
    }
  }, [passengers.length, selectedSeats.length]);

  const removePassenger = useCallback((index) => {
    setPassengers((prev) => prev.filter((_, i) => i !== index));
    setErrors((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleContinue = useCallback(() => {
    const allErrors = passengers.map(validatePassenger);
    setErrors(allErrors);
    setValidated(true);

    const hasError = allErrors.some((e) => e._hasError);
    if (!hasError) {
      navigate(ROUTES.BOOKING_PAYMENT, {
        state: { passengers, selectedSeats, tripId, trip: defaultTrip },
      });
    }
  }, [navigate, passengers, selectedSeats, tripId, defaultTrip]);

  const handleBack = useCallback(() => {
    navigate(ROUTES.BOOKING_SEATS, { state: { tripId, trip: defaultTrip } });
  }, [navigate, tripId, defaultTrip]);

  const allValid = passengers.every(
    (p) => p.firstName.trim() && p.lastName.trim() && p.gender && p.dateOfBirth && p.phone.trim() && p.idNumber.trim()
  );

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

            {passengers.length < (selectedSeats.length || 10) && (
              <button type="button" className="pi-add-btn" onClick={addPassenger}>
                <i className="bi bi-plus-circle" />
                Ajouter un passager
              </button>
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
                disabled={!allValid}
              >
                Continuer vers le paiement
                <i className="bi bi-arrow-right" />
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
