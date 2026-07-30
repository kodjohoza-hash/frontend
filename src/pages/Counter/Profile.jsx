import { useState, useEffect, useCallback } from 'react';
import CounterProfileHeader from '@components/counter/CounterProfileHeader';
import CounterProfileStats from '@components/counter/CounterProfileStats';
import CounterProfileInfo from '@components/counter/CounterProfileInfo';
import CounterProfileProfessional from '@components/counter/CounterProfileProfessional';
import CounterProfilePerformance from '@components/counter/CounterProfilePerformance';
import CounterProfileTimeline from '@components/counter/CounterProfileTimeline';
import CounterProfileDocuments from '@components/counter/CounterProfileDocuments';
import CounterProfileLoginHistory from '@components/counter/CounterProfileLoginHistory';
import CounterProfileQuickActions from '@components/counter/CounterProfileQuickActions';
import CounterProfileSkeleton from '@components/counter/CounterProfileSkeleton';
import {
  agentProfile,
  quickActions,
} from '@data/counterProfileData';
import '@assets/styles/counter-profile.css';

const TOAST_DURATION = 3500;

const ProfilePage = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(agentProfile);
  const [showEditModal, setShowEditModal] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, TOAST_DURATION);
  }, []);

  const handleQuickAction = useCallback((actionId) => {
    const messages = {
      edit_profile: { message: 'Ouverture du formulaire de modification du profil', type: 'info' },
      change_password: { message: 'Redirection vers la page de changement de mot de passe', type: 'info' },
      view_notifications: { message: 'Affichage des notifications récentes', type: 'info' },
      open_messages: { message: 'Ouverture de la messagerie interne', type: 'info' },
      contact_supervisor: { message: 'Message envoyé à Jean-Jacques Mvondo', type: 'success' },
      download_documents: { message: 'Téléchargement des documents en cours', type: 'warning' },
    };
    const toast = messages[actionId] || { message: 'Action en cours de développement', type: 'info' };
    addToast(toast.message, toast.type);
  }, [addToast]);

  const openEditModal = useCallback(() => {
    setEditForm({
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone,
      email: profile.email,
      address: profile.address,
    });
    setShowEditModal(true);
  }, [profile]);

  const handleEditSubmit = useCallback((e) => {
    e.preventDefault();
    setProfile((prev) => ({
      ...prev,
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      fullName: `${editForm.firstName} ${editForm.lastName}`,
      phone: editForm.phone,
      email: editForm.email,
      address: editForm.address,
    }));
    setShowEditModal(false);
    addToast('Profil mis à jour avec succès', 'success');
  }, [editForm, addToast]);

  if (loading) {
    return <CounterProfileSkeleton />;
  }

  return (
    <>
      <div className="acpr-wrapper">
        <CounterProfileHeader profile={profile} onEdit={openEditModal} />

        <div className="acpr-section">
          <CounterProfileStats profile={profile} />
        </div>

        <div className="acpr-section">
          <CounterProfileInfo profile={profile} />
        </div>

        <div className="acpr-section">
          <CounterProfileProfessional profile={profile} />
        </div>

        <div className="acpr-section">
          <CounterProfilePerformance profile={profile} />
        </div>

        <div className="acpr-section">
          <CounterProfileTimeline events={profile.recentActivity} />
        </div>

        <div className="acpr-section">
          <CounterProfileDocuments documents={profile.documents} />
        </div>

        <div className="acpr-section">
          <CounterProfileLoginHistory loginHistory={profile.loginHistory} />
        </div>

        <div className="acpr-section">
          <CounterProfileQuickActions actions={quickActions} onAction={handleQuickAction} />
        </div>
      </div>

      {showEditModal && (
        <div className="acpr-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="acpr-modal" onClick={(e) => e.stopPropagation()}>
            <div className="acpr-modal-header">
              <h3 className="acpr-modal-title">Modifier le profil</h3>
              <button className="acpr-modal-close" onClick={() => setShowEditModal(false)}>
                <i className="bi bi-x-lg" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="acpr-modal-body">
                <div className="acpr-field">
                  <label>Prénom</label>
                  <input
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm((f) => ({ ...f, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div className="acpr-field">
                  <label>Nom</label>
                  <input
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm((f) => ({ ...f, lastName: e.target.value }))}
                    required
                  />
                </div>
                <div className="acpr-field">
                  <label>Téléphone</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))}
                    required
                  />
                </div>
                <div className="acpr-field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))}
                    required
                  />
                </div>
                <div className="acpr-field">
                  <label>Adresse</label>
                  <input
                    type="text"
                    value={editForm.address}
                    onChange={(e) => setEditForm((f) => ({ ...f, address: e.target.value }))}
                  />
                </div>
              </div>
              <div className="acpr-modal-footer">
                <button type="button" className="acpr-btn acpr-btn--secondary" onClick={() => setShowEditModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="acpr-btn acpr-btn--primary">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toasts.length > 0 && (
        <div className="acpr-toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className={`acpr-toast acpr-toast--${toast.type}`}>
              <i className={`bi bi-${toast.type === 'success' ? 'check-circle-fill' : toast.type === 'warning' ? 'exclamation-triangle-fill' : 'info-circle-fill'}`} />
              <span>{toast.message}</span>
              <button className="acpr-toast-close" onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}>
                <i className="bi bi-x" />
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ProfilePage;
