/* ══════════════════════════════════════════════════════════════
   AI & AUTOMATION CENTER — Bus Tix Connect Super Admin
   Ready for OpenAI, Gemini, Claude, Mistral, n8n, Zapier, Express.js
   ══════════════════════════════════════════════════════════════ */

/* ─── KPI ─── */
export const aiKPI = {
  activeAutomations: { label: 'Automatisations actives', value: 18, trend: 5, icon: 'fa-robot', color: '#8B5CF6' },
  inactiveAutomations: { label: 'Automatisations désactivées', value: 6, trend: -3, icon: 'fa-circle-pause', color: '#6B7280' },
  executionsToday: { label: 'Exécutions aujourd\'hui', value: 2458, trend: 18, icon: 'fa-bolt', color: '#3B82F6' },
  timeSaved: { label: 'Temps gagné', value: 128, suffix: 'h', trend: 22, icon: 'fa-clock', color: '#10B981' },
  aiSuggestions: { label: 'Suggestions IA', value: 47, trend: 12, icon: 'fa-wand-magic-sparkles', color: '#F59E0B' },
  smartAlerts: { label: 'Alertes intelligentes', value: 12, trend: -4, icon: 'fa-bell', color: '#EF4444' },
  activeWorkflows: { label: 'Workflows actifs', value: 14, trend: 3, icon: 'fa-diagram-project', color: '#EC4899' },
  failures: { label: 'Échecs', value: 8, trend: -2, icon: 'fa-triangle-exclamation', color: '#F97316' },
};

/* ─── Categories ─── */
export const aiCategories = [
  { id: 'automation', label: 'Automatisation', icon: 'fa-robot', color: '#8B5CF6' },
  { id: 'assistant', label: 'Assistant', icon: 'fa-wand-magic-sparkles', color: '#3B82F6' },
  { id: 'workflow', label: 'Workflow', icon: 'fa-diagram-project', color: '#10B981' },
  { id: 'suggestion', label: 'Suggestion', icon: 'fa-lightbulb', color: '#F59E0B' },
  { id: 'analytics', label: 'Analyse prédictive', icon: 'fa-chart-line', color: '#EC4899' },
];

