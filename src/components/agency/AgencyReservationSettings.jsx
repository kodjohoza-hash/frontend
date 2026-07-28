import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reservationSettingsSchema } from '@schemas/settings.schema';

const refundPolicyOptions = [
  { value: 'strict', label: 'Stricte' },
  { value: 'flexible', label: 'Flexible' },
  { value: 'non-refundable', label: 'Non remboursable' },
];

const AgencyReservationSettings = ({ data, onSave }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reservationSettingsSchema),
    defaultValues: {
      maxSeatsPerBooking: data.maxSeatsPerBooking ?? 10,
      autoExpiryMinutes: data.autoExpiryMinutes ?? 30,
      allowCancellation: data.allowCancellation ?? true,
      refundPolicy: data.refundPolicy || 'flexible',
      instantBooking: data.instantBooking ?? true,
      manualValidation: data.manualValidation ?? false,
      autoNumbering: data.autoNumbering ?? true,
      numberPrefix: data.numberPrefix || '',
      cancellationDeadlineHours: data.cancellationDeadlineHours ?? 24,
      refundPercentage: data.refundPercentage ?? 75,
    },
  });

  const autoNumbering = watch('autoNumbering');

  const onSubmit = (formData) => {
    onSave(formData);
  };

  return (
    <div className="aset-section">
      <div className="aset-section__header">
        <div className="aset-section__title-group">
          <h3 className="aset-section__title">
            <i className="bi bi-calendar-check" /> Réservations
          </h3>
          <p className="aset-section__subtitle">
            Configurez les règles de réservation
          </p>
        </div>
      </div>

      <form className="aset-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="aset-form__row">
          <div className="aset-form__group">
            <label className="aset-form__label">
              Max places par réservation <span className="aset-required">*</span>
            </label>
            <input
              type="number"
              min="1"
              max="60"
              className={`aset-form__input ${errors.maxSeatsPerBooking ? 'aset-form__input--error' : ''}`}
              {...register('maxSeatsPerBooking', { valueAsNumber: true })}
            />
            {errors.maxSeatsPerBooking && (
              <span className="aset-form__error">
                <i className="bi bi-exclamation-circle" />{errors.maxSeatsPerBooking.message}
              </span>
            )}
          </div>
          <div className="aset-form__group">
            <label className="aset-form__label">
              Expiration auto (minutes) <span className="aset-required">*</span>
            </label>
            <input
              type="number"
              min="5"
              max="1440"
              className={`aset-form__input ${errors.autoExpiryMinutes ? 'aset-form__input--error' : ''}`}
              {...register('autoExpiryMinutes', { valueAsNumber: true })}
            />
            {errors.autoExpiryMinutes && (
              <span className="aset-form__error">
                <i className="bi bi-exclamation-circle" />{errors.autoExpiryMinutes.message}
              </span>
            )}
          </div>
        </div>

        <div className="aset-form__row">
          <div className="aset-form__group">
            <label className="aset-form__label">
              Délai d&apos;annulation (heures) <span className="aset-required">*</span>
            </label>
            <input
              type="number"
              min="0"
              max="168"
              className={`aset-form__input ${errors.cancellationDeadlineHours ? 'aset-form__input--error' : ''}`}
              {...register('cancellationDeadlineHours', { valueAsNumber: true })}
            />
            {errors.cancellationDeadlineHours && (
              <span className="aset-form__error">
                <i className="bi bi-exclamation-circle" />{errors.cancellationDeadlineHours.message}
              </span>
            )}
          </div>
          <div className="aset-form__group">
            <label className="aset-form__label">
              Remboursement (%) <span className="aset-required">*</span>
            </label>
            <input
              type="number"
              min="0"
              max="100"
              className={`aset-form__input ${errors.refundPercentage ? 'aset-form__input--error' : ''}`}
              {...register('refundPercentage', { valueAsNumber: true })}
            />
            {errors.refundPercentage && (
              <span className="aset-form__error">
                <i className="bi bi-exclamation-circle" />{errors.refundPercentage.message}
              </span>
            )}
          </div>
        </div>

        <div className="aset-form__row">
          <div className="aset-form__group aset-form__group--full">
            <label className="aset-form__label">
              Politique de remboursement <span className="aset-required">*</span>
            </label>
            <select
              className={`aset-form__select ${errors.refundPolicy ? 'aset-form__input--error' : ''}`}
              {...register('refundPolicy')}
            >
              {refundPolicyOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            {errors.refundPolicy && (
              <span className="aset-form__error">
                <i className="bi bi-exclamation-circle" />{errors.refundPolicy.message}
              </span>
            )}
          </div>
        </div>

        <hr className="aset-form__divider" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <label className="aset-toggle">
            <input type="checkbox" {...register('allowCancellation')} />
            <div className="aset-toggle__track">
              <div className="aset-toggle__thumb" />
            </div>
            <div>
              <div className="aset-toggle__label">Annulation autorisée</div>
              <div className="aset-toggle__desc">Permettre aux clients d&apos;annuler leurs réservations</div>
            </div>
          </label>

          <label className="aset-toggle">
            <input type="checkbox" {...register('instantBooking')} />
            <div className="aset-toggle__track">
              <div className="aset-toggle__thumb" />
            </div>
            <div>
              <div className="aset-toggle__label">Réservation instantanée</div>
              <div className="aset-toggle__desc">Les réservations sont confirmées immédiatement</div>
            </div>
          </label>

          <label className="aset-toggle">
            <input type="checkbox" {...register('manualValidation')} />
            <div className="aset-toggle__track">
              <div className="aset-toggle__thumb" />
            </div>
            <div>
              <div className="aset-toggle__label">Validation manuelle</div>
              <div className="aset-toggle__desc">Les réservations nécessitent une validation manuelle</div>
            </div>
          </label>

          <label className="aset-toggle">
            <input type="checkbox" {...register('autoNumbering')} />
            <div className="aset-toggle__track">
              <div className="aset-toggle__thumb" />
            </div>
            <div>
              <div className="aset-toggle__label">Numérotation automatique</div>
              <div className="aset-toggle__desc">Générer automatiquement les numéros de réservation</div>
            </div>
          </label>
        </div>

        {autoNumbering && (
          <div className="aset-form__row">
            <div className="aset-form__group">
              <label className="aset-form__label">
                Préfixe <span className="aset-required">*</span>
              </label>
              <input
                className={`aset-form__input ${errors.numberPrefix ? 'aset-form__input--error' : ''}`}
                placeholder="Ex: BTC"
                {...register('numberPrefix')}
              />
              {errors.numberPrefix && (
                <span className="aset-form__error">
                  <i className="bi bi-exclamation-circle" />{errors.numberPrefix.message}
                </span>
              )}
            </div>
          </div>
        )}

        <div className="aset-btn-group">
          <button
            type="button"
            className="aset-btn aset-btn--ghost"
            onClick={() => reset({
              maxSeatsPerBooking: data.maxSeatsPerBooking ?? 10,
              autoExpiryMinutes: data.autoExpiryMinutes ?? 30,
              allowCancellation: data.allowCancellation ?? true,
              refundPolicy: data.refundPolicy || 'flexible',
              instantBooking: data.instantBooking ?? true,
              manualValidation: data.manualValidation ?? false,
              autoNumbering: data.autoNumbering ?? true,
              numberPrefix: data.numberPrefix || '',
              cancellationDeadlineHours: data.cancellationDeadlineHours ?? 24,
              refundPercentage: data.refundPercentage ?? 75,
            })}
          >
            <i className="bi bi-arrow-counterclockwise" /> Réinitialiser
          </button>
          <button type="submit" className="aset-btn aset-btn--primary">
            <i className="bi bi-check-lg" /> Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgencyReservationSettings;
