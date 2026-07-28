import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { paymentSettingsSchema } from '@schemas/settings.schema';

const methodIcon = (id) => {
  const map = {
    om: 'bi-phone',
    momo: 'bi-phone',
    card: 'bi-credit-card',
    cash: 'bi-cash',
    transfer: 'bi-bank',
  };
  return map[id] || 'bi-credit-card';
};

const AgencyPaymentSettings = ({ data, onSave }) => {
  const [methods, setMethods] = useState(
    data.methods || []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paymentSettingsSchema),
    defaultValues: {
      methods: data.methods || [],
      currency: data.currency || 'XAF',
      taxRate: data.taxRate ?? 0,
    },
  });

  const toggleMethod = (id) => {
    setMethods((prev) =>
      prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const updateCommission = (id, value) => {
    setMethods((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, commission: parseFloat(value) || 0 } : m
      )
    );
  };

  const onSubmit = (formData) => {
    onSave({ ...formData, methods });
  };

  return (
    <div className="aset-section">
      <div className="aset-section__header">
        <div className="aset-section__title-group">
          <h3 className="aset-section__title">
            <i className="bi bi-credit-card" /> Paiements
          </h3>
          <p className="aset-section__subtitle">
            Configurez les moyens de paiement
          </p>
        </div>
      </div>

      <form className="aset-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="aset-form__row">
          <div className="aset-form__group">
            <label className="aset-form__label">Devise</label>
            <input
              className="aset-form__input"
              value={data.currency || 'XAF'}
              disabled
              {...register('currency')}
            />
          </div>
          <div className="aset-form__group">
            <label className="aset-form__label">
              Taxe (%) <span className="aset-required">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              className={`aset-form__input ${errors.taxRate ? 'aset-form__input--error' : ''}`}
              {...register('taxRate', { valueAsNumber: true })}
            />
            {errors.taxRate && (
              <span className="aset-form__error">
                <i className="bi bi-exclamation-circle" />{errors.taxRate.message}
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {methods.map((method) => (
            <div key={method.id} className="aset-payment-method">
              <div className="aset-payment-method__icon">
                <i className={`bi ${methodIcon(method.id)}`} />
              </div>
              <div className="aset-payment-method__info">
                <div className="aset-payment-method__name">{method.name}</div>
                <div className="aset-payment-method__desc">
                  {method.enabled ? 'Activé' : 'Désactivé'}
                </div>
              </div>
              <div className="aset-payment-method__commission">
                <label>Commission (%)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={method.commission}
                  onChange={(e) => updateCommission(method.id, e.target.value)}
                />
              </div>
              <label className="aset-toggle">
                <input
                  type="checkbox"
                  checked={method.enabled}
                  onChange={() => toggleMethod(method.id)}
                />
                <div className="aset-toggle__track">
                  <div className="aset-toggle__thumb" />
                </div>
              </label>
            </div>
          ))}
        </div>

        {errors.methods && (
          <span className="aset-form__error">
            <i className="bi bi-exclamation-circle" />{errors.methods.message}
          </span>
        )}

        <div className="aset-btn-group">
          <button type="submit" className="aset-btn aset-btn--primary">
            <i className="bi bi-check-lg" /> Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
};

export default AgencyPaymentSettings;
