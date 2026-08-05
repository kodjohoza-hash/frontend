export const PAYMENT_STATUSES = {
  INITIATED: 'initie',
  PAID: 'paye',
  PENDING: 'en_attente',
  FAILED: 'echoue',
  CANCELLED: 'annule',
  REFUNDED: 'rembourse',
  PARTIAL_REFUND: 'partiellement_rembourse',
};

export const PAYMENT_STATUS_LABELS = {
  initie: 'Initié',
  paye: 'Réussi',
  en_attente: 'En attente',
  echoue: 'Échoué',
  annule: 'Annulé',
  rembourse: 'Remboursé',
  partiellement_rembourse: 'Partiellement remboursé',
};

export const PAYMENT_STATUS_COLORS = {
  initie: 'info',
  paye: 'success',
  en_attente: 'warning',
  echoue: 'danger',
  annule: 'muted',
  rembourse: 'primary',
  partiellement_rembourse: 'info',
};

export const PAYMENT_METHODS = {
  ORANGE_MONEY: 'orange_money',
  MTN_MOMO: 'mtn_money',
  CARD: 'carte_bancaire',
  CASH: 'especes',
  BANK: 'virement_bancaire',
  VOUCHER: 'bon_reduction',
  PROMO: 'code_promo',
  EXPRESS_UNION_MOBILE: 'express_union_mobile',
  OTHER: 'autre',
};

export const PAYMENT_METHOD_LABELS = {
  orange_money: 'Orange Money',
  mtn_money: 'MTN Mobile Money',
  carte_bancaire: 'Carte bancaire',
  especes: 'Espèces',
  virement_bancaire: 'Virement bancaire',
  bon_reduction: 'Bon de réduction',
  code_promo: 'Code promotionnel',
  express_union_mobile: 'Express Union Mobile',
  autre: 'Autre',
};

export const PAYMENT_METHOD_ICONS = {
  orange_money: 'OM',
  mtn_money: 'MoMo',
  carte_bancaire: 'CB',
  especes: '€$',
  virement_bancaire: 'VB',
  bon_reduction: 'BR',
  code_promo: '%',
  express_union_mobile: 'EU',
  autre: '…',
};
