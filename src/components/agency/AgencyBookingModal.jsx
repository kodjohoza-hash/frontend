import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingFormSchema } from '@schemas/booking.schema';
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from '@data/bookingData';
import { cities, buses } from '@data/agencyTripsData';

const defaultValues = {
  clientFirstName: '',
  clientLastName: '',
  clientPhone: '',
  clientEmail: '',
  tripId: '',
  busId: '',
  seats: [],
  paymentMethod: '',
  discount: 0,
  outlet: '',
  agent: '',
  notes: '',
};

export default function AgencyBookingModal({ isOpen, onClose, onSubmit, loading }) {
  const [seatInput, setSeatInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(bookingFormSchema),
    defaultValues,
  });

  const watchedSeats = watch('seats');
  const watchedDiscount = watch('discount');

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
      setSeatInput('');
    }
  }, [isOpen, reset]);

  const handleAddSeat = () => {
    const num = parseInt(seatInput, 10);
    if (!isNaN(num) && num > 0 && !(watchedSeats || []).includes(num)) {
      setValue('seats', [...(watchedSeats || []), num], { shouldValidate: true });
      setSeatInput('');
    }
  };

  const handleRemoveSeat = (seat) => {
    setValue(
      'seats',
      (watchedSeats || []).filter((s) => s !== seat),
      { shouldValidate: true }
    );
  };

  const handleSeatKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSeat();
    }
  };

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="abr-modal-overlay" onClick={onClose}>
      <div className="abr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="abr-modal__header">
          <div className="abr-modal__title">
            <i className="bi bi-ticket-perforated" />
            <h3>Nouvelle réservation</h3>
          </div>
          <button className="abr-modal__close" onClick={onClose}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="abr-modal__body">
          <div className="abr-form-section">
            <h4 className="abr-form-section__title">
              <i className="bi bi-person" /> Client
            </h4>
            <div className="abr-form-row">
              <div className="abr-form-field">
                <label>Prénom <span className="abr-required">*</span></label>
                <input
                  {...register('clientFirstName')}
                  placeholder="Prénom du client"
                  className={errors.clientFirstName ? 'abr-input--error' : ''}
                />
                {errors.clientFirstName && (
                  <span className="abr-form-error">{errors.clientFirstName.message}</span>
                )}
              </div>
              <div className="abr-form-field">
                <label>Nom <span className="abr-required">*</span></label>
                <input
                  {...register('clientLastName')}
                  placeholder="Nom du client"
                  className={errors.clientLastName ? 'abr-input--error' : ''}
                />
                {errors.clientLastName && (
                  <span className="abr-form-error">{errors.clientLastName.message}</span>
                )}
              </div>
            </div>
            <div className="abr-form-row">
              <div className="abr-form-field">
                <label>Téléphone <span className="abr-required">*</span></label>
                <input
                  {...register('clientPhone')}
                  placeholder="+237"
                  className={errors.clientPhone ? 'abr-input--error' : ''}
                />
                {errors.clientPhone && (
                  <span className="abr-form-error">{errors.clientPhone.message}</span>
                )}
              </div>
              <div className="abr-form-field">
                <label>Email</label>
                <input
                  type="email"
                  {...register('clientEmail')}
                  placeholder="email@exemple.com"
                  className={errors.clientEmail ? 'abr-input--error' : ''}
                />
                {errors.clientEmail && (
                  <span className="abr-form-error">{errors.clientEmail.message}</span>
                )}
              </div>
            </div>
          </div>

          <div className="abr-form-section">
            <h4 className="abr-form-section__title">
              <i className="bi bi-bus-front" /> Voyage
            </h4>
            <div className="abr-form-row">
              <div className="abr-form-field">
                <label>Voyage <span className="abr-required">*</span></label>
                <select
                  {...register('tripId')}
                  className={errors.tripId ? 'abr-input--error' : ''}
                >
                  <option value="">Sélectionner un voyage</option>
                  <option value="VYG-2026-001">VYG-2026-001 — Douala → Yaoundé</option>
                  <option value="VYG-2026-002">VYG-2026-002 — Yaoundé → Bafoussam</option>
                  <option value="VYG-2026-003">VYG-2026-003 — Douala → Bamenda</option>
                  <option value="VYG-2026-004">VYG-2026-004 — Yaoundé → Kribi</option>
                  <option value="VYG-2026-005">VYG-2026-005 — Douala → Garoua</option>
                </select>
                {errors.tripId && (
                  <span className="abr-form-error">{errors.tripId.message}</span>
                )}
              </div>
              <div className="abr-form-field">
                <label>Bus <span className="abr-required">*</span></label>
                <select
                  {...register('busId')}
                  className={errors.busId ? 'abr-input--error' : ''}
                >
                  <option value="">Sélectionner un bus</option>
                  {buses.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} — {b.plate} ({b.seats} places)
                    </option>
                  ))}
                </select>
                {errors.busId && (
                  <span className="abr-form-error">{errors.busId.message}</span>
                )}
              </div>
            </div>
            <div className="abr-form-row">
              <div className="abr-form-field abr-form-field--full">
                <label>Places <span className="abr-required">*</span></label>
                <div className="abr-form-seats">
                  <div className="abr-form-seats__input">
                    <input
                      type="number"
                      min="1"
                      value={seatInput}
                      onChange={(e) => setSeatInput(e.target.value)}
                      onKeyDown={handleSeatKeyDown}
                      placeholder="N° de place"
                    />
                    <button type="button" className="abr-btn abr-btn--sm" onClick={handleAddSeat}>
                      <i className="bi bi-plus-lg" />
                    </button>
                  </div>
                  <div className="abr-form-seats__list">
                    {(watchedSeats || []).sort((a, b) => a - b).map((seat) => (
                      <span key={seat} className="abr-form-seats__tag">
                        Place {seat}
                        <button type="button" onClick={() => handleRemoveSeat(seat)}>
                          <i className="bi bi-x" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                {errors.seats && (
                  <span className="abr-form-error">{errors.seats.message}</span>
                )}
              </div>
            </div>
          </div>

          <div className="abr-form-section">
            <h4 className="abr-form-section__title">
              <i className="bi bi-credit-card" /> Paiement
            </h4>
            <div className="abr-form-row">
              <div className="abr-form-field">
                <label>Mode de paiement <span className="abr-required">*</span></label>
                <select
                  {...register('paymentMethod')}
                  className={errors.paymentMethod ? 'abr-input--error' : ''}
                >
                  <option value="">Sélectionner</option>
                  {Object.values(PAYMENT_METHODS).map((m) => (
                    <option key={m} value={m}>{PAYMENT_METHOD_LABELS[m]}</option>
                  ))}
                </select>
                {errors.paymentMethod && (
                  <span className="abr-form-error">{errors.paymentMethod.message}</span>
                )}
              </div>
              <div className="abr-form-field">
                <label>Réduction (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  {...register('discount', { valueAsNumber: true })}
                  className={errors.discount ? 'abr-input--error' : ''}
                />
                {errors.discount && (
                  <span className="abr-form-error">{errors.discount.message}</span>
                )}
              </div>
            </div>
            <div className="abr-form-row">
              <div className="abr-form-field">
                <label>Point de vente</label>
                <select {...register('outlet')}>
                  <option value="">Sélectionner</option>
                  <option value="point-central-douala">Point Central Douala</option>
                  <option value="guichet-yaounde-central">Guichet Yaoundé Central</option>
                  <option value="guichet-bafoussam">Guichet Bafoussam</option>
                </select>
              </div>
              <div className="abr-form-field">
                <label>Agent</label>
                <input
                  {...register('agent')}
                  placeholder="Nom de l'agent"
                />
              </div>
            </div>
          </div>

          <div className="abr-form-section">
            <h4 className="abr-form-section__title">
              <i className="bi bi-sticky" /> Notes
            </h4>
            <div className="abr-form-row">
              <div className="abr-form-field abr-form-field--full">
                <textarea
                  {...register('notes')}
                  rows={3}
                  placeholder="Observations ou notes internes..."
                  className="abr-input abr-input--textarea"
                />
              </div>
            </div>
          </div>

          <div className="abr-modal__footer">
            <button type="button" className="abr-modal__btn abr-modal__btn--cancel" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="abr-modal__btn abr-modal__btn--save" disabled={loading}>
              {loading ? (
                <>
                  <span className="abr-btn__spinner" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg" />
                  Créer la réservation
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
