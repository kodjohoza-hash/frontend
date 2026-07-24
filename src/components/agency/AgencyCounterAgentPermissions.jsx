import React from 'react';

const permissionGroupConfig = [
  { group: 'Réservations', perms: ['create_booking', 'edit_booking', 'cancel_booking'] },
  { group: 'Paiements', perms: ['collect_payment'] },
  { group: 'Billetterie', perms: ['print_ticket'] },
  { group: 'Rapports & Stats', perms: ['view_stats', 'access_reports'] },
  { group: 'Clients', perms: ['manage_clients'] },
  { group: 'Équipe', perms: ['manage_agents'] },
  { group: 'Flotte', perms: ['view_trips', 'view_buses'] },
  { group: 'Système', perms: ['manage_settings'] },
];

const allPerms = {
  create_booking: { label: 'Créer une réservation', icon: 'bi-ticket-perforated' },
  edit_booking: { label: 'Modifier une réservation', icon: 'bi-pencil' },
  cancel_booking: { label: 'Annuler une réservation', icon: 'bi-x-circle' },
  collect_payment: { label: 'Encaisser un paiement', icon: 'bi-cash-stack' },
  print_ticket: { label: 'Imprimer un billet', icon: 'bi-printer' },
  view_stats: { label: 'Consulter les statistiques', icon: 'bi-bar-chart-line' },
  manage_clients: { label: 'Gérer les clients', icon: 'bi-people' },
  access_reports: { label: 'Accéder aux rapports', icon: 'bi-file-earmark-bar-graph' },
  manage_agents: { label: 'Gérer les agents', icon: 'bi-person-gear' },
  view_trips: { label: 'Consulter les voyages', icon: 'bi-signpost-2' },
  view_buses: { label: 'Consulter la flotte', icon: 'bi-bus-front' },
  manage_settings: { label: 'Gérer les paramètres', icon: 'bi-gear' },
};

export default function AgencyCounterAgentPermissions({ permissions = [] }) {
  return (
    <div className="add-perms">
      <h4><i className="bi bi-shield-lock" /> Permissions ({permissions.length}/{Object.keys(allPerms).length})</h4>
      <div className="add-perms__grid">
        {permissionGroupConfig.map((grp) => (
          <div key={grp.group} className="add-perms__group">
            <h5 className="add-perms__group-title">{grp.group}</h5>
            {grp.perms.map((key) => {
              const perm = allPerms[key];
              const active = permissions.includes(key);
              return (
                <div key={key} className={`add-perms__item ${active ? 'add-perms__item--active' : 'add-perms__item--inactive'}`}>
                  <i className={`bi ${perm.icon}`} />
                  <span>{perm.label}</span>
                  <span className={`add-perms__indicator ${active ? 'add-perms__indicator--on' : ''}`}>
                    {active ? <i className="bi bi-check-circle-fill" /> : <i className="bi bi-x-circle" />}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
