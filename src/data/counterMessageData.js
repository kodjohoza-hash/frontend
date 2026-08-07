/* ============================================
   ACM — Agent de Guichet Messagerie
   Fichier de données simulées
   Préfixe CSS : acm-
   ============================================ */

// ─── ULID générateur ───────────────────────────
const ULID_CHARS = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

export function generateConvId() {
  const timestamp = Date.now().toString(36).toUpperCase().padStart(10, '0');
  const random = Array.from({ length: 16 }, () =>
    ULID_CHARS[Math.floor(Math.random() * ULID_CHARS.length)]
  ).join('');
  return `${timestamp}${random}`;
}

// ─── Datetime helpers (locale fr) ──────────────
const dateFormat = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric', month: 'long', year: 'numeric',
});
const timeFormat = new Intl.DateTimeFormat('fr-FR', {
  hour: '2-digit', minute: '2-digit',
});
const shortDateFormat = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric', month: 'short',
});
const dayMonthFormat = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric', month: 'long',
});

export function formatDate(iso) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now - d;
  const oneDay = 86400000;
  if (diff < oneDay && d.getDate() === now.getDate()) return "Aujourd'hui";
  if (diff < 2 * oneDay && d.getDate() === now.getDate() - 1) return 'Hier';
  if (diff < 7 * oneDay) return shortDateFormat.format(d);
  return dateFormat.format(d);
}

export function formatTime(iso) {
  return timeFormat.format(new Date(iso));
}

// ─── Profil utilisateur courant ────────────────
export const currentUser = {
  id: 'AGT-001',
  name: 'Marie Ngo',
  role: 'Agent de guichet',
  phone: '+237691234567',
  email: 'marie.ngo@bustixconnect.cm',
  avatar: null,
  branch: 'Douala Central',
  company: 'Express Bus Cameroun',
  status: 'online',
};

// ─── Helpers internes ──────────────────────────
let _msgCounter = 0;
function mid() { return `msg-${String(++_msgCounter).padStart(4, '0')}`; }

function msg({ senderId, text, date, status = 'sent', reactions = [], replyTo = null, attachments = [], isEdited = false, isPinned = false, isDeleted = false }) {
  return { id: mid(), senderId, text, date, status, reactions, replyTo, attachments, isEdited, isPinned, isDeleted };
}

function participant(name, role, company, branch, status, extra = {}) {
  return {
    name,
    role,
    phone: extra.phone || '+2376XXXXXXXX',
    email: extra.email || `${name.toLowerCase().replace(/\s/g, '.')}@bustixconnect.cm`,
    avatar: null,
    company,
    branch,
    status,
    lastActivity: extra.lastActivity || new Date().toISOString(),
    ...extra,
  };
}

function fileObj(name, size, type, date) {
  return { name, size, type, url: '#', date };
}

function conv(id, participant, messages, unreadCount, folder, isImportant, sharedFiles = []) {
  const lastMessage = messages.length > 0 ? { text: messages[messages.length - 1].text, date: messages[messages.length - 1].date, senderId: messages[messages.length - 1].senderId, status: messages[messages.length - 1].status } : { text: '', date: new Date().toISOString(), senderId: participant.id, status: 'sent' };
  return { id, participant, lastMessage, unreadCount, folder, isImportant, messages, sharedFiles };
}

// ─── Séquence temporelle de la dernière semaine ──
const now = Date.now();
function ago(days, hours = 0, minutes = 0) {
  return new Date(now - (days * 86400000 + hours * 3600000 + minutes * 60000)).toISOString();
}

// ─── 15 conversations ──────────────────────────
const AGT = currentUser.id;

