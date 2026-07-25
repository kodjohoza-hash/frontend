import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentFormSchema } from '@schemas/payment.schema';
import { PAYMENT_METHODS, PAYMENT_METHOD_LABELS } from '@data/paymentData';

const defaultValues = {
  bookingId: '',
  clientName: '',
  clientPhone: '',
  clientEmail: '',
  amount: 0,
  currency: 'XAF',
  method: '',
  outlet: '',
  agent: '',
  notes: '',
};

export default function AgencyPaymentModal({ isOpen, onClose, onSubmit, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(paymentFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (isOpen) {
      reset(defaultValues);
    }
  }, [isOpen, reset]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  if (!isOpen) return null;

  return (
    <div className="ap-modal-overlay" onClick={onClose}>
      <div className="ap-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ap-modal__header">
          <div className="ap-modal__title">
            <i className="bi bi-credit-card" />
            <h3>Nouveau paiement</h3>
          </div>
          <button className="ap-modal__close" onClick={onClose}>
            <i className="bi bi-x-lg" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="ap-modal__body">
          <div className="ap-form-section">
            <h4 className="ap-form-section__title">
              <i className="bi bi-ticket-perforated" /> Réservation
            </h4>
            <div className="ap-form-row">
              <div className="ap-form-field">
                <label>Réservation <span className="ap-required">*</span></label>
                <input
                  {...register('bookingId')}
                  placeholder="Ex: BK-2026-0001"
                  className={errors.bookingId ? 'ap-input--error' : ''}
                />
                {errors.bookingId && (
                  <span className="ap-form__error">{errors.bookingId.message}</span>
                )}
              </div>
              <div className="ap-form-field">
                <label>Nom du client <span className="ap-required">*</span></label>
                <input
                  {...register('clientName')}
                  placeholder="Nom complet"
                  className={errors.clientName ? 'ap-input--error' : ''}
                />
                {errors.clientName && (
                  <span className="ap-form__error">{errors.clientName.message}</span>
                )}
              </div>
            </div>
            <div className="ap-form-row">
              <div className="ap-form-field">
                <label>Téléphone <span className="ap-required">*</span></label>
                <input
                  {...register('clientPhone')}
                  placeholder="+237"
                  className={errors.clientPhone ? 'ap-input--error' : ''}
                />
                {errors.clientPhone && (
                  <span className="ap-form__error">{errors.clientPhone.message}</span>
                )}
              </div>
              <div className="ap-form-field">
                <label>Email</label>
                <input
                  type="email"
                  {...register('clientEmail')}
                  placeholder="email@exemple.com"
                  className={errors.clientEmail ? 'ap-input--error' : ''}
                />
                {errors.clientEmail && (
                  <span className="ap-form__error">{errors.clientEmail.message}</span>
                )}
              </div>
            </div>
          </div>

          <div className="ap-form-section">
            <h4 className="ap-form-section__title">
              <i className="bi bi-cash-stack" /> Montant
            </h4>
            <div className="ap-form-row">
              <div className="ap-form-field">
                <label>Montant <span className="ap-required">*</span></label>
                <input
                  type="number"
                  min="1"
                  {...register('amount', { valueAsNumber: true })}
                  placeholder="0"
                  className={errors.amount ? 'ap-input--error' : ''}
                />
                {errors.amount && (
                  <span className="ap-form__error">{errors.amount.message}</span>
                )}
              </div>
              <div className="ap-form-field">
                <label>Devise</label>
                <select {...register('currency')}>
                  <option value="XAF">XAF</option>
                </select>
              </div>
              <div className="ap-form-field">
                <label>Mode de paiement <span className="ap-required">*</span></label>
                <select
                  {...register('method')}
                  className={errors.method ? 'ap-input--error' : ''}
                >
                  <option value="">Sélectionner</option>
                  {Object.values(PAYMENT_METHODS).map((m) => (
                    <option key={m} value={m}>{PAYMENT_METHOD_LABELS[m]}</option>
                  ))}
                </select>
                {errors.method && (
                  <span className="ap-form__error">{errors.method.message}</span>
                )}
              </div>
            </div>
          </div>

          <div className="ap-form-section">
            <h4 className="ap-form-section__title">
              <i className="bi bi-shop" /> Point de vente
            </h4>
            <div className="ap-form-row">
              <div className="ap-form-field">
                <label>Point de vente</label>
                <input
                  {...register('outlet')}
                  placeholder="Nom du point de vente"
                />
              </div>
              <div className="ap-form-field">
                <label>Agent</label>
                <input
                  {...register('agent')}
                  placeholder="Nom de l'agent"
                />
              </div>
            </div>
          </div>

          <div className="ap-form-section">
            <h4 className="ap-form-section__title">
              <i className="bi bi-sticky" /> Notes
            </h4>
            <div className="ap-form-row">
              <div className="ap-form-field ap-form-field--full">
                <textarea
                  {...register('notes')}
                  rows={3}
                  placeholder="Observations ou notes internes..."
                  className="ap-input ap-input--textarea"
                />
              </div>
            </div>
          </div>

          <div className="ap-modal__footer">
            <button type="button" className="ap-modal__btn ap-modal__btn--cancel" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="ap-modal__btn ap-modal__btn--save" disabled={loading}>
              {loading ? (
                <>
                  <span className="ap-btn__spinner" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg" />
                  Enregistrer le paiement
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
