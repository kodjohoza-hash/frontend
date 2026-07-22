import React, { useState, useCallback } from 'react';

const keyframes = `
  @keyframes btcErrorSlide {
    from { opacity: 0; transform: translateY(-6px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 4,
  },
  titleIcon: (color) => ({
    width: 32,
    height: 32,
    borderRadius: 'var(--radius-md)',
    background: color || 'var(--color-primary)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontSize: '0.85rem',
  }),
  title: {
    fontSize: '0.95rem',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  providerBadge: (color) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 10px',
    borderRadius: 'var(--radius-md)',
    background: color || 'var(--color-gray-100)',
    color: '#fff',
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.04em',
  }),
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: '0.78rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    letterSpacing: '0.01em',
  },
  inputRow: {
    display: 'flex',
    alignItems: 'center',
    borderRadius: 'var(--radius-md)',
    border: '2px solid var(--color-gray-200)',
    background: '#fff',
    overflow: 'hidden',
    transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
  },
  inputRowFocus: {
    borderColor: 'var(--color-primary)',
    boxShadow: '0 0 0 3px rgba(11, 29, 81, 0.1)',
  },
  prefix: {
    padding: '10px 12px',
    fontSize: '0.85rem',
    fontWeight: 600,
    color: 'var(--text-secondary)',
    background: 'var(--color-gray-50)',
    borderRight: '2px solid var(--color-gray-200)',
    userSelect: 'none',
    whiteSpace: 'nowrap',
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    fontSize: '0.85rem',
    border: 'none',
    outline: 'none',
    background: 'transparent',
    color: 'var(--text-primary)',
    letterSpacing: '0.06em',
    fontFamily: 'inherit',
  },
  inputPlain: {
    width: '100%',
    padding: '10px 14px',
    fontSize: '0.85rem',
    border: '2px solid var(--color-gray-200)',
    borderRadius: 'var(--radius-md)',
    outline: 'none',
    background: '#fff',
    color: 'var(--text-primary)',
    transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
    fontFamily: 'inherit',
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    gap: 5,
    fontSize: '0.72rem',
    color: 'var(--color-danger)',
    marginTop: 4,
    animation: 'btcErrorSlide 0.3s ease',
  },
};

const MobileMoneyForm = React.memo(({ provider, onValid }) => {
  const [form, setForm] = useState({ phone: '', holderName: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [focused, setFocused] = useState({});

  const providerInfo = {
    mtn_momo: { label: 'MTN', color: '#FFCC00', initials: 'MTN' },
    orange_money: { label: 'Orange', color: '#FF6600', initials: 'OM' },
    express_union: { label: 'Express Union', color: '#E31837', initials: 'EU' },
  };

  const currentProvider = providerInfo[provider] || providerInfo.mtn_momo;

  const formatPhone = useCallback((value) => {
    const cleaned = value.replace(/[^0-9]/g, '').slice(0, 9);
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};
    if (!form.phone || form.phone.replace(/\s/g, '').length < 9) {
      newErrors.phone = 'Numéro de téléphone requis (9 chiffres)';
    }
    if (!form.holderName || form.holderName.length < 2) {
      newErrors.holderName = 'Nom du titulaire requis';
    }
    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    onValid?.(isValid, { phone: form.phone, holderName: form.holderName });
    return isValid;
  }, [form, onValid]);

  const handleChange = (field) => (e) => {
    const value = field === 'phone' ? formatPhone(e.target.value) : e.target.value;
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: null }));
  };

  const handleBlur = (field) => () => {
    setTouched((p) => ({ ...p, [field]: true }));
    setFocused((p) => ({ ...p, [field]: false }));
    validate();
  };

  const handleFocus = (field) => () => {
    setFocused((p) => ({ ...p, [field]: true }));
  };

  return (
    <>
      <style>{keyframes}</style>
      <div style={styles.container}>
        <div style={styles.titleRow}>
          <div style={styles.titleIcon(currentProvider.color)}>
            <i className="bi bi-phone-fill" />
          </div>
          <span style={styles.title}>Informations Mobile Money</span>
        </div>

        <div style={styles.providerBadge(currentProvider.color)}>
          <i className="bi bi-phone-fill" style={{ fontSize: '0.65rem' }} />
          {currentProvider.label}
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor={`phone-${provider}`}>
            Numéro de téléphone {currentProvider.label}
          </label>
          <div
            style={{
              ...styles.inputRow,
              ...(focused.phone ? styles.inputRowFocus : {}),
            }}
          >
            <span style={styles.prefix}>+237</span>
            <input
              id={`phone-${provider}`}
              type="tel"
              style={styles.input}
              placeholder="6XX XXX XXX"
              value={form.phone}
              onChange={handleChange('phone')}
              onBlur={handleBlur('phone')}
              onFocus={handleFocus('phone')}
              aria-label={`Numéro de téléphone ${currentProvider.label}`}
              aria-invalid={!!errors.phone}
              autoComplete="tel-national"
            />
          </div>
          {errors.phone && touched.phone && (
            <div style={styles.error}>
              <i className="bi bi-exclamation-circle-fill" />
              {errors.phone}
            </div>
          )}
        </div>

        <div style={styles.fieldGroup}>
          <label style={styles.label} htmlFor={`holder-${provider}`}>
            Nom du titulaire
          </label>
          <input
            id={`holder-${provider}`}
            type="text"
            style={{
              ...styles.inputPlain,
              ...(focused.holderName
                ? { borderColor: 'var(--color-primary)', boxShadow: '0 0 0 3px rgba(11, 29, 81, 0.1)' }
                : {}),
              ...(errors.holderName && touched.holderName
                ? { borderColor: 'var(--color-danger)' }
                : {}),
            }}
            placeholder="Ex : Jean Kamga"
            value={form.holderName}
            onChange={handleChange('holderName')}
            onBlur={handleBlur('holderName')}
            onFocus={handleFocus('holderName')}
            aria-label="Nom du titulaire du compte"
            aria-invalid={!!errors.holderName}
            autoComplete="name"
          />
          {errors.holderName && touched.holderName && (
            <div style={styles.error}>
              <i className="bi bi-exclamation-circle-fill" />
              {errors.holderName}
            </div>
          )}
        </div>
      </div>
    </>
  );
});

export default MobileMoneyForm;
