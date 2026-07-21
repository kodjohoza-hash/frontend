import { useState, useCallback } from 'react';
import PaymentService from '@services/paymentService';

const MobileMoneyForm = ({ provider, onValid }) => {
  const [form, setForm] = useState({ phone: '', holderName: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const formatPhone = useCallback((value) => {
    const cleaned = value.replace(/[^0-9]/g, '').slice(0, 12);
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 7) return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(7)}`;
  }, []);

  const handleChange = (field) => (e) => {
    const value = field === 'phone' ? formatPhone(e.target.value) : e.target.value;
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: null }));
  };

  const handleBlur = (field) => () => {
    setTouched((p) => ({ ...p, [field]: true }));
    validate();
  };

  const validate = useCallback(() => {
    const newErrors = {};
    if (!form.phone || form.phone.replace(/\s/g, '').length < 9) {
      newErrors.phone = 'Numero de telephone requis';
    }
    if (!form.holderName || form.holderName.length < 2) {
      newErrors.holderName = 'Nom du titulaire requis';
    }
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    onValid?.(isValid, { phone: form.phone, holderName: form.holderName });
    return isValid;
  }, [form, onValid]);

  const providerLabel = provider === 'mtn_momo' ? 'MTN' : provider === 'orange_money' ? 'Orange' : 'Express Union';

  return (
    <div className="btc-momo-form">
      <div className="mb-3">
        <label className="form-label fw-medium" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
          Numero de telephone {providerLabel}
        </label>
        <div className="input-group">
          <span className="input-group-text" style={{ background: 'var(--color-gray-50)', borderRight: 'none', borderRadius: 'var(--radius-md) 0 0 var(--radius-md)', fontSize: 'var(--font-size-sm)' }}>
            +237
          </span>
          <input
            type="tel"
            className={`form-control ${errors.phone && touched.phone ? 'is-invalid' : ''}`}
            placeholder="6XX XXX XXX"
            value={form.phone}
            onChange={handleChange('phone')}
            onBlur={handleBlur('phone')}
            style={{ borderRadius: '0 var(--radius-md) var(--radius-md) 0', fontSize: 'var(--font-size-sm)', padding: '10px 12px' }}
          />
        </div>
        {errors.phone && touched.phone && (
          <div className="btc-field-error mt-1" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger)' }}>
            <i className="bi bi-exclamation-circle me-1" />
            {errors.phone}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label fw-medium" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
          Nom du titulaire
        </label>
        <input
          type="text"
          className={`form-control ${errors.holderName && touched.holderName ? 'is-invalid' : ''}`}
          placeholder="Ex: Jean Kamga"
          value={form.holderName}
          onChange={handleChange('holderName')}
          onBlur={handleBlur('holderName')}
          style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', padding: '10px 12px' }}
        />
        {errors.holderName && touched.holderName && (
          <div className="btc-field-error mt-1" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger)' }}>
            <i className="bi bi-exclamation-circle me-1" />
            {errors.holderName}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMoneyForm;
