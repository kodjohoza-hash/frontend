import { useState, useCallback } from 'react';

const CreditCardForm = ({ onValid }) => {
  const [form, setForm] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const formatCardNumber = useCallback((value) => {
    const cleaned = value.replace(/[^0-9]/g, '').slice(0, 16);
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
  }, []);

  const formatExpiry = useCallback((value) => {
    const cleaned = value.replace(/[^0-9]/g, '').slice(0, 4);
    if (cleaned.length >= 3) return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    return cleaned;
  }, []);

  const handleChange = (field) => (e) => {
    let value = e.target.value;
    if (field === 'number') value = formatCardNumber(value);
    if (field === 'expiry') value = formatExpiry(value);
    if (field === 'cvv') value = value.replace(/[^0-9]/g, '').slice(0, 4);
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: null }));
  };

  const handleBlur = (field) => () => {
    setTouched((p) => ({ ...p, [field]: true }));
  };

  const getCardType = () => {
    const num = form.number.replace(/\s/g, '');
    if (num.startsWith('4')) return 'visa';
    if (num.startsWith('5') || num.startsWith('2')) return 'mastercard';
    return null;
  };

  const cardType = getCardType();

  return (
    <div className="btc-card-form">
      <div className="mb-3">
        <label className="form-label fw-medium" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
          Nom sur la carte
        </label>
        <input
          type="text"
          className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
          placeholder="JEAN KAMGA"
          value={form.name}
          onChange={handleChange('name')}
          onBlur={handleBlur('name')}
          autoComplete="cc-name"
          style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', padding: '10px 12px', textTransform: 'uppercase' }}
        />
        {errors.name && touched.name && (
          <div className="btc-field-error mt-1" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger)' }}>
            <i className="bi bi-exclamation-circle me-1" />{errors.name}
          </div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label fw-medium" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
          Numero de carte
        </label>
        <div className="input-group">
          <span className="input-group-text" style={{ background: 'var(--color-gray-50)', borderRadius: 'var(--radius-md) 0 0 var(--radius-md)', fontSize: '1rem' }}>
            {cardType === 'visa' ? (
              <span style={{ fontWeight: 800, color: '#1A1F71', fontStyle: 'italic' }}>VISA</span>
            ) : cardType === 'mastercard' ? (
              <span style={{ fontWeight: 800, color: '#EB001B' }}>MC</span>
            ) : (
              <i className="bi bi-credit-card" style={{ color: 'var(--text-muted)' }} />
            )}
          </span>
          <input
            type="text"
            className={`form-control ${errors.number && touched.number ? 'is-invalid' : ''}`}
            placeholder="0000 0000 0000 0000"
            value={form.number}
            onChange={handleChange('number')}
            onBlur={handleBlur('number')}
            autoComplete="cc-number"
            style={{ borderRadius: '0 var(--radius-md) var(--radius-md) 0', fontSize: 'var(--font-size-sm)', padding: '10px 12px', letterSpacing: '0.1em' }}
          />
        </div>
        {errors.number && touched.number && (
          <div className="btc-field-error mt-1" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger)' }}>
            <i className="bi bi-exclamation-circle me-1" />{errors.number}
          </div>
        )}
      </div>

      <div className="row g-3">
        <div className="col-6">
          <label className="form-label fw-medium" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
            Expiration
          </label>
          <input
            type="text"
            className={`form-control ${errors.expiry && touched.expiry ? 'is-invalid' : ''}`}
            placeholder="MM/AA"
            value={form.expiry}
            onChange={handleChange('expiry')}
            onBlur={handleBlur('expiry')}
            autoComplete="cc-exp"
            style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', padding: '10px 12px' }}
          />
          {errors.expiry && touched.expiry && (
            <div className="btc-field-error mt-1" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger)' }}>
              <i className="bi bi-exclamation-circle me-1" />{errors.expiry}
            </div>
          )}
        </div>
        <div className="col-6">
          <label className="form-label fw-medium" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--text-secondary)' }}>
            CVV
          </label>
          <div className="input-group">
            <input
              type="password"
              className={`form-control ${errors.cvv && touched.cvv ? 'is-invalid' : ''}`}
              placeholder="***"
              value={form.cvv}
              onChange={handleChange('cvv')}
              onBlur={handleBlur('cvv')}
              autoComplete="cc-csc"
              style={{ borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', padding: '10px 12px' }}
            />
          </div>
          {errors.cvv && touched.cvv && (
            <div className="btc-field-error mt-1" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-danger)' }}>
              <i className="bi bi-exclamation-circle me-1" />{errors.cvv}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreditCardForm;
