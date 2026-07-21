import { useState, useCallback } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ROUTES } from '@routes/routeConstants';

const PassengerInfoPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedSeats = [], tripId } = location.state || {};

  const [passengers, setPassengers] = useState([
    { firstName: '', lastName: '', phone: '', email: '', idType: 'cni', idNumber: '' },
  ]);

  const updatePassenger = useCallback((index, field, value) => {
    setPassengers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }, []);

  const addPassenger = useCallback(() => {
    setPassengers((prev) => [...prev, { firstName: '', lastName: '', phone: '', email: '', idType: 'cni', idNumber: '' }]);
  }, []);

  const removePassenger = useCallback((index) => {
    setPassengers((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleContinue = useCallback(() => {
    navigate(ROUTES.BOOKING_PAYMENT, { state: { passengers, selectedSeats, tripId } });
  }, [navigate, passengers, selectedSeats, tripId]);

  const handleBack = useCallback(() => {
    navigate(ROUTES.BOOKING_SEATS);
  }, [navigate]);

  const isFormValid = passengers.every((p) => p.firstName.trim() && p.lastName.trim() && p.phone.trim());

  return (
    <div className="btc-passenger-page">
      <div className="container py-4">
        {/* Breadcrumb */}
        <nav aria-label="Fil d'Ariane" className="mb-4">
          <ol className="breadcrumb" style={{ fontSize: 'var(--font-size-xs)' }}>
            <li className="breadcrumb-item"><Link to="/" className="text-decoration-none" style={{ color: 'var(--text-muted)' }}>Accueil</Link></li>
            <li className="breadcrumb-item"><Link to={ROUTES.BOOKING_SEARCH} className="text-decoration-none" style={{ color: 'var(--text-muted)' }}>Recherche</Link></li>
            <li className="breadcrumb-item"><Link to={ROUTES.BOOKING_SEATS} className="text-decoration-none" style={{ color: 'var(--text-muted)' }}>Sieges</Link></li>
            <li className="breadcrumb-item active" style={{ color: 'var(--text-primary)' }}>Informations passagers</li>
          </ol>
        </nav>

        <h5 className="fw-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          <i className="bi bi-person-fill me-2" style={{ color: 'var(--color-accent)' }} />
          Informations des passagers
        </h5>

        <div className="row g-4">
          <div className="col-12 col-lg-8">
            {passengers.map((pax, idx) => (
              <div key={idx} className="card border-0 mb-3" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <h6 className="fw-bold mb-0" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                      <i className="bi bi-person-badge me-2" style={{ color: 'var(--color-accent)' }} />
                      Passager {idx + 1}
                    </h6>
                    {passengers.length > 1 && (
                      <button onClick={() => removePassenger(idx)} className="btn btn-sm btn-outline-danger" style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-2xs)' }}>
                        <i className="bi bi-trash" />
                      </button>
                    )}
                  </div>

                  <div className="row g-3">
                    <div className="col-12 col-sm-6">
                      <label className="form-label" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Prenom *</label>
                      <input type="text" className="form-control" value={pax.firstName} onChange={(e) => updatePassenger(idx, 'firstName', e.target.value)} placeholder="Prenom" style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', padding: '10px 14px' }} required />
                    </div>
                    <div className="col-12 col-sm-6">
                      <label className="form-label" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Nom *</label>
                      <input type="text" className="form-control" value={pax.lastName} onChange={(e) => updatePassenger(idx, 'lastName', e.target.value)} placeholder="Nom" style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', padding: '10px 14px' }} required />
                    </div>
                    <div className="col-12 col-sm-6">
                      <label className="form-label" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Telephone *</label>
                      <input type="tel" className="form-control" value={pax.phone} onChange={(e) => updatePassenger(idx, 'phone', e.target.value)} placeholder="+237 6XX XXX XXX" style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', padding: '10px 14px' }} required />
                    </div>
                    <div className="col-12 col-sm-6">
                      <label className="form-label" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)' }}>Email</label>
                      <input type="email" className="form-control" value={pax.email} onChange={(e) => updatePassenger(idx, 'email', e.target.value)} placeholder="email@exemple.com" style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', padding: '10px 14px' }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {passengers.length < 10 && (
              <button onClick={addPassenger} className="btn btn-outline-primary w-100 mb-3" style={{ borderRadius: 'var(--radius-lg)', borderStyle: 'dashed', fontSize: 'var(--font-size-sm)' }}>
                <i className="bi bi-plus-lg me-2" />
                Ajouter un passager
              </button>
            )}
          </div>

          {/* Right sidebar */}
          <div className="col-12 col-lg-4">
            <div className="card border-0" style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-sm)' }}>
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-primary)' }}>
                  <i className="bi bi-info-circle me-2" style={{ color: 'var(--color-accent)' }} />
                  Informations
                </h6>
                <div className="d-flex flex-column gap-2">
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-check-circle-fill" style={{ color: 'var(--color-success)', fontSize: '0.8rem', marginTop: 3 }} />
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                      Les noms doivent correspondre exactement a votre piece d'identite.
                    </span>
                  </div>
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-check-circle-fill" style={{ color: 'var(--color-success)', fontSize: '0.8rem', marginTop: 3 }} />
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                      Une piece d'identite valide sera requise lors du voyage.
                    </span>
                  </div>
                  <div className="d-flex align-items-start gap-2">
                    <i className="bi bi-check-circle-fill" style={{ color: 'var(--color-success)', fontSize: '0.8rem', marginTop: 3 }} />
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
                      {selectedSeats.length} place(s) selectionnee(s).
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="d-flex gap-2 mt-4">
          <button onClick={handleBack} className="btn btn-outline-secondary" style={{ borderRadius: 'var(--radius-lg)', padding: '12px 20px', fontSize: 'var(--font-size-sm)' }}>
            <i className="bi bi-arrow-left me-2" />
            Retour aux sieges
          </button>
          <button onClick={handleContinue} disabled={!isFormValid} className="btn btn-accent flex-fill" style={{ borderRadius: 'var(--radius-lg)', padding: '12px 24px', fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)', opacity: isFormValid ? 1 : 0.6 }}>
            Continuer vers le paiement
            <i className="bi bi-arrow-right ms-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PassengerInfoPage;