export const conversations = [
  // 1 ── Paul Bello (support technique) ── inbox / important
  conv('conv-001', { id: 'SUP-042', ...participant('Paul Bello', 'Support technique', 'Express Bus Cameroun', 'Yaoundé Mvan', 'online', { phone: '+237699876543', email: 'paul.bello@support-ebc.cm', lastActivity: ago(0, 0, 15) }) }, [
    msg({ senderId: 'SUP-042', text: 'Bonjour Marie. Nous avons bien reçu votre ticket concernant le dysfonctionnement du terminal de paiement au guichet 3.', date: ago(6, 10) }),
    msg({ senderId: AGT, text: 'Bonjour Paul. Oui, depuis hier après-midi le terminal affiche "Erreur de connexion" après chaque tentative.', date: ago(6, 9, 30) }),
    msg({ senderId: 'SUP-042', text: 'Pouvez-vous redémarrer l\'appareil et me tenir au courant ?', date: ago(6, 9) }),
    msg({ senderId: AGT, text: 'J\'ai déjà essayé trois fois. Le problème persiste.', date: ago(6, 8, 30) }),
    msg({ senderId: 'SUP-042', text: 'Je comprends. Un technicien passera demain matin entre 8h et 10h.', date: ago(5, 14) }),
    msg({ senderId: AGT, text: 'Parfait. Je serai là. Merci.', date: ago(5, 13, 30) }),
    msg({ senderId: 'SUP-042', text: 'Technicien affecté : Joseph Mbah. Il aura une tablette de remplacement.', date: ago(4, 10) }),
    msg({ senderId: 'SUP-042', text: 'Petit rappel : il faudra signer le bon d\'intervention.', date: ago(3, 9) }),
    msg({ senderId: AGT, text: 'Noté. Merci pour le suivi.', date: ago(3, 8, 45) }),
    msg({ senderId: 'SUP-042', text: 'De rien. Tenez-moi au courant après son passage.', date: ago(1, 11) }),
    msg({ senderId: AGT, text: 'Intervention terminée. Nouveau terminal installé et fonctionnel ✅', date: ago(0, 2, 30) }),
    msg({ senderId: 'SUP-042', text: 'Excellente nouvelle ! Je clos le ticket. Bonne journée.', date: ago(0, 2) }),
  ], 0, 'inbox', true),

  // 2 ── Fatimatou Ali (cliente) ── unread
  conv('conv-002', { id: 'CLT-832', ...participant('Fatimatou Ali', 'Client', '', 'Douala', 'offline', { phone: '+237655443322', email: 'fatimatou.a@gmail.com', lastActivity: ago(0, 3) }) }, [
    msg({ senderId: 'CLT-832', text: 'Bonjour. J\'ai réservé un billet pour Yaoundé ce vendredi mais je ne reçois pas le SMS de confirmation.', date: ago(1, 5) }),
    msg({ senderId: AGT, text: 'Bonjour Fatimatou. Puis-je avoir votre numéro de réservation ?', date: ago(1, 4, 30) }),
    msg({ senderId: 'CLT-832', text: 'Oui, c\'est le EBC-2024-08-15-742.', date: ago(1, 4) }),
    msg({ senderId: AGT, text: 'Je vérifie dans le système. Un instant...', date: ago(1, 3, 45) }),
    msg({ senderId: AGT, text: 'Le numéro de téléphone enregistré est le 655443322. C\'est bien le vôtre ?', date: ago(1, 3, 30) }),
    msg({ senderId: 'CLT-832', text: 'Oui c\'est ça.', date: ago(1, 3) }),
    msg({ senderId: AGT, text: 'Je relance l\'envoi du SMS. Vous devriez le recevoir dans les 5 minutes.', date: ago(1, 2, 45) }),
    msg({ senderId: 'CLT-832', text: 'Toujours rien reçu... 😕', date: ago(1, 2) }),
    msg({ senderId: AGT, text: 'Nous avons eu un souci avec la passerelle SMS. Je viens de le renvoyer manuellement.', date: ago(0, 20) }),
    msg({ senderId: 'CLT-832', text: 'Rien encore. Commencez à m\'inquiéter.', date: ago(0, 10) }),
    msg({ senderId: AGT, text: 'Je vous envoie le billet par email en attendant. Désolée pour le désagrément.', date: ago(0, 5) }),
  ], 2, 'unread', false),

  // 3 ── Jean-Pierre Mvogo (agent guichet — interne) ── internal
  conv('conv-003', { id: 'AGT-023', ...participant('Jean-Pierre Mvogo', 'Agent de guichet', 'Express Bus Cameroun', 'Yaoundé Mvan', 'online', { phone: '+237677889900', email: 'jp.mvogo@bustixconnect.cm', lastActivity: ago(0, 0, 5) }) }, [
    msg({ senderId: 'AGT-023', text: 'Salut Marie. Tu as des nouvelles du terminal ? Tu as réussi à le faire marcher ?', date: ago(4, 15) }),
    msg({ senderId: AGT, text: 'Salut JP. Toujours en panne. Paul a envoyé un technicien.', date: ago(4, 14, 30) }),
    msg({ senderId: 'AGT-023', text: 'OK. Ici à Mvan on a eu le même souci la semaine dernière. Ça venait du routeur.', date: ago(4, 14) }),
    msg({ senderId: AGT, text: 'Ah bon ? Je vais demander au technicien de vérifier ça.', date: ago(4, 13, 30) }),
    msg({ senderId: AGT, text: 'Est-ce que tu as reçu le nouveau planning des départs de la semaine prochaine ?', date: ago(3, 10) }),
    msg({ senderId: 'AGT-023', text: 'Pas encore. C\'est Léa qui doit l\'envoyer. Je la relance.', date: ago(3, 9, 45) }),
    msg({ senderId: 'AGT-023', text: 'Tiens-moi au courant pour le terminal.', date: ago(2, 16) }),
    msg({ senderId: AGT, text: 'Technicien passé. Nouveau terminal installé. Tout est OK.', date: ago(0, 2) }),
    msg({ senderId: 'AGT-023', text: 'Nickel ! Bonne nouvelle pour nous tous. 😁', date: ago(0, 1, 30) }),
  ], 0, 'internal', false),

  // 4 ── Léa Mengue (superviseur) ── inbox / important
  conv('conv-004', { id: 'ADM-003', ...participant('Léa Mengue', 'Superviseur d\'agence', 'Express Bus Cameroun', 'Douala Central', 'busy', { phone: '+237699112233', email: 'lea.mengue@bustixconnect.cm', lastActivity: ago(0, 0, 45) }) }, [
    msg({ senderId: 'ADM-003', text: 'Marie, pouvez-vous me faire le rapport de la matinée dès que possible ?', date: ago(0, 5) }),
    msg({ senderId: AGT, text: 'Bien sûr Léa. Je vous l\'envoie dans 15 minutes.', date: ago(0, 4, 55) }),
    msg({ senderId: 'ADM-003', text: 'Merci. Et n\'oubliez pas de vérifier les stocks de tickets prépayés.', date: ago(0, 4, 50) }),
    msg({ senderId: AGT, text: 'C\'est déjà fait. Il nous reste 120 tickets prépayés. Je vais commander un réapprovisionnement.', date: ago(0, 4, 40) }),
    msg({ senderId: 'ADM-003', text: 'Parfait. Faites la demande via le formulaire avant 14h.', date: ago(0, 4, 30) }),
    msg({ senderId: AGT, text: 'C\'est noté. Le rapport de la matinée : 35 billets vendus, 12 départs traités, aucun incident.', date: ago(0, 3, 45) }),
    msg({ senderId: 'ADM-003', text: 'Très bien. Continuez comme ça 👍', date: ago(0, 3, 30) }),
  ], 0, 'inbox', true),

  // 5 ── Julien Tchinda (client) ── inbox
  conv('conv-005', { id: 'CLT-127', ...participant('Julien Tchinda', 'Client', '', 'Bafoussam', 'offline', { phone: '+237678912345', email: 'julien.tchinda@yahoo.fr', lastActivity: ago(1, 6) }) }, [
    msg({ senderId: 'CLT-127', text: 'Bonjour. Je voudrais annuler mon voyage pour Bafoussam prévu ce dimanche.', date: ago(2, 14) }),
    msg({ senderId: AGT, text: 'Bonjour Julien. Puis-je avoir votre numéro de réservation ?', date: ago(2, 13, 30) }),
    msg({ senderId: 'CLT-127', text: 'EBC-BAF-2024-08-18-903.', date: ago(2, 13) }),
    msg({ senderId: AGT, text: 'Je regarde ça. Votre réservation est pour le départ de 7h. L\'annulation est possible sans frais jusqu\'à 24h avant.', date: ago(2, 12, 30) }),
    msg({ senderId: 'CLT-127', text: 'Super. Donc je suis dans les temps.', date: ago(2, 12) }),
    msg({ senderId: AGT, text: 'Oui. J\'annule la réservation. Le remboursement sera effectué sous 72h sur votre moyen de paiement.', date: ago(2, 11, 45) }),
    msg({ senderId: 'CLT-127', text: 'Merci beaucoup. Très professionnel.', date: ago(2, 11, 30) }),
    msg({ senderId: AGT, text: 'Je vous en prie. N\'hésitez pas à nous recontacter pour vos futurs voyages.', date: ago(2, 11) }),
  ], 0, 'inbox', false),

  // 6 ── Arnaud Nkolo (support comptable) ── inbox
  conv('conv-006', { id: 'SUP-019', ...participant('Arnaud Nkolo', 'Support comptable', 'Express Bus Cameroun', 'Douala Central', 'online', { phone: '+237691122334', email: 'arnaud.nkolo@compta-ebc.cm', lastActivity: ago(0, 1) }) }, [
    msg({ senderId: 'SUP-019', text: 'Marie, la caisse du guichet 2 a un écart de 12 500 XAF aujourd\'hui. Pouvez-vous vérifier ?', date: ago(0, 6) }),
    msg({ senderId: AGT, text: 'Je passe tout de suite. Vous avez le détail des transactions suspectes ?', date: ago(0, 5, 55) }),
    msg({ senderId: 'SUP-019', text: 'Oui, deux tickets supprimés sans remboursement : EBC-YDE-208 et EBC-YDE-209.', date: ago(0, 5, 45) }),
    msg({ senderId: AGT, text: 'Je vois. C\'était mon collègue Richard qui était sur ce guichet ce matin. Je lui demande.', date: ago(0, 5, 30) }),
    msg({ senderId: AGT, text: 'Richard confirme : il a remboursé en espèces mais n\'a pas encore saisi le remboursement dans le système. Il le fait immédiatement.', date: ago(0, 5) }),
    msg({ senderId: 'SUP-019', text: 'Parfait. Tout est régularisé. Merci pour la réactivité.', date: ago(0, 4, 30) }),
  ], 0, 'inbox', false),

  // 7 ── Yannick Etoa (client) ── unread
  conv('conv-007', { id: 'CLT-451', ...participant('Yannick Etoa', 'Client', '', 'Douala', 'online', { phone: '+237680102030', email: 'yannick.etoa@outlook.com', lastActivity: ago(0, 0, 25) }) }, [
    msg({ senderId: 'CLT-451', text: 'Bonjour. Le bus pour Yaoundé de 14h est-il à l\'heure ?', date: ago(0, 1) }),
    msg({ senderId: AGT, text: 'Bonjour. Oui, départ prévu à 14h depuis Douala Central. Arrivée estimée 17h30.', date: ago(0, 0, 55) }),
    msg({ senderId: 'CLT-451', text: 'Parfait. Je serai là dans 30 minutes. Est-ce que je peux réserver ma place en ligne et payer à bord ?', date: ago(0, 0, 50) }),
    msg({ senderId: AGT, text: 'Oui, c\'est possible. Je vous envoie le lien de réservation express.', date: ago(0, 0, 45) }),
    msg({ senderId: 'CLT-451', text: 'Merci !', date: ago(0, 0, 40) }),
    msg({ senderId: AGT, text: 'Voici le lien : https://bustixconnect.cm/reserver/express. Choisissez "Paiement à bord".', date: ago(0, 0, 35) }),
  ], 1, 'unread', false),

  // 8 ── Sandra Mbah (dir. commercial) ── important / inbox
  conv('conv-008', { id: 'ADM-001', ...participant('Sandra Mbah', 'Directrice commerciale', 'Express Bus Cameroun', 'Yaoundé Bastos', 'offline', { phone: '+237699000111', email: 's.mbah@bustixconnect.cm', lastActivity: ago(0, 12) }) }, [
    msg({ senderId: 'ADM-001', text: 'Bonjour Marie. J\'ai vu vos chiffres du mois dernier. Très bonne progression !', date: ago(5, 10) }),
    msg({ senderId: AGT, text: 'Bonjour Madame. Merci beaucoup ! J\'ai essayé d\'optimiser les ventes de tickets aller-retour.', date: ago(5, 9, 30) }),
    msg({ senderId: 'ADM-001', text: 'Excellent. Nous allons lancer une campagne pour les trajets Douala-Yaoundé la semaine prochaine. J\'aurai besoin de votre appui au guichet.', date: ago(4, 11) }),
    msg({ senderId: AGT, text: 'Avec plaisir. De quoi aurai-je besoin ?', date: ago(4, 10, 30) }),
    msg({ senderId: 'ADM-001', text: 'Des flyers et des goodies seront livrés à votre agence jeudi. Vous serez notre ambassadrice sur place.', date: ago(4, 10) }),
    msg({ senderId: AGT, text: 'Je suis honorée. Je ferai de mon mieux.', date: ago(4, 9, 30) }),
    msg({ senderId: 'ADM-001', text: 'En parlant de ça, une petite interview de 5 min pour nos réseaux sociaux serait géniale. Disponible demain ?', date: ago(4, 9) }),
    msg({ senderId: AGT, text: 'Bien sûr ! Quelle heure ?', date: ago(4, 8) }),
    msg({ senderId: 'ADM-001', text: '15h dans mon bureau virtuel. Je vous envoie le lien.', date: ago(4, 7) }),
    msg({ senderId: AGT, text: 'J\'y serai.', date: ago(4, 6) }),
    msg({ senderId: 'ADM-001', text: 'Merci Marie. Vous êtes une perle.', date: ago(4, 5) }),
  ], 0, 'inbox', true),

  // 9 ── Rodrigue Essomba (client) ── archived
  conv('conv-009', { id: 'CLT-903', ...participant('Rodrigue Essomba', 'Client', '', 'Douala', 'offline', { phone: '+237670554433', email: 'rodrigue.e@gmail.com', lastActivity: ago(4, 0) }) }, [
    msg({ senderId: 'CLT-903', text: 'Bonjour. J\'ai perdu mon téléphone avec mon billet électronique. Comment faire pour prendre le bus ?', date: ago(10, 8) }),
    msg({ senderId: AGT, text: 'Bonjour Rodrigue. Pas de panique. Avec votre pièce d\'identité, nous pouvons réimprimer le billet au guichet.', date: ago(10, 7, 30) }),
    msg({ senderId: 'CLT-903', text: 'Ouf ! Merci. Je passe demain matin.', date: ago(10, 7) }),
    msg({ senderId: AGT, text: 'Très bien. Muni de votre CNI, je vous édite un duplicata.', date: ago(10, 6, 30) }),
  ], 0, 'archived', false),

  // 10 ── Richard Onguéné (collègue agent) ── internal
  conv('conv-010', { id: 'AGT-045', ...participant('Richard Onguéné', 'Agent de guichet', 'Express Bus Cameroun', 'Douala Central', 'busy', { phone: '+237690987654', email: 'richard.onguene@bustixconnect.cm', lastActivity: ago(0, 0, 10) }) }, [
    msg({ senderId: 'AGT-045', text: 'Marie, tu peux me couvrir 10 minutes ? J\'ai un coup de fil urgent.', date: ago(0, 1, 30) }),
    msg({ senderId: AGT, text: 'Pas de souci. Vas-y.', date: ago(0, 1, 25) }),
    msg({ senderId: 'AGT-045', text: 'Merci ! C\'est à propos de la caisse. Je t\'explique tout à l\'heure.', date: ago(0, 1, 20) }),
    msg({ senderId: AGT, text: 'OK. J\'ai déjà parlé avec Arnaud pour régulariser. C\'est bon.', date: ago(0, 1) }),
    msg({ senderId: 'AGT-045', text: 'Merci vraiment. Je t\'invite à manger ce midi 😄', date: ago(0, 0, 55) }),
    msg({ senderId: AGT, text: 'Marché conclu ! 😊', date: ago(0, 0, 50) }),
  ], 0, 'internal', false),

  // 11 ── Christine Eyanga (cliente) ── inbox
  conv('conv-011', { id: 'CLT-276', ...participant('Christine Eyanga', 'Client', '', 'Douala', 'online', { phone: '+237694443332', email: 'christine.eyanga@icloud.com', lastActivity: ago(0, 2) }) }, [
    msg({ senderId: 'CLT-276', text: 'Bonjour. Je souhaite modifier mon billet pour le départ de 18h à un départ de 6h demain.', date: ago(0, 4) }),
    msg({ senderId: AGT, text: 'Bonjour Christine. Oui c\'est possible sous réserve de disponibilité. Votre réservation ?', date: ago(0, 3, 45) }),
    msg({ senderId: 'CLT-276', text: 'C\'est le EBC-DLA-NSF-2024-08-19-114.', date: ago(0, 3, 30) }),
    msg({ senderId: AGT, text: 'Il reste des places pour le 6h demain. Je peux faire le changement. Un supplément de 500 XAF sera appliqué.', date: ago(0, 3, 15) }),
    msg({ senderId: 'CLT-276', text: 'C\'est bon pour moi.', date: ago(0, 3) }),
    msg({ senderId: AGT, text: 'C\'est fait. Votre nouveau départ : demain 6h, siège 12A. Nouveau billet envoyé par email.', date: ago(0, 2, 45) }),
    msg({ senderId: 'CLT-276', text: 'Merci infiniment ! Très rapide.', date: ago(0, 2, 30) }),
  ], 0, 'inbox', false),

  // 12 ── Hervé Bikok (community manager) ── support
  conv('conv-012', { id: 'SUP-031', ...participant('Hervé Bikok', 'Community Manager', 'Express Bus Cameroun', 'Yaoundé Bastos', 'online', { phone: '+237655667788', email: 'herve.bikok@com-ebc.cm', lastActivity: ago(0, 0, 30) }) }, [
    msg({ senderId: 'SUP-031', text: 'Marie ! Sandra m\'a parlé de l\'interview. On la fait demain à 15h.', date: ago(0, 5) }),
    msg({ senderId: AGT, text: 'Ah super ! Je me prépare. Vous voulez que je prévois quelque chose de spécial ?', date: ago(0, 4, 30) }),
    msg({ senderId: 'SUP-031', text: 'Juste vous et votre sourire ! On va parler de votre quotidien au guichet, les challenges, vos astuces.', date: ago(0, 4) }),
    msg({ senderId: AGT, text: 'D\'accord. Je peux préparer deux trois anecdotes ?', date: ago(0, 3, 45) }),
    msg({ senderId: 'SUP-031', text: 'Excellent ! Les gens adorent les histoires vraies. On se connecte à 15h sur Google Meet.', date: ago(0, 3, 30) }),
    msg({ senderId: AGT, text: 'Je serai prête !', date: ago(0, 3, 15) }),
    msg({ senderId: 'SUP-031', text: 'Petite question : est-ce que tu as un compte Instagram ? On pourrait taguer.', date: ago(0, 2) }),
    msg({ senderId: AGT, text: 'Oui : @marie.ngo.ebc', date: ago(0, 1, 45) }),
    msg({ senderId: 'SUP-031', text: 'Parfait. À demain !', date: ago(0, 1, 30) }),
  ], 0, 'support', false),

  // 13 ── Michel Tagne (client mécontent) ── inbox / important
  conv('conv-013', { id: 'CLT-560', ...participant('Michel Tagne', 'Client', '', 'Yaoundé', 'offline', { phone: '+237677584839', email: 'michel.tagne@hotmail.com', lastActivity: ago(1, 3) }) }, [
    msg({ senderId: 'CLT-560', text: 'Bonjour. Je suis très mécontent. Mon bus pour Douala avait 2h de retard et personne ne m\'a informé.', date: ago(2, 20) }),
    msg({ senderId: AGT, text: 'Bonjour Michel. Toutes mes excuses pour ce désagrément. Laissez-moi vérifier ce qui s\'est passé.', date: ago(2, 19, 30) }),
    msg({ senderId: 'CLT-560', text: 'J\'ai raté mon rendez-vous professionnel à cause de ça !', date: ago(2, 19) }),
    msg({ senderId: AGT, text: 'Je comprends votre frustration. Nous avons eu un problème mécanique sur le bus de 14h. Le prochain a été affrété.', date: ago(2, 18, 30) }),
    msg({ senderId: 'CLT-560', text: 'On ne m\'a rien dit au guichet.', date: ago(2, 18) }),
    msg({ senderId: AGT, text: 'Je vous présente mes excuses. En compensation, je vous offre un billet aller-retour gratuit valable 3 mois.', date: ago(2, 17, 30) }),
    msg({ senderId: 'CLT-560', text: 'Bon... d\'accord. J\'accepte.', date: ago(2, 17) }),
    msg({ senderId: AGT, text: 'Merci pour votre compréhension. Le code promo vous sera envoyé par email sous 24h.', date: ago(2, 16, 30) }),
    msg({ senderId: 'CLT-560', text: 'D\'accord. Merci.', date: ago(2, 16) }),
  ], 0, 'inbox', true),

  // 14 ── Daniel Bekono (fournisseur) ── trash
  conv('conv-014', { id: 'FRN-001', ...participant('Daniel Bekono', 'Fournisseur — Imprimerie', 'Imprimerie Bekono SA', 'Douala Akwa', 'offline', { phone: '+237670001122', email: 'contact@bekono-impr.cm', lastActivity: ago(7, 0) }) }, [
    msg({ senderId: 'FRN-001', text: 'Bonjour Marie. Je vous confirme la livraison des nouveaux carnets de tickets pour demain.', date: ago(14, 10) }),
    msg({ senderId: AGT, text: 'Bonjour Daniel. Parfait. Quelle quantité ?', date: ago(14, 9, 30) }),
    msg({ senderId: 'FRN-001', text: '500 carnets de 50 tickets chacun. Conformément à la commande.', date: ago(14, 9) }),
    msg({ senderId: AGT, text: 'Très bien. Je vous signe le bon de réception à l\'arrivée.', date: ago(14, 8, 30) }),
    msg({ senderId: 'FRN-001', text: 'Merci. Livraison prévue à 10h.', date: ago(14, 8) }),
  ], 0, 'trash', false),

  // 15 ── Théophile Mbarga (client — groupe) ── inbox
  conv('conv-015', { id: 'CLT-724', ...participant('Théophile Mbarga', 'Client (groupe)', '', 'Douala', 'busy', { phone: '+237691234987', email: 'theophile.mbarga@assoc-eco.cm', lastActivity: ago(0, 0, 5) }) }, [
    msg({ senderId: 'CLT-724', text: 'Bonjour. Je représente l\'Association des Commerçants de Douala. Nous voulons réserver 25 places pour Douala-Yaoundé ce samedi.', date: ago(1, 10) }),
    msg({ senderId: AGT, text: 'Bonjour Théophile. Félicitations pour votre initiative ! Je peux vous faire une tarification de groupe.', date: ago(1, 9, 30) }),
    msg({ senderId: 'CLT-724', text: 'Parfait. Quelles sont les conditions ?', date: ago(1, 9) }),
    msg({ senderId: AGT, text: 'Pour un groupe de 25, vous avez 15% de réduction. Le bus part à 8h de Douala Central.', date: ago(1, 8, 30) }),
    msg({ senderId: 'CLT-724', text: 'Très intéressant. Est-ce qu\'on peut avoir un arrêt supplémentaire à Nsimalen ?', date: ago(1, 8) }),
    msg({ senderId: AGT, text: 'Je dois vérifier avec la direction. Je reviens vers vous rapidement.', date: ago(1, 7, 30) }),
    msg({ senderId: AGT, text: 'Bonjour ! Bonne nouvelle : un arrêt à Nsimalen est possible sans supplément.', date: ago(0, 6) }),
    msg({ senderId: 'CLT-724', text: 'Génial ! On valide. Je passe au guichet demain pour finaliser.', date: ago(0, 5, 30) }),
    msg({ senderId: AGT, text: 'Parfait. Je prépare les billets. À demain !', date: ago(0, 5) }),
  ], 0, 'inbox', false),
];

