import { useState, useCallback } from 'react';
import CounterScannerStats from '@components/counter/CounterScannerStats';
import CounterScannerCamera from '@components/counter/CounterScannerCamera';
import CounterScannerManual from '@components/counter/CounterScannerManual';
import CounterTicketSearch from '@components/counter/CounterTicketSearch';
import CounterTicketResult from '@components/counter/CounterTicketResult';
import CounterBoardingConfirmation from '@components/counter/CounterBoardingConfirmation';
import CounterScannerHistory from '@components/counter/CounterScannerHistory';
import CounterScannerAlerts from '@components/counter/CounterScannerAlerts';
import CounterScannerHistoryModal from '@components/counter/CounterScannerHistoryModal';
import ticketService from '@services/ticket.service';
import useAuthStore from '@store/auth.store';
import {
  mapApiTicket,
  mapCodeToStatus,
  extractToken,
  playSound,
  vibrateDevice,
} from '@data/ticketScanner';

const STATUS_TO_ALERT = {
  valid: null,
  boarded: 'boarded',
  refused: 'refused',
  used: 'used',
  expired: 'expired',
  cancelled: 'cancelled',
  refunded: 'refunded',
  unpaid: 'unpaid',
  unknown: 'unknown',
  wrong_company: 'wrong_company',
};

