import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockPayments } from '@data/paymentData';
import AgencyPaymentDetails from '@components/agency/AgencyPaymentDetails';
import AgencyPaymentReceipt from '@components/agency/AgencyPaymentReceipt';
import AgencyPaymentSkeleton from '@components/agency/AgencyPaymentSkeleton';

export default function AgencyPaymentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const payment = mockPayments.find((p) => p.id === id);

  if (loading) {
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
              Paiement {payment.id}
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
        onValidate={() => {}}
        onCancel={() => {}}
        onRefund={() => {}}
        timeline={payment.timeline}
      />

      {showReceipt && (
        <AgencyPaymentReceipt
          payment={payment}
          onClose={() => setShowReceipt(false)}
        />
      )}
    </div>
  );
}
