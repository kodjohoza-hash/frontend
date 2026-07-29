import { useState } from 'react';

const INPUT_TYPES = [
  { key: 'reference', label: 'Référence', placeholder: 'BTC-DLA-YDE-001', icon: 'bi-upc-scan' },
  { key: 'qrCode', label: 'QR Code', placeholder: 'BTC-DLA-YDE-001-ABC123', icon: 'bi-qr-code' },
  { key: 'barcode', label: 'Code-barres', placeholder: '5901234567890', icon: 'bi-upc-scan' },
];

const CounterScannerManual = ({ onLookup, scanning }) => {
  const [mode, setMode] = useState('reference');
  const [value, setValue] = useState('');

  const current = INPUT_TYPES.find((t) => t.key === mode);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) onLookup?.(value.trim());
  };

  return (
    <div className="acv-manual">
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {INPUT_TYPES.map((t) => (
          <button
            key={t.key}
            style={{
              flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid #E5E7EB',
              background: mode === t.key ? '#FEF3E8' : '#fff',
              color: mode === t.key ? '#FF6B35' : '#6B7280',
              fontWeight: mode === t.key ? 600 : 500,
              fontSize: 12, cursor: 'pointer', transition: 'all 0.2s',
            }}
            onClick={() => setMode(t.key)}
          >
            <i className={`bi ${t.icon}`} style={{ marginRight: 4 }} />
            {t.label}
          </button>
        ))}
      </div>

      <form className="acv-manual-form" onSubmit={handleSubmit}>
        <div className="acv-manual-group">
          <label className="acv-manual-label">{current.label}</label>
          <input
            className="acv-manual-input"
            placeholder={current.placeholder}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoFocus
          />
        </div>
        <div className="acv-manual-actions">
          <button type="submit" className="acv-btn acv-btn-primary" disabled={!value.trim() || scanning}>
            <i className="bi bi-search" /> Rechercher
          </button>
          <button type="button" className="acv-btn acv-btn-secondary" onClick={() => setValue('')}>
            <i className="bi bi-x-lg" /> Effacer
          </button>
        </div>
      </form>
    </div>
  );
};

export default CounterScannerManual;