const CounterScannerPage = () => {
  const user = useAuthStore((s) => s.user);
  const agentName = user?.firstName || user?.lastName
    ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
    : (user?.email || 'Agent');

  const [scanMode, setScanMode] = useState('camera');
  const [scanning, setScanning] = useState(false);
  const [currentTicket, setCurrentTicket] = useState(null);
  const [currentResult, setCurrentResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [boarding, setBoarding] = useState(null); // { type, ticket }
  const [historyModal, setHistoryModal] = useState(null); // { ticket, entries, loading, error }

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
    if (!ticket) return;
    setHistory((prev) => [
      {
        reference: ticket.reference,
        passengerName: ticket.passenger?.name || '',
        phone: ticket.passenger?.phone || '',
        from: ticket.trip?.from || '',
        to: ticket.trip?.to || '',
        scannedAt: new Date().toISOString(),
        result,
        agent: agentName,
      },
      ...prev,
    ]);
  }, [agentName]);

  const applyResult = useCallback(({ valide, code, raison, billet }) => {
    const ticket = mapApiTicket(billet);
    const status = mapCodeToStatus(code);
    setCurrentTicket(ticket);
    setCurrentResult({ valide: !!valide, code, raison });

    if (valide) {
      playSound('success');
      vibrateDevice(50);
      addToast(`Billet ${ticket.reference} — ${ticket.passenger.name}`, 'success');
    } else {
      playSound('error');
      vibrateDevice(200);
      const alertType = STATUS_TO_ALERT[status] || 'unknown';
      addAlert(alertType, `${ticket?.passenger?.name || ''} — ${raison || 'Billet non valide'}`);
      addToast(raison || 'Billet non valide', 'error');
    }
    addHistoryEntry(ticket, status);
  }, [addToast, addAlert, addHistoryEntry]);

  const handleVerifyToken = useCallback(async (token) => {
    setScanning(true);
    try {
      const data = await ticketService.verifyToken(token);
      setScanning(false);
      applyResult(data);
    } catch (err) {
      setScanning(false);
      playSound('error');
      vibrateDevice(200);
      addAlert('unknown', err.message || 'Erreur réseau');
      addToast('Vérification impossible', 'error');
    }
  }, [applyResult, addAlert, addToast]);

  const handleLookup = useCallback(async (query) => {
    setScanning(true);
    try {
      const data = await ticketService.search(query, 1, 5);
      setScanning(false);
      const items = (data.items || []).map(mapApiTicket);
      if (!items.length) {
        setCurrentTicket(null);
        setCurrentResult(null);
        playSound('error');
        vibrateDevice(200);
        addAlert('unknown', 'Aucun billet trouvé. Vérifiez la référence saisie.');
        addToast('Billet introuvable', 'error');
        return;
      }
      const ticket = items.find((t) => t.reference.toLowerCase() === query.toLowerCase()) || items[0];
      setCurrentTicket(ticket);
      setCurrentResult(null);
      if (ticket.status === 'valid') {
        playSound('success');
        vibrateDevice(50);
        addToast(`Billet ${ticket.reference} — ${ticket.passenger.name}`, 'success');
      } else {
        playSound('error');
        vibrateDevice(200);
        addAlert(STATUS_TO_ALERT[ticket.status] || 'unknown', `${ticket.passenger.name} — billet ${ticket.statut || ticket.status}`);
        addToast(`Billet ${ticket.statut || ticket.status}`, 'error');
      }
      addHistoryEntry(ticket, ticket.status);
    } catch (err) {
      setScanning(false);
      playSound('error');
      vibrateDevice(200);
      addAlert('unknown', err.message || 'Erreur réseau');
      addToast('Recherche impossible', 'error');
    }
  }, [addToast, addAlert, addHistoryEntry]);

  const handleScanInput = useCallback((input) => {
    const token = extractToken(input);
    if (token) {
      handleVerifyToken(token);
    } else if (input) {
      handleLookup(input);
    }
  }, [handleVerifyToken, handleLookup]);

  const handleScan = useCallback((decodedText) => {
    handleScanInput(decodedText);
  }, [handleScanInput]);

  const handleManualLookup = useCallback((value) => {
    handleScanInput(value);
  }, [handleScanInput]);

  const handleTicketSelect = useCallback((ticket) => {
    setCurrentTicket(ticket);
    setCurrentResult(null);
  }, []);

  const handleBoard = useCallback(async (ticket) => {
    setScanning(true);
    try {
      const data = await ticketService.checkIn(ticket.id);
      setScanning(false);
      const updated = mapApiTicket(data.ticket);
      setCurrentTicket(updated);

      if (data.boarded) {
        playSound('success');
        vibrateDevice(50);
        addToast(`${updated.passenger.name} a embarqué`, 'success');
        setCurrentResult({ valide: true, code: data.code || 'VALID', raison: null });
        setBoarding({ type: 'success', ticket: updated });
        addHistoryEntry(updated, 'boarded');
      } else {
        playSound('error');
        vibrateDevice(200);
        addAlert(STATUS_TO_ALERT[mapCodeToStatus(data.code)] || 'refused', data.raison || 'Embarquement refusé');
        addToast(data.raison || 'Embarquement refusé', 'error');
        setBoarding({ type: 'error', ticket: updated, reason: data.raison });
        addHistoryEntry(updated, 'refused');
      }
    } catch (err) {
      setScanning(false);
      playSound('error');
      vibrateDevice(200);
      addAlert('refused', err.message || 'Embarquement impossible');
      addToast(err.message || 'Embarquement impossible', 'error');
    }
  }, [addToast, addAlert, addHistoryEntry]);

  const handlePrint = useCallback(async (ticket) => {
    try {
      const blob = await ticketService.pdf(ticket.id);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `billet-${ticket.reference}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      addToast(`Billet ${ticket.reference} imprimé`, 'info');
    } catch {
      addToast('Impression impossible', 'error');
    }
  }, [addToast]);

  const handleHistory = useCallback(async (ticket) => {
    setHistoryModal({ ticket, entries: [], loading: true, error: null });
    try {
      const data = await ticketService.checkInHistory(ticket.id);
      setHistoryModal({ ticket, entries: data.items || [], loading: false, error: null });
    } catch (err) {
      setHistoryModal({ ticket, entries: [], loading: false, error: err.message || 'Erreur réseau' });
    }
  }, []);

  const handleAction = useCallback((action, ticket) => {
    switch (action) {
      case 'board':
        handleBoard(ticket);
        break;
      case 'history':
        handleHistory(ticket);
        break;
      case 'print':
        handlePrint(ticket);
        break;
      case 'refuse':
        addToast('Embarquement refusé', 'info');
        break;
      default:
        break;
    }
  }, [handleBoard, handleHistory, handlePrint, addToast]);

  const handleDismissAlert = useCallback((index) => {
    setAlerts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  return (
    <div className="acv-wrapper">
      <div className="acv-header">
        <div className="acv-header-left">
          <h1 className="acv-title">Contrôle des billets</h1>
          <p className="acv-subtitle">
            Scannez, vérifiez et validez l'embarquement des passagers en temps réel.
          </p>
        </div>
      </div>

      {alerts.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <CounterScannerAlerts alerts={alerts} onDismiss={handleDismissAlert} />
        </div>
      )}

      <CounterScannerStats />

      <div style={{ marginBottom: 20, marginTop: 20 }}>
        <CounterTicketSearch onSelect={handleTicketSelect} />
      </div>

      <div className="acv-main-grid">
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
            <CounterScannerCamera onScan={handleScan} onScanStart={() => setScanning(true)} />
          ) : (
            <CounterScannerManual onLookup={handleManualLookup} scanning={scanning} />
          )}
        </div>

        <div className="acv-result-panel">
          <CounterTicketResult ticket={currentTicket} result={currentResult} onAction={handleAction} />
        </div>
      </div>

      <CounterScannerHistory history={history} onSelect={handleTicketSelect} />

      {boarding && (
        <CounterBoardingConfirmation
          type={boarding.type}
          ticket={boarding.ticket}
          reason={boarding.reason}
          onClose={() => setBoarding(null)}
          onAction={handleAction}
        />
      )}

      {historyModal && (
        <CounterScannerHistoryModal
          ticket={historyModal.ticket}
          entries={historyModal.entries}
          loading={historyModal.loading}
          error={historyModal.error}
          onClose={() => setHistoryModal(null)}
        />
      )}

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
