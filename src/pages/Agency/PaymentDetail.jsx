import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import usePaymentStore from '@store/payment.store';
import AgencyPaymentDetails from '@components/agency/AgencyPaymentDetails';
import AgencyPaymentReceipt from '@components/agency/AgencyPaymentReceipt';
import AgencyPaymentSkeleton from '@components/agency/AgencyPaymentSkeleton';

export default function AgencyPaymentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    payment,
    loadingDetail,
    fetchPayment,
    confirmPayment,
    cancelPayment,
    refundPayment,
  } = usePaymentStore();
  const [showReceipt, setShowReceipt] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    fetchPayment(id).catch(() => {});
  }, [id, fetchPayment]);

  const addToast = useCallback((message, type = 'success') => {
    const toastId = Date.now();
    setToasts((prev) => [...prev, { id: toastId, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== toastId)), 3500);
  }, []);

  const handleValidate = async () => {
    const result = await confirmPayment(payment.id);
    if (!result.ok) return addToast(result.error || 'Échec de la validation', 'error');
    addToast(result.message || 'Paiement validé');
  };

  const handleCancel = async () => {
    const motif = window.prompt(`Motif d'annulation du paiement ${payment.reference} :`, '');
    if (motif === null) return;
    if (!motif) return addToast('Le motif est requis', 'error');
    const result = await cancelPayment(payment.id, motif);
    if (!result.ok) return addToast(result.error || "Échec de l'annulation", 'error');
    addToast(result.message || 'Paiement annulé');
  };

  const handleRefund = async () => {
    const montantStr = window.prompt(`Montant à rembourser (max ${payment.totalPaid} FCFA) :`, String(payment.totalPaid));
    if (montantStr === null) return;
    const montant = Number(montantStr);
    if (!Number.isFinite(montant) || montant <= 0 || montant > payment.totalPaid) {
      return addToast('Montant invalide', 'error');
    }
    const motif = window.prompt('Motif du remboursement :', '') || '';
    const result = await refundPayment(payment.id, { montant, motif });
    if (!result.ok) return addToast(result.error || 'Échec du remboursement', 'error');
    addToast(result.message || `Remboursement de ${montant.toLocaleString('fr-FR')} FCFA effectué`);
  };

  if (loadingDetail && !payment) {
    return <AgencyPaymentSkeleton />;
  }

  if (!payment) {
    return (
      <div className="ap-page">
        <div className="ap-page__empty">
          <i className="bi bi-credit-card" />
          <h2>Paiement introuvable</h2>
          <p>Le paiement avec l'identifiant « {id} » n'existe pas.</p>
          <button className="ap-btn ap-btn--primary" onClick={() => navigate('/agency/payments')}>
            <i className="bi bi-arrow-left" />
            Retour aux paiements
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ap-page">
      <div className="ap-page__header">
        <div className="ap-page__title-group">
          <button
            className="ap-btn ap-btn--outline ap-btn--sm"
            onClick={() => navigate('/agency/payments')}
          >
            <i className="bi bi-arrow-left" />
          </button>
          <div>
            <h1 className="ap-page__title">
              <i className="bi bi-credit-card" />
              Paiement {payment.reference}
            </h1>
            <div className="ap-page__subtitle">
              {payment.route} — {payment.client.firstName} {payment.client.lastName}
            </div>
          </div>
        </div>
        <div className="ap-page__actions">
          <button className="ap-btn ap-btn--outline" type="button" onClick={() => setShowReceipt(true)}>
            <i className="bi bi-receipt" />
            Voir le reçu
          </button>
        </div>
      </div>

      <AgencyPaymentDetails
        payment={payment}
        onBack={() => navigate('/agency/payments')}
        onEdit={() => {}}
        onValidate={handleValidate}
        onCancel={handleCancel}
        onRefund={handleRefund}
        timeline={payment.timeline}
      />

      {showReceipt && (
        <AgencyPaymentReceipt
          payment={payment}
          onClose={() => setShowReceipt(false)}
        />
      )}

      {toasts.length > 0 && (
        <div className="ap-toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`ap-toast ap-toast-${toast.type}`}>
              <i className={`bi ${toast.type === 'success' ? 'bi-check-circle-fill' : toast.type === 'error' ? 'bi-x-circle-fill' : 'bi-info-circle-fill'}`} />
              {toast.message}
              <button className="ap-toast-close" onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}>
                <i className="bi bi-x-lg" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
