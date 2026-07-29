import { useState, useCallback } from 'react';
import CounterScannerStats from '@components/counter/CounterScannerStats';
import CounterScannerCamera from '@components/counter/CounterScannerCamera';
import CounterScannerManual from '@components/counter/CounterScannerManual';
import CounterTicketSearch from '@components/counter/CounterTicketSearch';
import CounterTicketResult from '@components/counter/CounterTicketResult';
import CounterBoardingConfirmation from '@components/counter/CounterBoardingConfirmation';
import CounterScannerHistory from '@components/counter/CounterScannerHistory';
import CounterScannerAlerts from '@components/counter/CounterScannerAlerts';
import CounterScannerSkeleton from '@components/counter/CounterScannerSkeleton';
import { tickets, findTicket, randomScanResult, playSound, vibrateDevice } from '@data/counterScannerData';

const CounterScannerPage = () => {
  const [loading, setLoading] = useState(true);
  const [scanMode, setScanMode] = useState('camera');
  const [scanning, setScanning] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [showBoarding, setShowBoarding] = useState(null);
  const [boardingType, setBoardingType] = useState('success');
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [toasts, setToasts] = useState([]);

  useState(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  });

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const addAlert = useCallback((type, message) => {
    setAlerts((prev) => [...prev, { type, message }]);
    setTimeout(() => setAlerts((prev) => prev.slice(1)), 5000);
  }, []);

  const addHistoryEntry = useCallback((ticket, result) => {
    setHistory((prev) => [
      {
        reference: ticket.reference,
        passengerName: ticket.passenger.name,
        phone: ticket.passenger.phone,
        from: ticket.trip.from,
        to: ticket.trip.to,
        scannedAt: new Date().toISOString(),
        result,
        agent: 'Kodjo Jojo',
      },
      ...prev,
    ]);
  }, []);

  const handleScanResult = useCallback((ticket) => {
    if (!ticket) {
      setCurrentTicket(null);
      addAlert('unknown', 'Aucun billet trouvé. Vérifiez le code scanné.');
      playSound('error');
      vibrateDevice(200);
      addToast('Billet introuvable', 'error');
      return;
    }

    setCurrentTicket(ticket);

    if (ticket.status === 'valid') {
      playSound('success');
      vibrateDevice(50);
      addToast(`Billet ${ticket.reference} — ${ticket.passenger.name}`, 'success');
    } else if (['cancelled', 'expired', 'unknown'].includes(ticket.status)) {
      playSound('error');
      vibrateDevice(200);
      addAlert(ticket.status, `${ticket.passenger.name} — ${ticket.reference}`);
      addToast(`Billet ${ticket.status}`, 'error');
    } else if (ticket.status === 'used') {
      playSound('error');
      vibrateDevice(150);
      addAlert('used', `${ticket.passenger.name} — billet déjà utilisé`);
      addToast('Billet déjà utilisé', 'error');
    } else if (ticket.status === 'refunded') {
      playSound('error');
      addAlert('refunded', `${ticket.passenger.name} — billet remboursé`);
      addToast('Billet remboursé', 'info');
    } else if (ticket.status === 'unpaid') {
      playSound('error');
      addAlert('unpaid', `${ticket.passenger.name} — paiement non effectué`);
      addToast('Paiement non effectué', 'error');
    }

    addHistoryEntry(ticket, ticket.status === 'valid' ? 'boarded' : ticket.status);
  }, [addToast, addAlert, addHistoryEntry]);

  const handleScan = useCallback((source) => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      const ticket = randomScanResult();
      handleScanResult(ticket);
    }, 1800);
  }, [handleScanResult]);

  const handleManualLookup = useCallback((value) => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      const ticket = findTicket(value);
      handleScanResult(ticket);
    }, 600);
  }, [handleScanResult]);

  const handleTicketSelect = useCallback((ticket) => {
    handleScanResult(ticket);
  }, [handleScanResult]);

  const handleAction = useCallback((action, ticket) => {
    switch (action) {
      case 'board':
        setBoardingType('success');
        setShowBoarding(ticket);
        playSound('success');
        vibrateDevice(50);
        addToast(`${ticket.passenger.name} a embarqué`, 'success');
        setCurrentTicket((prev) => prev ? { ...prev, status: 'used', verifiedAt: new Date().toISOString(), verifiedBy: 'Kodjo Jojo' } : prev);
        addHistoryEntry(ticket, 'boarded');
        break;
      case 'refuse':
        setBoardingType('error');
        setShowBoarding(ticket);
        playSound('error');
        vibrateDevice(200);
        addToast('Embarquement refusé', 'error');
        addHistoryEntry(ticket, 'refused');
        break;
      case 'details':
        addToast('Détails du billet', 'info');
        break;
      case 'print':
        addToast('Impression en cours', 'info');
        break;
      case 'history':
        addToast('Affichage de l\'historique', 'info');
        break;
      default:
        break;
    }
  }, [addToast, addHistoryEntry]);

  const handleDismissAlert = useCallback((index) => {
    setAlerts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  if (loading) return <CounterScannerSkeleton />;

  return (
    <div className="acv-wrapper">
      {/* Header */}
      <div className="acv-header">
        <div className="acv-header-left">
          <h1 className="acv-title">Contrôle des billets</h1>
          <p className="acv-subtitle">
            Scannez, vérifiez et validez l'embarquement des passagers en temps réel.
          </p>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <CounterScannerAlerts alerts={alerts} onDismiss={handleDismissAlert} />
        </div>
      )}

      {/* Stats */}
      <CounterScannerStats />

      {/* Search */}
      <div style={{ marginBottom: 20, marginTop: 20 }}>
        <CounterTicketSearch onSelect={handleTicketSelect} />
      </div>

      {/* Main Grid */}
      <div className="acv-main-grid">
        {/* Scanner Panel */}
        <div className="acv-scanner-panel">
          <div className="acv-scanner-tabs">
            <button
              className={`acv-scanner-tab ${scanMode === 'camera' ? 'active' : ''}`}
              onClick={() => setScanMode('camera')}
            >
              <i className="bi bi-camera" /> Caméra
            </button>
            <button
              className={`acv-scanner-tab ${scanMode === 'manual' ? 'active' : ''}`}
              onClick={() => setScanMode('manual')}
            >
              <i className="bi bi-keyboard" /> Saisie manuelle
            </button>
          </div>

          {scanMode === 'camera' ? (
            <CounterScannerCamera onScan={handleScan} scanning={scanning} onScanStart={() => setScanning(true)} />
          ) : (
            <CounterScannerManual onLookup={handleManualLookup} scanning={scanning} />
          )}
        </div>

        {/* Ticket Result */}
        <div className="acv-result-panel">
          <CounterTicketResult ticket={currentTicket} onAction={handleAction} />
        </div>
      </div>

      {/* History */}
      <CounterScannerHistory history={history} onSelect={handleTicketSelect} />

      {/* Boarding Confirmation Modal */}
      {showBoarding && (
        <CounterBoardingConfirmation
          type={boardingType}
          ticket={showBoarding}
          onClose={() => setShowBoarding(null)}
          onAction={handleAction}
        />
      )}

      {/* Toasts */}
      {toasts.length > 0 && (
        <div className="acv-toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`acv-toast acv-toast-${toast.type}`}>
              <i className={`bi ${toast.type === 'success' ? 'bi-check-circle-fill' : toast.type === 'error' ? 'bi-x-circle-fill' : 'bi-info-circle-fill'} acv-toast-icon`} />
              {toast.message}
              <button className="acv-toast-close" onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}>
                <i className="bi bi-x" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CounterScannerPage;
