import { useParams, useNavigate } from 'react-router-dom';
import { mockClients } from '@data/clientData';
import AgencyClientProfile from '@components/agency/AgencyClientProfile';
import AgencyClientSkeleton from '@components/agency/AgencyClientSkeleton';

export default function AgencyClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const client = mockClients.find((c) => c.id === id);

  if (!client) {
    return (
      <div className="ac-page">
        <div className="ac-page__empty">
          <i className="bi bi-person-x" />
          <h2>Client introuvable</h2>
          <p>Le client avec l'identifiant « {id} » n'existe pas.</p>
          <button className="ac-btn ac-btn--primary" onClick={() => navigate('/agency/clients')}>
            <i className="bi bi-arrow-left" />
            Retour aux clients
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ac-page">
      <AgencyClientProfile
        client={client}
        onBack={() => navigate('/agency/clients')}
        onEdit={() => {}}
        onViewBookings={() => {}}
        onViewTickets={() => {}}
        onViewPayments={() => {}}
        onContact={() => {}}
      />
    </div>
  );
}
