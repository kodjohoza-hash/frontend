const now = new Date();
const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

const paymentMethods = [
  { key: 'Orange_Money', label: 'Orange Money', icon: 'bi-phone', color: '#FF7900' },
  { key: 'MTN_Mobile_Money', label: 'MTN Mobile Money', icon: 'bi-phone', color: '#FFCC00' },
  { key: 'Carte_Bancaire', label: 'Carte bancaire', icon: 'bi-credit-card', color: '#1A1F71' },
  { key: 'Espèces', label: 'Espèces', icon: 'bi-cash', color: '#10B981' },
  { key: 'Virement_Bancaire', label: 'Virement bancaire', icon: 'bi-bank', color: '#0B1D51' },
  { key: 'Bon_Reduction', label: 'Bon de réduction', icon: 'bi-ticket-perforated', color: '#8B5CF6' },
  { key: 'Code_Promotionnel', label: 'Code promotionnel', icon: 'bi-percent', color: '#F59E0B' },
];

const statusLabels = {
  paid: { label: 'Payé', icon: 'bi-check-circle-fill', color: '#10B981' },
  pending: { label: 'En attente', icon: 'bi-clock', color: '#F59E0B' },
  failed: { label: 'Échoué', icon: 'bi-x-circle-fill', color: '#EF4444' },
  cancelled: { label: 'Annulé', icon: 'bi-x-circle', color: '#6B7280' },
  refunded: { label: 'Remboursé', icon: 'bi-arrow-return-left', color: '#8B5CF6' },
  partially_refunded: { label: 'Partiellement remboursé', icon: 'bi-arrow-return-left', color: '#A78BFA' },
};

export const clients = [
  { name: 'Jean-Pierre Kamga', phone: '691234567', email: 'jp.kamga@email.com' },
  { name: 'Marie-Chantal Ndi', phone: '692345678', email: 'mc.ndi@email.com' },
  { name: 'Paul Biya Mballa', phone: '693456789', email: 'paul.mballa@email.com' },
  { name: 'Esther Ngono', phone: '694567890', email: 'esther.ngono@email.com' },
  { name: 'David Ekwalla', phone: '695678901', email: 'david.ekwalla@email.com' },
  { name: 'Sarah Moukoko', phone: '696789012', email: 'sarah.moukoko@email.com' },
  { name: 'Michel Tagne', phone: '697890123', email: 'michel.tagne@email.com' },
  { name: 'Christine Eyanga', phone: '698901234', email: 'christine.eyanga@email.com' },
  { name: 'Robert Nkwi', phone: '699012345', email: 'robert.nkwi@email.com' },
  { name: 'Alice Mbah', phone: '690123456', email: 'alice.mbah@email.com' },
  { name: 'François Bikoi', phone: '687654321', email: 'francois.bikoi@email.com' },
  { name: 'Joséphine Tchinda', phone: '686543210', email: 'josephine.tchinda@email.com' },
];

const routes = ['Douala → Yaoundé', 'Douala → Bafoussam', 'Yaoundé → Douala', 'Yaoundé → Bafoussam', 'Douala → Bamenda', 'Douala → Garoua', 'Douala → Maroua'];

const generatePayments = () => {
  const payments = [];
  for (let i = 1; i <= 30; i++) {
    const client = clients[(i - 1) % clients.length];
    const method = paymentMethods[i % (paymentMethods.length - 2)];
    const statuses = ['paid', 'paid', 'paid', 'paid', 'pending', 'paid', 'failed', 'paid', 'refunded', 'cancelled', 'paid', 'paid', 'paid', 'partially_refunded', 'paid'];
    const status = statuses[(i - 1) % statuses.length];
    const route = routes[(i - 1) % routes.length];
    const [from, to] = route.split(' → ');
    const amount = Math.floor(Math.random() * 45000 + 3000);
    const created = new Date(today.getTime() - (30 - i) * 3600000 - Math.floor(Math.random() * 3600000));

    payments.push({
      id: `PAY-2026-${String(i).padStart(4, '0')}`,
      reference: `PAY-BTC-${String(i).padStart(4, '0')}`,
      clientName: client.name,
      clientPhone: client.phone,
      clientEmail: client.email,
      bookingRef: i <= 20 ? `RES-2026-${String(i).padStart(4, '0')}` : null,
      ticketRef: i > 20 ? `TKT-2026-${String(i - 20).padStart(4, '0')}` : null,
      tripFrom: from,
      tripTo: to,
      amount,
      method: method.key,
      methodLabel: method.label,
      methodIcon: method.icon,
      methodColor: method.color,
      status,
      agent: 'Kodjo Jojo',
      createdAt: created.toISOString(),
      notes: status === 'refunded' ? 'Remboursement intégral suite annulation.' : status === 'partially_refunded' ? 'Remboursement partiel.' : '',
      refundAmount: status === 'refunded' ? amount : status === 'partially_refunded' ? Math.floor(amount * 0.5) : null,
      refundReason: status === 'refunded' ? 'Annulation du voyage' : status === 'partially_refunded' ? 'Modification de réservation' : null,
    });
  }
  return payments;
};

