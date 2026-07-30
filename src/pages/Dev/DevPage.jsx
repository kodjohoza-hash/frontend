import { DEV_MODE } from '@config/devMode';
import '@assets/styles/dev-banner.css';

const GROUPS = [
  {
    title: 'Frontend Public',
    icon: 'bi-globe',
    links: [
      { label: 'Accueil', to: '/' },
      { label: 'Connexion', to: '/login' },
      { label: 'Inscription', to: '/register' },
      { label: 'Recherche de voyages', to: '/booking/search' },
      { label: 'Sélection de sièges', to: '/booking/seats' },
      { label: 'Informations passager', to: '/booking/passenger' },
      { label: 'Paiement', to: '/booking/payment' },
      { label: 'Confirmation', to: '/booking/confirmation' },
    ],
  },
  {
    title: 'Dashboard Client',
    icon: 'bi-person',
    links: [
      { label: 'Tableau de bord', to: '/client/dashboard' },
      { label: 'Mes réservations', to: '/client/bookings' },
      { label: 'Mes billets', to: '/client/tickets' },
      { label: 'Mon profil', to: '/client/profile' },
      { label: 'Paramètres', to: '/client/settings' },
      { label: 'Centre de support', to: '/client/support' },
      { label: 'Messagerie', to: '/client/messages' },
    ],
  },
  {
    title: 'Dashboard Compagnie',
    icon: 'bi-building',
    links: [
      { label: 'Tableau de bord', to: '/agency/dashboard' },
      { label: 'Trajets', to: '/agency/routes' },
      { label: 'Voyages', to: '/agency/trips' },
      { label: 'Bus', to: '/agency/buses' },
      { label: 'Chauffeurs', to: '/agency/drivers' },
      { label: 'Réservations', to: '/agency/bookings' },
      { label: 'Paiements', to: '/agency/payments' },
      { label: 'Clients', to: '/agency/clients' },
      { label: 'Guichets', to: '/agency/counters' },
      { label: 'Points de vente', to: '/agency/branches' },
      { label: 'Agents de guichet', to: '/agency/counter-agents' },
      { label: 'Rapports', to: '/agency/reports' },
      { label: 'Paramètres', to: '/agency/settings' },
      { label: 'Notifications', to: '/agency/notifications' },
      { label: 'Messagerie', to: '/agency/messages' },
    ],
  },
  {
    title: 'Dashboard Agent de Guichet',
    icon: 'bi-person-workspace',
    links: [
      { label: 'Tableau de bord', to: '/counter/dashboard' },
      { label: 'Vente', to: '/counter/sale' },
      { label: 'Réservations', to: '/counter/bookings' },
      { label: 'Scan billets', to: '/counter/tickets' },
      { label: 'Paiements', to: '/counter/payments' },
      { label: 'Clients', to: '/counter/customers' },
      { label: 'Notifications', to: '/counter/notifications' },
      { label: 'Messagerie', to: '/counter/messages' },
      { label: 'Profil', to: '/counter/profile' },
      { label: 'Paramètres', to: '/counter/settings' },
    ],
  },
  {
    title: 'Dashboard Super Administrateur',
    icon: 'bi-shield-lock',
    links: [
      { label: 'Tableau de bord', to: '/super-admin/dashboard' },
      { label: 'Compagnies', to: '/super-admin/companies' },
      { label: 'Utilisateurs', to: '/super-admin/users' },
      { label: 'Rôles & Permissions', to: '/super-admin/roles' },
      { label: 'Approbations', to: '/super-admin/approval' },
      { label: 'Abonnements', to: '/super-admin/subscriptions' },
      { label: 'Commissions', to: '/super-admin/commissions' },
      { label: 'Rapports BI', to: '/super-admin/reports' },
      { label: 'Audit & Surveillance', to: '/super-admin/audit' },
      { label: 'Notifications', to: '/super-admin/notifications' },
      { label: 'Centre de support', to: '/super-admin/support' },
      { label: 'Intégrations & API', to: '/super-admin/integrations' },
      { label: 'Sauvegarde & Reprise', to: '/super-admin/backup' },
      { label: 'IA & Automatisation', to: '/super-admin/ai' },
      { label: 'Paramètres', to: '/super-admin/settings' },
    ],
  },
];

export default function DevPage() {
  if (!DEV_MODE) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'Inter, sans-serif', color: '#6B7280' }}>
        <h2 style={{ color: '#1E1B4B' }}>Mode développement désactivé</h2>
        <p>Activez DEV_MODE dans src/config/devMode.js pour accéder à ce portail.</p>
      </div>
    );
  }

  return (
    <div className="dev-portal">
      <div className="dev-portal__header">
        <h1>
          <i className="bi bi-tools" style={{ marginRight: '0.5rem' }} />
          BUS TIX CONNECT — Portail de Développement
        </h1>
        <p>
          Accédez à toutes les interfaces du projet sans authentification.
          Désactivez DEV_MODE dans <code style={{ background: 'rgba(255,255,255,0.15)', padding: '0.125rem 0.375rem', borderRadius: 4 }}>src/config/devMode.js</code> pour restaurer la sécurité.
        </p>
      </div>
      <div className="dev-portal__content">
        <div className="dev-portal__grid">
          {GROUPS.map((group) => (
            <div className="dev-card" key={group.title}>
              <div className="dev-card__header">
                <h2><i className={group.icon} />{group.title}</h2>
              </div>
              <div className="dev-card__body">
                {group.links.map((link) => (
                  <a key={link.to} className="dev-card__link" href={link.to}>
                    {link.label}
                    <i className="bi bi-chevron-right" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
