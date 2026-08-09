import { useState, useRef, useEffect, useCallback } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QR_CONFIG = { fps: 10, qrbox: { width: 240, height: 240 }, aspectRatio: 1.0 };

/**
 * Scanner caméra réel (html5-qrcode).
 * Décodage purement local : le texte décodé est transmis à `onScan`,
 * puis TOUTE la validation est effectuée côté backend (l'appareil ne
 * fait jamais confiance au contenu du QR).
 */
const CounterScannerCamera = ({ onScan, onScanStart }) => {
  const [active, setActive] = useState(false);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState(null);
  const scannerRef = useRef(null);
  const [elId] = useState(() => `acv-qr-${Math.random().toString(36).slice(2, 9)}`);

  useEffect(
    () => () => {
      const s = scannerRef.current;
      if (s && s.isScanning) s.stop().catch(() => {});
    },
    []
  );

  const start = useCallback(async () => {
    setError(null);
    setStarting(true);
    onScanStart?.();
    try {
      const scanner = new Html5Qrcode(elId);
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        QR_CONFIG,
        (decodedText) => {
          scanner.stop().catch(() => {});
          scannerRef.current = null;
          setActive(false);
          onScan?.(decodedText);
        },
        () => {}
      );
      setActive(true);
    } catch {
      scannerRef.current = null;
      setActive(false);
      setError('Caméra indisponible ou accès refusé. Utilisez la saisie manuelle.');
    } finally {
      setStarting(false);
    }
  }, [elId, onScan, onScanStart]);

  const stop = useCallback(() => {
    const s = scannerRef.current;
    if (s && s.isScanning) {
      s.stop().catch(() => {});
      scannerRef.current = null;
    }
    setActive(false);
  }, []);

  return (
    <div>
      <div className="acv-camera">
        <div id={elId} className="acv-camera-video" />
        {!active && !error && (
          <div className="acv-camera-overlay">
            {starting ? (
              <>
                <div className="acv-scanning-spinner" />
                <div className="acv-scanning-text">Initialisation de la caméra…</div>
              </>
            ) : (
              <>
                <div className="acv-camera-frame">
                  <div className="acv-camera-line" />
                </div>
                <div className="acv-camera-status">
                  <strong>Caméra prête</strong><br />
                  Placez le QR Code dans le cadre
                </div>
              </>
            )}
          </div>
        )}
        {error && (
          <div className="acv-camera-overlay">
            <div className="acv-camera-error">
              <i className="bi bi-camera-video-off" style={{ fontSize: 28, display: 'block', marginBottom: 8 }} />
              {error}
            </div>
          </div>
        )}
      </div>
      <div className="acv-camera-actions">
        {!active ? (
          <button className="acv-camera-btn acv-camera-btn-capture" onClick={start} disabled={starting}>
            <i className="bi bi-camera" />
            {starting ? 'Démarrage…' : 'Scanner'}
          </button>
        ) : (
          <button className="acv-camera-btn acv-camera-btn-secondary" onClick={stop}>
            <i className="bi bi-stop-fill" /> Arrêter
          </button>
        )}
        {error && (
          <button className="acv-camera-btn acv-camera-btn-secondary" onClick={() => setError(null)}>
            <i className="bi bi-arrow-clockwise" /> Réessayer
          </button>
        )}
      </div>
    </div>
  );
};

export default CounterScannerCamera;