export const payments = generatePayments();

export const cashMethods = paymentMethods;

export const paymentStatusLabels = statusLabels;

export const cashStats = {
  todayCount: payments.filter((p) => {
    const pd = new Date(p.createdAt);
    return pd.toDateString() === today.toDateString() && p.status === 'paid';
  }).length,
  todayAmount: payments.filter((p) => {
    const pd = new Date(p.createdAt);
    return pd.toDateString() === today.toDateString() && p.status === 'paid';
  }).reduce((sum, p) => sum + p.amount, 0),
  pending: payments.filter((p) => p.status === 'pending').length,
  refunded: payments.filter((p) => p.status === 'refunded' || p.status === 'partially_refunded').length,
  totalTransactions: payments.filter((p) => p.status === 'paid').length,
  currentBalance: payments.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0)
    - payments.filter((p) => p.status === 'refunded').reduce((sum, p) => sum + p.amount, 0)
    - payments.filter((p) => p.status === 'partially_refunded').reduce((sum, p) => sum + (p.refundAmount || 0), 0),
};

export const cashSession = {
  isOpen: false,
  openedAt: null,
  closedAt: null,
  openingBalance: 0,
  closingBalance: 0,
  agent: 'Kodjo Jojo',
  notes: '',
};

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XAF', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

export const formatDateTime = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

export const formatTime = (dateStr) => {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

export const paymentFilterOptions = {
  methods: [
    { value: '', label: 'Tous les modes' },
    ...paymentMethods.map((m) => ({ value: m.key, label: m.label })),
  ],
  statuses: [
    { value: '', label: 'Tous les statuts' },
    { value: 'paid', label: 'Payé' },
    { value: 'pending', label: 'En attente' },
    { value: 'failed', label: 'Échoué' },
    { value: 'cancelled', label: 'Annulé' },
    { value: 'refunded', label: 'Remboursé' },
    { value: 'partially_refunded', label: 'Partiellement remboursé' },
  ],
  sortOptions: [
    { value: 'newest', label: 'Plus récents' },
    { value: 'oldest', label: 'Plus anciens' },
    { value: 'amount_asc', label: 'Montant ↑' },
    { value: 'amount_desc', label: 'Montant ↓' },
  ],
};

export const filterPayments = (payments, filters) => {
  return payments.filter((p) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!p.reference.toLowerCase().includes(q) && !p.clientName.toLowerCase().includes(q) && !p.clientPhone.includes(q)) return false;
    }
    if (filters.method && p.method !== filters.method) return false;
    if (filters.status && p.status !== filters.status) return false;
    if (filters.date) {
      const pd = new Date(p.createdAt).toDateString();
      const fd = new Date(filters.date).toDateString();
      if (pd !== fd) return false;
    }
    if (filters.amountMin && p.amount < Number(filters.amountMin)) return false;
    if (filters.amountMax && p.amount > Number(filters.amountMax)) return false;
    return true;
  });
};

export const sortPayments = (payments, sortBy) => {
  const sorted = [...payments];
  switch (sortBy) {
    case 'oldest': return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    case 'amount_asc': return sorted.sort((a, b) => a.amount - b.amount);
    case 'amount_desc': return sorted.sort((a, b) => b.amount - a.amount);
    default: return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};

export const generateReceipt = (payment) => ({
  logo: 'BUS TIX CONNECT',
  company: 'Finex Voyages',
  companyLogo: 'FV',
  companyColor: '#0B1D51',
  receiptNo: `RCP-${payment.reference}`,
  issueDate: new Date().toISOString(),
  clientName: payment.clientName,
  clientPhone: payment.clientPhone,
  bookingRef: payment.bookingRef,
  ticketRef: payment.ticketRef,
  trip: `${payment.tripFrom} → ${payment.tripTo}`,
  amount: payment.amount,
  method: payment.methodLabel,
  agent: payment.agent,
  qrCode: 'BTC-RCP-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
  barcode: String(5900000000000 + Math.floor(Math.random() * 999999)),
});

export const getPaymentMethodIcon = (methodKey) => {
  const m = paymentMethods.find((pm) => pm.key === methodKey);
  return m?.icon || 'bi-wallet';
};

export const getPaymentMethodColor = (methodKey) => {
  const m = paymentMethods.find((pm) => pm.key === methodKey);
  return m?.color || '#6B7280';
};

export const getPaymentMethodLabel = (methodKey) => {
  const m = paymentMethods.find((pm) => pm.key === methodKey);
  return m?.label || methodKey;
};

export default payments;
