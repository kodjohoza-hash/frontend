import { useState } from 'react';

const CounterScannerCamera = ({ onScan, scanning, onScanStart }) => {
  const [simulating, setSimulating] = useState(false);

  const handleCapture = () => {
    setSimulating(true);
    onScanStart?.();
    setTimeout(() => {
      setSimulating(false);
      onScan?.('camera');
    }, 1800);
  };

  return (
    <div>
      <div className="acv-camera">
        {simulating ? (
          <div className="acv-scanning-overlay">
            <div className="acv-scanning-spinner" />
            <div className="acv-scanning-text">Analyse du QR Code…</div>
          </div>
        ) : (
          <div className="acv-camera-overlay">
            <div className="acv-camera-frame">
              <div className="acv-camera-line" />
            </div>
            <div className="acv-camera-status">
              <strong>Caméra prête</strong><br />
              Placez le QR Code dans le cadre
            </div>
          </div>
        )}
      </div>
      <div className="acv-camera-actions">
        <button className="acv-camera-btn acv-camera-btn-capture" onClick={handleCapture} disabled={simulating || scanning}>
          <i className="bi bi-camera" />
          {simulating ? 'Analyse…' : 'Scanner'}
        </button>
        <button className="acv-camera-btn acv-camera-btn-secondary" disabled>
          <i className="bi bi-lightning" /> Flash
        </button>
      </div>
    </div>
  );
};

export default CounterScannerCamera;