/* ─── Statuses ─── */
export const aiStatuses = [
  { id: 'active', label: 'Actif', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  { id: 'inactive', label: 'Inactif', color: '#6B7280', bg: 'rgba(107,114,128,0.12)' },
  { id: 'error', label: 'Erreur', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  { id: 'training', label: 'En apprentissage', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
];

/* ─── Assistants ─── */
export const aiAssistants = [
  { id: 'ast_001', name: 'Assistant Support', description: 'Répond automatiquement aux tickets de support et suggère des solutions.', model: 'GPT-4o', status: 'active', lastActive: '2026-07-30 08:45', accuracy: 94, requests: 12850, createdAt: '2026-01-15', category: 'support', icon: 'fa-headset', color: '#3B82F6', capabilities: ['Répondre aux tickets', 'Suggérer des solutions', 'Classifier les priorités', 'Langage naturel'] },
  { id: 'ast_002', name: 'Assistant Réservation', description: 'Aide les clients à trouver et réserver des trajets intelligemment.', model: 'GPT-4o', status: 'active', lastActive: '2026-07-30 09:00', accuracy: 97, requests: 28450, createdAt: '2026-01-15', category: 'booking', icon: 'fa-ticket', color: '#10B981', capabilities: ['Recherche intelligente', 'Recommandations trajets', 'Optimisation prix', 'Suggestions horaires'] },
  { id: 'ast_003', name: 'Assistant Analyse', description: 'Analyse les tendances et génère des rapports automatiques.', model: 'Gemini Pro', status: 'active', lastActive: '2026-07-30 07:30', accuracy: 92, requests: 6840, createdAt: '2026-02-01', category: 'analytics', icon: 'fa-chart-bar', color: '#8B5CF6', capabilities: ['Analyse tendances', 'Génération rapports', 'Détection anomalies', 'Prévisions'] },
  { id: 'ast_004', name: 'Assistant Sécurité', description: 'Surveille les activités suspectes et alerte en temps réel.', model: 'Claude 3.5', status: 'active', lastActive: '2026-07-30 09:00', accuracy: 99, requests: 15200, createdAt: '2026-01-20', category: 'security', icon: 'fa-shield', color: '#EF4444', capabilities: ['Détection intrusion', 'Analyse comportementale', 'Alertes sécurité', 'Blocage automatique'] },
  { id: 'ast_005', name: 'Assistant Paiement', description: 'Gère les transactions et détecte les fraudes potentielles.', model: 'GPT-4o', status: 'active', lastActive: '2026-07-30 08:50', accuracy: 96, requests: 22400, createdAt: '2026-01-15', category: 'payment', icon: 'fa-credit-card', color: '#F59E0B', capabilities: ['Détection fraude', 'Validation transactions', 'Remboursements auto', 'Analyse risques'] },
  { id: 'ast_006', name: 'Assistant Marketing', description: 'Génère des campagnes et suggestions marketing personnalisées.', model: 'Gemini Pro', status: 'inactive', lastActive: '2026-07-28 16:00', accuracy: 88, requests: 3250, createdAt: '2026-03-01', category: 'marketing', icon: 'fa-megaphone', color: '#EC4899', capabilities: ['Campagnes email', 'Segmentation clients', 'A/B testing', 'Analyse ROI'] },
  { id: 'ast_007', name: 'Assistant Gestion', description: 'Optimise la gestion des ressources et du personnel.', model: 'Mistral Large', status: 'training', lastActive: null, accuracy: 0, requests: 0, createdAt: '2026-07-15', category: 'management', icon: 'fa-users-gear', color: '#14B8A6', capabilities: ['Planification', 'Optimisation ressources', 'Gestion personnel', 'Reporting'] },
  { id: 'ast_008', name: 'Assistant Finance', description: 'Analyse les finances et génère des prévisions budgétaires.', model: 'DeepSeek V3', status: 'inactive', lastActive: '2026-06-30 12:00', accuracy: 91, requests: 4800, createdAt: '2026-02-15', category: 'finance', icon: 'fa-coins', color: '#F97316', capabilities: ['Prévisions budgétaires', 'Analyse coûts', 'Optimisation dépenses', 'Reporting financier'] },
];

/* ─── Automations ─── */
export const automations = [
  { id: 'aut_001', name: 'Confirmation réservation', category: 'booking', trigger: 'Réservation créée', action: 'Envoyer email + SMS', status: 'active', lastRun: '2026-07-30 09:00', runs: 28450, successRate: 99.8, creator: 'Admin Guillaume', createdAt: '2026-01-01', description: 'Envoie automatiquement une confirmation par email et SMS.' },
  { id: 'aut_002', name: 'Notification annulation', category: 'booking', trigger: 'Réservation annulée', action: 'Envoyer email + Remboursement', status: 'active', lastRun: '2026-07-30 08:45', runs: 1250, successRate: 99.5, creator: 'Admin Guillaume', createdAt: '2026-01-05', description: 'Notifie le client et initie le remboursement automatique.' },
  { id: 'aut_003', name: 'Confirmation paiement', category: 'payment', trigger: 'Paiement reçu', action: 'Mettre à jour statut + Notifier', status: 'active', lastRun: '2026-07-30 08:50', runs: 22400, successRate: 100, creator: 'Admin Guillaume', createdAt: '2026-01-01', description: 'Met à jour le statut de la réservation après paiement.' },
  { id: 'aut_004', name: 'Alerte échec paiement', category: 'payment', trigger: 'Paiement échoué', action: 'Notifier client + Admin', status: 'active', lastRun: '2026-07-30 08:30', runs: 890, successRate: 98, creator: 'Admin Guillaume', createdAt: '2026-01-10', description: 'Alerte le client et l\'administrateur en cas d\'échec.' },
  { id: 'aut_005', name: 'Validation compagnie', category: 'company', trigger: 'Compagnie validée', action: 'Email bienvenue + Activer compte', status: 'active', lastRun: '2026-07-29 16:30', runs: 24, successRate: 100, creator: 'Admin Guillaume', createdAt: '2026-01-15', description: 'Envoie un email de bienvenue et active les accès.' },
  { id: 'aut_006', name: 'Bienvenue nouvel utilisateur', category: 'user', trigger: 'Utilisateur créé', action: 'Email bienvenue + Guide', status: 'active', lastRun: '2026-07-30 08:15', runs: 12847, successRate: 99.9, creator: 'Admin Guillaume', createdAt: '2026-01-01', description: 'Envoie un email de bienvenue avec guide de démarrage.' },
  { id: 'aut_007', name: 'Notification push mobile', category: 'notification', trigger: 'Notification créée', action: 'Push FCM + Email', status: 'active', lastRun: '2026-07-30 08:20', runs: 45200, successRate: 97, creator: 'Admin Guillaume', createdAt: '2026-01-20', description: 'Distribue les notifications via Firebase Cloud Messaging.' },
  { id: 'aut_008', name: 'Export automatique rapports', category: 'report', trigger: 'Planification (hebdo)', action: 'Générer PDF + Envoyer email', status: 'active', lastRun: '2026-07-27 06:00', runs: 32, successRate: 100, creator: 'Admin Douala', createdAt: '2026-02-01', description: 'Génère et envoie les rapports hebdomadaires aux admins.' },
  { id: 'aut_009', name: 'Sauvegarde automatique', category: 'system', trigger: 'Planification (quotidien)', action: 'Backup complet + Notification', status: 'active', lastRun: '2026-07-30 03:00', runs: 212, successRate: 97.5, creator: 'Admin Guillaume', createdAt: '2026-01-01', description: 'Déclenche une sauvegarde complète quotidienne.' },
  { id: 'aut_010', name: 'Rapport mensuel BI', category: 'report', trigger: 'Planification (mensuel)', action: 'Générer rapport + Email dirigeants', status: 'inactive', lastRun: '2026-07-01 06:00', runs: 7, successRate: 100, creator: 'Admin Douala', createdAt: '2026-01-01', description: 'Génère le rapport mensuel Business Intelligence.' },
  { id: 'aut_011', name: 'Détection fraude paiement', category: 'payment', trigger: 'Transaction suspecte', action: 'Bloquer + Alerte équipe', status: 'active', lastRun: '2026-07-29 22:15', runs: 156, successRate: 95, creator: 'Admin Guillaume', createdAt: '2026-03-01', description: 'Détecte et bloque les transactions frauduleuses.' },
  { id: 'aut_012', name: 'Relance réservation abandonnée', category: 'booking', trigger: 'Panier abandonné (>30min)', action: 'Email relance + SMS', status: 'training', lastRun: null, runs: 0, successRate: 0, creator: 'Admin Guillaume', createdAt: '2026-07-20', description: 'Relance les clients ayant abandonné leur réservation.' },
];

/* ─── Workflows ─── */
export const workflows = [
  { id: 'wf_001', name: 'Onboarding client', trigger: 'Inscription client', conditions: ['Email vérifié'], actions: ['Créer compte', 'Envoyer email bienvenue', 'Attribuer promo'], status: 'active', lastRun: '2026-07-30 08:00', runs: 12847, version: 'v2.1', creator: 'Admin Guillaume', createdAt: '2026-01-01', description: 'Processus d\'accueil complet pour les nouveaux clients.' },
  { id: 'wf_002', name: 'Validation compagnie', trigger: 'Enregistrement compagnie', conditions: ['Documents validés', 'Paiement reçu'], actions: ['Activer compte', 'Notifier admin', 'Envoyer credentials'], status: 'active', lastRun: '2026-07-29 16:00', runs: 24, version: 'v1.3', creator: 'Admin Guillaume', createdAt: '2026-01-15', description: 'Validation et activation des comptes compagnie.' },
  { id: 'wf_003', name: 'Gestion réclamation', trigger: 'Ticket support créé', conditions: ['Priorité haute'], actions: ['Assigner agent', 'Notifier superviseur', 'Créer tâche suivi'], status: 'active', lastRun: '2026-07-30 07:30', runs: 1850, version: 'v2.0', creator: 'Admin Douala', createdAt: '2026-02-01', description: 'Traitement prioritaire des réclamations clients.' },
  { id: 'wf_004', name: 'Détection et blocage fraude', trigger: 'Transaction > 500k XAF', conditions: ['Pays différent', 'Nouvel appareil'], actions: ['Bloquer transaction', 'Alerte sécurité', 'Notify client'], status: 'active', lastRun: '2026-07-29 22:00', runs: 890, version: 'v3.1', creator: 'Admin Guillaume', createdAt: '2026-01-20', description: 'Workflow de sécurité pour les transactions à risque.' },
  { id: 'wf_005', name: 'Campagne marketing automatisée', trigger: 'Planification (mensuel)', conditions: ['Segment > 100 clients'], actions: ['Générer liste', 'Créer campagne email', 'Analyser résultats'], status: 'inactive', lastRun: '2026-06-01 08:00', runs: 6, version: 'v1.0', creator: 'Admin Yaoundé', createdAt: '2026-03-01', description: 'Campagne marketing mensuelle automatisée.' },
  { id: 'wf_006', name: 'Sauvegarde et vérification', trigger: 'Planification (quotidien 03:00)', conditions: ['Espace disque > 10%'], actions: ['Backup complet', 'Vérifier intégrité', 'Notifier résultat'], status: 'active', lastRun: '2026-07-30 03:00', runs: 212, version: 'v2.2', creator: 'Admin Guillaume', createdAt: '2026-01-01', description: 'Sauvegarde automatique avec vérification d\'intégrité.' },
  { id: 'wf_007', name: 'Rapport hebdomadaire BI', trigger: 'Planification (lundi 06:00)', conditions: ['Données complètes'], actions: ['Collecter données', 'Générer PDF', 'Envoyer dirigeants'], status: 'active', lastRun: '2026-07-27 06:00', runs: 32, version: 'v1.5', creator: 'Admin Douala', createdAt: '2026-02-01', description: 'Génération et distribution du rapport BI hebdomadaire.' },
];

/* ─── Trigger Types ─── */
export const triggerTypes = [
  { id: 'creation', label: 'Création', icon: 'fa-plus' },
  { id: 'modification', label: 'Modification', icon: 'fa-pen' },
  { id: 'deletion', label: 'Suppression', icon: 'fa-trash' },
  { id: 'payment', label: 'Paiement', icon: 'fa-credit-card' },
  { id: 'login', label: 'Connexion', icon: 'fa-right-to-bracket' },
  { id: 'registration', label: 'Inscription', icon: 'fa-user-plus' },
  { id: 'validation', label: 'Validation', icon: 'fa-check-circle' },
  { id: 'schedule', label: 'Planification', icon: 'fa-calendar-clock' },
  { id: 'webhook', label: 'Webhook', icon: 'fa-plug' },
  { id: 'api', label: 'API', icon: 'fa-code' },
];

/* ─── Action Types ─── */
export const actionTypes = [
  { id: 'email', label: 'Envoyer Email', icon: 'fa-envelope', color: '#3B82F6' },
  { id: 'sms', label: 'Envoyer SMS', icon: 'fa-message', color: '#8B5CF6' },
  { id: 'notification', label: 'Créer Notification', icon: 'fa-bell', color: '#F59E0B' },
  { id: 'report', label: 'Créer Rapport', icon: 'fa-file-pdf', color: '#EF4444' },
  { id: 'ticket', label: 'Créer Ticket', icon: 'fa-ticket', color: '#10B981' },
  { id: 'block', label: 'Bloquer Compte', icon: 'fa-ban', color: '#EC4899' },
  { id: 'backup', label: 'Créer Sauvegarde', icon: 'fa-database', color: '#14B8A6' },
  { id: 'api_call', label: 'Appeler API', icon: 'fa-cloud', color: '#F97316' },
  { id: 'webhook', label: 'Webhook', icon: 'fa-plug', color: '#6366F1' },
];

/* ─── AI Suggestions ─── */
export const aiSuggestions = [
  { id: 'sug_001', title: 'Optimisation des réservations', description: 'Augmentez le taux de conversion de 15% en optimisant les horaires des trajets Douala-Yaoundé.', impact: 'high', category: 'booking', status: 'new', confidence: 92 },
  { id: 'sug_002', title: 'Campagne marketing ciblée', description: 'Les clients de Yaoundé réservent surtout le vendredi. Lancez une campagne SMS promo le jeudi.', impact: 'medium', category: 'marketing', status: 'new', confidence: 87 },
  { id: 'sug_003', title: 'Compagnies performantes', description: 'Express Bus Cameroun a 94% de satisfaction. Utilisez leur modèle pour les autres compagnies.', impact: 'high', category: 'management', status: 'reviewed', confidence: 95 },
  { id: 'sug_004', title: 'Voyages peu rentables', description: 'La ligne Bamenda-Bafoussam a un taux de remplissage de 32%. Envisagez de réduire la fréquence.', impact: 'high', category: 'analytics', status: 'new', confidence: 88 },
  { id: 'sug_005', title: 'Prévisions de remplissage', description: 'Le taux de remplissage atteindra 92% en décembre. Prévoyez des bus supplémentaires.', impact: 'medium', category: 'booking', status: 'implemented', confidence: 90 },
  { id: 'sug_006', title: 'Détection d\'anomalies', description: '3 transactions suspectes détectées cette semaine depuis des IP inhabituelles.', impact: 'critical', category: 'security', status: 'new', confidence: 97 },
  { id: 'sug_007', title: 'Optimisation des prix', description: 'Augmenter les prix de 10% sur les trajets de nuit pourrait augmenter les revenus de 8%.', impact: 'medium', category: 'analytics', status: 'reviewed', confidence: 82 },
  { id: 'sug_008', title: 'Réduction des annulations', description: 'Envoyer un rappel SMS 2h avant le départ réduit les annulations de 25%.', impact: 'high', category: 'booking', status: 'new', confidence: 93 },
];

/* ─── Predictive Analytics ─── */
export const predictiveAnalytics = {
  bookings: [
    { month: 'Aoû', actual: 18200, predicted: 19500 },
    { month: 'Sep', actual: null, predicted: 21000 },
    { month: 'Oct', actual: null, predicted: 22800 },
    { month: 'Nov', actual: null, predicted: 24500 },
    { month: 'Déc', actual: null, predicted: 28000 },
  ],
  revenue: [
    { month: 'Aoû', actual: 34200000, predicted: 36500000 },
    { month: 'Sep', actual: null, predicted: 39000000 },
    { month: 'Oct', actual: null, predicted: 42000000 },
    { month: 'Nov', actual: null, predicted: 45500000 },
    { month: 'Déc', actual: null, predicted: 52000000 },
  ],
  commissions: [
    { month: 'Aoû', actual: 1710000, predicted: 1825000 },
    { month: 'Sep', actual: null, predicted: 1950000 },
    { month: 'Oct', actual: null, predicted: 2100000 },
    { month: 'Nov', actual: null, predicted: 2275000 },
    { month: 'Déc', actual: null, predicted: 2600000 },
  ],
  growth: [
    { month: 'Aoû', users: 920, companies: 22, agents: 62 },
    { month: 'Sep', users: 1050, companies: 25, agents: 70 },
    { month: 'Oct', users: 1180, companies: 28, agents: 80 },
    { month: 'Nov', users: 1320, companies: 31, agents: 90 },
    { month: 'Déc', users: 1500, companies: 35, agents: 105 },
  ],
  traffic: [
    { month: 'Aoû', visits: 85000, api: 380000 },
    { month: 'Sep', visits: 95000, api: 420000 },
    { month: 'Oct', visits: 105000, api: 460000 },
    { month: 'Nov', visits: 115000, api: 500000 },
    { month: 'Déc', visits: 140000, api: 580000 },
  ],
};

/* ─── History ─── */
export const aiHistory = [
  { id: 'hst_001', type: 'creation', title: 'Assistant Support activé', description: 'Assistant IA Support déployé avec le modèle GPT-4o', user: 'Admin Guillaume', time: '2026-01-15T10:00:00' },
  { id: 'hst_002', type: 'creation', title: 'Assistant Réservation activé', description: 'Assistant IA Réservation déployé avec le modèle GPT-4o', user: 'Admin Guillaume', time: '2026-01-15T10:30:00' },
  { id: 'hst_003', type: 'execution', title: 'Automatisation confirmation réservation', description: 'Exécution #28450 — 100% succès', user: 'Système', time: '2026-07-30T09:00:00' },
  { id: 'hst_004', type: 'error', title: 'Échec automatisation paiement', description: 'Échec de l\'automatisation #aut_004 — API de paiement indisponible', user: 'Système', time: '2026-07-30T08:30:00' },
  { id: 'hst_005', type: 'modification', title: 'Workflow onboarding mis à jour', description: 'Version v2.1 — Ajout condition email vérifié', user: 'Admin Douala', time: '2026-07-15T14:00:00' },
  { id: 'hst_006', type: 'activation', title: 'Assistant Gestion en apprentissage', description: 'Nouvel assistant en phase d\'entraînement — modèle Mistral Large', user: 'Admin Guillaume', time: '2026-07-15T09:00:00' },
  { id: 'hst_007', type: 'creation', title: 'Automatisation relance panier', description: 'Nouvelle automatisation pour les paniers abandonnés', user: 'Admin Guillaume', time: '2026-07-20T11:00:00' },
  { id: 'hst_008', type: 'execution', title: 'Suggestion IA implémentée', description: 'Optimisation des prix appliquée — +8% revenus attendu', user: 'Admin Guillaume', time: '2026-07-22T10:00:00' },
  { id: 'hst_009', type: 'deletion', title: 'Ancien workflow supprimé', description: 'Workflow campagne marketing v1.0 archivé', user: 'Admin Yaoundé', time: '2026-07-01T12:00:00' },
  { id: 'hst_010', type: 'error', title: 'Assistant Marketing désactivé', description: 'Taux de précision insuffisant — réentraînement requis', user: 'Système', time: '2026-07-28T16:00:00' },
];

/* ─── Default Filters ─── */
export const defaultAIFilters = { search: '', category: '', status: '' };

/* ─── Filter Helpers ─── */
export const filterAI = (items, filters) => {
  return items.filter(i => {
    if (filters.search) { const s = filters.search.toLowerCase(); if (!i.name?.toLowerCase().includes(s) && !i.description?.toLowerCase().includes(s)) return false; }
    if (filters.category && i.category !== filters.category) return false;
    if (filters.status && i.status !== filters.status) return false;
    return true;
  });
};