// Ajout de conversations épinglées (pinned)
conversations.forEach((c, idx) => {
  if (c.isImportant) c.pinned = true;
});
// Épingler aussi conv-010 (Richard) et conv-003 (JP Mvogo) car conversations internes fréquentes
conversations[9].pinned = true; // Richard Onguéné
conversations[2].pinned = true; // Jean-Pierre Mvogo

// Ajout de partages de fichiers sur quelques conversations
conversations[0].sharedFiles = [
  fileObj('Bon_intervention_technique.pdf', '245 Ko', 'application/pdf', ago(0, 2)),
  fileObj('Photo_terminal_panne.jpg', '1.2 Mo', 'image/jpeg', ago(3, 10)),
];
conversations[7].sharedFiles = [
  fileObj('Flyers_campagne_DLA-YDE_v3.pdf', '4.8 Mo', 'application/pdf', ago(4, 10)),
  fileObj('Planning_interview_marie.docx', '56 Ko', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', ago(3, 15)),
];
conversations[11].sharedFiles = [
  fileObj('Guide_questions_interview.pdf', '320 Ko', 'application/pdf', ago(0, 3)),
];
conversations[14].sharedFiles = [
  fileObj('Bon_de_commande_500_carnets.pdf', '180 Ko', 'application/pdf', ago(14, 9)),
];

// Ajout de réactions sur quelques messages
conversations[0].messages[10].reactions = [{ emoji: '✅', userId: AGT }, { emoji: '👍', userId: 'SUP-042' }];
conversations[3].messages[7].reactions = [{ emoji: '😁', userId: AGT }, { emoji: '👍', userId: 'AGT-023' }];
conversations[7].messages[5].reactions = [{ emoji: '👍', userId: 'CLT-451' }];
conversations[10].messages[4].reactions = [{ emoji: '😄', userId: AGT }];
conversations[12].messages[2].reactions = [{ emoji: '😊', userId: AGT }, { emoji: '👍', userId: 'SUP-031' }];

// Ajout d'attachments sur quelques messages
conversations[0].messages[6].attachments = [{ name: 'Bon_intervention_technique.pdf', size: '245 Ko', type: 'application/pdf', url: '#' }];
conversations[7].messages[1].attachments = [{ name: 'Flyers_campagne_DLA-YDE_v3.pdf', size: '4.8 Mo', type: 'application/pdf', url: '#' }];
conversations[13].messages[5].attachments = [{ name: 'Compensation_billet_offerte.pdf', size: '180 Ko', type: 'application/pdf', url: '#' }];

// Ajout de messages édités
conversations[5].messages[4].isEdited = true;
conversations[7].messages[2].isEdited = true;

// Filigrane "répondu" via replyTo
conversations[1].messages[10].replyTo = conversations[1].messages[8].id;

// ─── Dossiers ──────────────────────────────────
export const folders = [
  { id: 'inbox', label: 'Boîte de réception', icon: 'bi-inbox', count: 0 },
  { id: 'unread', label: 'Non lus', icon: 'bi-envelope-open', count: 0 },
  { id: 'important', label: 'Importants', icon: 'bi-star', count: 0 },
  { id: 'archived', label: 'Archives', icon: 'bi-archive', count: 0 },
  { id: 'trash', label: 'Corbeille', icon: 'bi-trash', count: 0 },
  { id: 'support', label: 'Support', icon: 'bi-headset', count: 0 },
  { id: 'internal', label: 'Internes', icon: 'bi-people', count: 0 },
  { id: 'client', label: 'Clients', icon: 'bi-person-badge', count: 0 },
];

// Calcul dynamique des compteurs
const _countByFolder = {};
conversations.forEach((c) => {
  const f = c.folder;
  _countByFolder[f] = (_countByFolder[f] || 0) + c.unreadCount;
  if (c.isImportant) _countByFolder.important = (_countByFolder.important || 0) + c.unreadCount;
});
folders.forEach((f) => {
  if (_countByFolder[f.id]) f.count = _countByFolder[f.id];
});

const _unreadTotal = conversations.reduce((s, c) => s + c.unreadCount, 0);
folders.find((f) => f.id === 'unread').count = _unreadTotal;

// ─── Contacts ──────────────────────────────────
export const contacts = [
  { id: 'ADM-003', name: 'Léa Mengue', role: 'Superviseur d\'agence', phone: '+237699112233', email: 'lea.mengue@bustixconnect.cm', company: 'Express Bus Cameroun', branch: 'Douala Central', status: 'busy', lastActivity: ago(0, 0, 45) },
  { id: 'ADM-001', name: 'Sandra Mbah', role: 'Directrice commerciale', phone: '+237699000111', email: 's.mbah@bustixconnect.cm', company: 'Express Bus Cameroun', branch: 'Yaoundé Bastos', status: 'offline', lastActivity: ago(0, 12) },
  { id: 'ADM-007', name: 'Bertrand Nkwi', role: 'Directeur général', phone: '+237699000999', email: 'b.nkwi@bustixconnect.cm', company: 'Express Bus Cameroun', branch: 'Yaoundé Bastos', status: 'offline', lastActivity: ago(1, 5) },
  { id: 'ADM-012', name: 'Céline Atangana', role: 'Responsable RH', phone: '+237699000777', email: 'c.atangana@bustixconnect.cm', company: 'Express Bus Cameroun', branch: 'Douala Central', status: 'online', lastActivity: ago(0, 0, 20) },
  { id: 'AGT-023', name: 'Jean-Pierre Mvogo', role: 'Agent de guichet', phone: '+237677889900', email: 'jp.mvogo@bustixconnect.cm', company: 'Express Bus Cameroun', branch: 'Yaoundé Mvan', status: 'online', lastActivity: ago(0, 0, 5) },
  { id: 'AGT-045', name: 'Richard Onguéné', role: 'Agent de guichet', phone: '+237690987654', email: 'richard.onguene@bustixconnect.cm', company: 'Express Bus Cameroun', branch: 'Douala Central', status: 'busy', lastActivity: ago(0, 0, 10) },
  { id: 'AGT-078', name: 'Esther Ngo Binyeg', role: 'Agent de guichet', phone: '+237678899001', email: 'esther.ngo@bustixconnect.cm', company: 'Express Bus Cameroun', branch: 'Yaoundé Centre', status: 'online', lastActivity: ago(0, 1) },
  { id: 'AGT-091', name: 'Fabrice Kemajou', role: 'Agent de guichet', phone: '+237690011223', email: 'fabrice.kemajou@bustixconnect.cm', company: 'Express Bus Cameroun', branch: 'Bafoussam', status: 'offline', lastActivity: ago(2, 4) },
  { id: 'SUP-042', name: 'Paul Bello', role: 'Support technique', phone: '+237699876543', email: 'paul.bello@support-ebc.cm', company: 'Express Bus Cameroun', branch: 'Yaoundé Mvan', status: 'online', lastActivity: ago(0, 0, 15) },
  { id: 'SUP-019', name: 'Arnaud Nkolo', role: 'Support comptable', phone: '+237691122334', email: 'arnaud.nkolo@compta-ebc.cm', company: 'Express Bus Cameroun', branch: 'Douala Central', status: 'online', lastActivity: ago(0, 1) },
  { id: 'SUP-031', name: 'Hervé Bikok', role: 'Community Manager', phone: '+237655667788', email: 'herve.bikok@com-ebc.cm', company: 'Express Bus Cameroun', branch: 'Yaoundé Bastos', status: 'online', lastActivity: ago(0, 0, 30) },
  { id: 'SUP-056', name: 'Ruth Mendouga', role: 'Agent support clientèle', phone: '+237692223344', email: 'ruth.mendouga@support-ebc.cm', company: 'Express Bus Cameroun', branch: 'Douala Central', status: 'busy', lastActivity: ago(0, 2) },
  { id: 'SUP-088', name: 'Karine Mbarga', role: 'Assistante commerciale', phone: '+237695556677', email: 'k.mbarga@bustixconnect.cm', company: 'Express Bus Cameroun', branch: 'Yaoundé Bastos', status: 'online', lastActivity: ago(0, 0, 50) },
  { id: 'CLT-832', name: 'Fatimatou Ali', role: 'Client', phone: '+237655443322', email: 'fatimatou.a@gmail.com', company: '', branch: 'Douala', status: 'offline', lastActivity: ago(0, 3) },
  { id: 'CLT-127', name: 'Julien Tchinda', role: 'Client', phone: '+237678912345', email: 'julien.tchinda@yahoo.fr', company: '', branch: 'Bafoussam', status: 'offline', lastActivity: ago(1, 6) },
  { id: 'CLT-451', name: 'Yannick Etoa', role: 'Client', phone: '+237680102030', email: 'yannick.etoa@outlook.com', company: '', branch: 'Douala', status: 'online', lastActivity: ago(0, 0, 25) },
  { id: 'CLT-560', name: 'Michel Tagne', role: 'Client', phone: '+237677584839', email: 'michel.tagne@hotmail.com', company: '', branch: 'Yaoundé', status: 'offline', lastActivity: ago(1, 3) },
  { id: 'CLT-724', name: 'Théophile Mbarga', role: 'Client (groupe)', phone: '+237691234987', email: 'theophile.mbarga@assoc-eco.cm', company: '', branch: 'Douala', status: 'busy', lastActivity: ago(0, 0, 5) },
  { id: 'CLT-276', name: 'Christine Eyanga', role: 'Client', phone: '+237694443332', email: 'christine.eyanga@icloud.com', company: '', branch: 'Douala', status: 'online', lastActivity: ago(0, 2) },
  { id: 'CLT-903', name: 'Rodrigue Essomba', role: 'Client', phone: '+237670554433', email: 'rodrigue.e@gmail.com', company: '', branch: 'Douala', status: 'offline', lastActivity: ago(4, 0) },
];

// ─── Tickets support ───────────────────────────
let _ticketMsgCounter = 0;
function tmid() { return `tmsg-${String(++_ticketMsgCounter).padStart(4, '0')}`; }
function tmsg(sender, text, date) {
  return { id: tmid(), sender, text, date };
}

export const tickets = [
  { id: 'TKT-001', subject: 'Terminal de paiement HS — Guichet 3', status: 'resolved', priority: 'high', createdAt: ago(6, 14), updatedAt: ago(0, 2), messages: [
    tmsg('Marie Ngo', 'Le terminal de paiement du guichet 3 affiche "Erreur de connexion" depuis hier après-midi.', ago(6, 14)),
    tmsg('Paul Bello (Support)', 'Pouvez-vous redémarrer l\'appareil et me confirmer ?', ago(6, 10)),
    tmsg('Marie Ngo', 'Trois redémarrages effectués. Problème persiste.', ago(6, 9)),
    tmsg('Paul Bello (Support)', 'Un technicien sera envoyé demain matin entre 8h et 10h.', ago(5, 14)),
    tmsg('Joseph Mbah (Technicien)', 'Passage effectué. Routeur défectueux remplacé. Nouveau terminal installé.', ago(0, 2, 30)),
    tmsg('Marie Ngo', 'Confirmé. Terminal fonctionnel. Ticket à clore.', ago(0, 2)),
    tmsg('Paul Bello (Support)', 'Ticket résolu. Clôture.', ago(0, 1, 30)),
  ]},
  { id: 'TKT-002', subject: 'Problème d\'envoi SMS confirmation', status: 'in_progress', priority: 'high', createdAt: ago(0, 20), updatedAt: ago(0, 5), messages: [
    tmsg('Marie Ngo', 'Les SMS de confirmation ne partent plus depuis 24h. Plusieurs clients se plaignent.', ago(0, 20)),
    tmsg('Ruth Mendouga (Support clientèle)', 'Je remonte le problème à l\'équipe technique. Avez-vous un ID de réservation en exemple ?', ago(0, 15)),
    tmsg('Marie Ngo', 'Oui : EBC-2024-08-15-742 pour Fatimatou Ali.', ago(0, 14)),
    tmsg('Ruth Mendouga (Support clientèle)', 'Merci. En attendant, proposez les billets par email.', ago(0, 12)),
    tmsg('Marie Ngo', 'C\'est ce que je fais. Mais certains clients n\'ont pas d\'email...', ago(0, 10)),
    tmsg('Ruth Mendouga (Support clientèle)', 'L\'équipe technique travaille sur le correctif. Je vous tiens au courant.', ago(0, 5)),
  ]},
  { id: 'TKT-003', subject: 'Demande de réapprovisionnement tickets prépayés', status: 'open', priority: 'normal', createdAt: ago(0, 4), updatedAt: ago(0, 4), messages: [
    tmsg('Marie Ngo', 'Il ne reste que 120 tickets prépayés au guichet. Je commande 500 supplémentaires.', ago(0, 4)),
  ]},
  { id: 'TKT-004', subject: 'Incident caisse — Écart de 12 500 XAF', status: 'resolved', priority: 'critical', createdAt: ago(0, 6), updatedAt: ago(0, 4), messages: [
    tmsg('Arnaud Nkolo (Support comptable)', 'Écart constaté de 12 500 XAF au guichet 2. Transactions suspectes : EBC-YDE-208 et 209.', ago(0, 6)),
    tmsg('Marie Ngo', 'Vérification effectuée. Richard Onguéné confirme avoir remboursé en espèces sans saisie immédiate.', ago(0, 5)),
    tmsg('Richard Onguéné', 'Régularisation effectuée dans le système. Désolé pour l\'erreur.', ago(0, 4, 45)),
    tmsg('Arnaud Nkolo (Support comptable)', 'Écart régularisé. Ticket clôturé.', ago(0, 4)),
  ]},
  { id: 'TKT-005', subject: 'Réclamation client — Retard bus non communiqué', status: 'waiting', priority: 'high', createdAt: ago(2, 20), updatedAt: ago(1, 10), messages: [
    tmsg('Marie Ngo', 'Client Michel Tagne signale un retard de 2h sur le trajet Yaoundé-Douala sans information au guichet.', ago(2, 20)),
    tmsg('Léa Mengue (Superviseur)', 'C\'est un problème de communication. Je vais parler avec l\'équipe de la gare. Avez-vous proposé une compensation ?', ago(2, 18)),
    tmsg('Marie Ngo', 'Oui, billet aller-retour offert. Client a accepté.', ago(2, 17)),
    tmsg('Léa Mengue (Superviseur)', 'Parfait. Je veille à ce que la procédure d\'information soit améliorée. En attente du retour du service com.', ago(1, 10)),
  ]},
  { id: 'TKT-006', subject: 'Réservation groupe — Arrêt supplémentaire Nsimalen', status: 'in_progress', priority: 'normal', createdAt: ago(1, 8), updatedAt: ago(0, 6), messages: [
    tmsg('Marie Ngo', 'Groupe de 25 personnes souhaite un arrêt à Nsimalen sur Douala-Yaoundé. Possible ?', ago(1, 8)),
    tmsg('Sandra Mbah (Directrice commerciale)', 'Oui c\'est possible sans supplément. Vous pouvez confirmer au client.', ago(0, 7)),
    tmsg('Marie Ngo', 'Client confirmé. Je prépare les billets.', ago(0, 6)),
  ]},
  { id: 'TKT-007', subject: 'Commande de flyers campagne promo', status: 'resolved', priority: 'low', createdAt: ago(5, 8), updatedAt: ago(4, 10), messages: [
    tmsg('Marie Ngo', 'Confirmation de commande de flyers et goodies pour la campagne Douala-Yaoundé.', ago(5, 8)),
    tmsg('Hervé Bikok (Community Manager)', 'Commande transmise à l\'imprimeur. Livraison prévue jeudi.', ago(5, 6)),
    tmsg('Marie Ngo', 'Livraison reçue. Flyers et goodies conformes.', ago(4, 10)),
  ]},
  { id: 'TKT-008', subject: 'Problème connexion réseau guichet 1', status: 'open', priority: 'critical', createdAt: ago(0, 1), updatedAt: ago(0, 0, 30), messages: [
    tmsg('Marie Ngo', 'Le poste du guichet 1 n\'a plus accès au système de réservation. Impossible de vendre des billets.', ago(0, 1)),
    tmsg('Paul Bello (Support technique)', 'On regarde ça en urgence. Essayez de redémarrer le poste.', ago(0, 0, 45)),
    tmsg('Marie Ngo', 'Redémarrage effectué. Toujours pas de connexion.', ago(0, 0, 30)),
  ]},
];

// ─── Fonctions utilitaires ─────────────────────

export function getPinnedConversations() {
  return conversations.filter((c) => c.pinned && c.folder !== 'archived' && c.folder !== 'trash');
}

export function getConversationsByFolder(folderId) {
  if (folderId === 'inbox') return conversations.filter((c) => c.folder !== 'archived' && c.folder !== 'trash');
  if (folderId === 'unread') return conversations.filter((c) => c.unreadCount > 0);
  if (folderId === 'important') return conversations.filter((c) => c.isImportant);
  return conversations.filter((c) => c.folder === folderId);
}

export function filterConversations(conversations, filters = {}) {
  return conversations.filter((conv) => {
    const { search, folder, isImportant, participantStatus } = filters;

    if (folder && conv.folder !== folder) return false;
    if (isImportant !== undefined && conv.isImportant !== isImportant) return false;

    if (participantStatus) {
      const statuses = Array.isArray(participantStatus) ? participantStatus : [participantStatus];
      if (!statuses.includes(conv.participant.status)) return false;
    }

    if (search) {
      const q = search.toLowerCase();
      const inName = conv.participant.name.toLowerCase().includes(q);
      const inText = conv.messages.some((m) => m.text.toLowerCase().includes(q));
      if (!inName && !inText) return false;
    }

    return true;
  });
}

export function sortConversations(conversations, sortBy = 'newest') {
  const copy = [...conversations];
  const sortMap = {
    newest: (a, b) => new Date(b.lastMessage.date) - new Date(a.lastMessage.date),
    oldest: (a, b) => new Date(a.lastMessage.date) - new Date(b.lastMessage.date),
    unread_first: (a, b) => b.unreadCount - a.unreadCount || new Date(b.lastMessage.date) - new Date(a.lastMessage.date),
    alphabetical: (a, b) => a.participant.name.localeCompare(b.participant.name, 'fr'),
  };
  return copy.sort(sortMap[sortBy] || sortMap.newest);
}

export function findConversationById(id) {
  return conversations.find((c) => c.id === id) || null;
}
