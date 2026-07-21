/**
 * BUS TIX CONNECT — Payment Service Layer
 * Prepared for future API integration (MTN MoMo, Orange Money, Stripe, etc.)
 * All methods return Promises — currently returns mock data.
 */

const MOCK_DELAY = 2000;

const simulateNetwork = (ms = MOCK_DELAY) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const PaymentService = {
  /**
   * Validate mobile money phone number
   */
  validatePhone: async (phone, provider) => {
    await simulateNetwork(500);
    const cleaned = phone.replace(/\s/g, '');
    if (!/^(237)?[6][0-9]{8}$/.test(cleaned)) {
      return { valid: false, error: 'Numero de telephone invalide' };
    }
    return { valid: true };
  },

  /**
   * Validate credit card
   */
  validateCard: async (cardData) => {
    await simulateNetwork(500);
    const { number, expiry, cvv } = cardData;
    const cleanedNumber = number.replace(/\s/g, '');
    if (!/^[0-9]{16}$/.test(cleanedNumber)) {
      return { valid: false, error: 'Numero de carte invalide' };
    }
    if (!/^[0-9]{2}\/[0-9]{2}$/.test(expiry)) {
      return { valid: false, error: "Date d'expiration invalide" };
    }
    if (!/^[0-9]{3,4}$/.test(cvv)) {
      return { valid: false, error: 'CVV invalide' };
    }
    return { valid: true };
  },

  /**
   * Process payment — dispatches to the correct provider
   */
  processPayment: async ({ method, amount, phone, cardData, currency = 'XAF' }) => {
    await simulateNetwork(3000);

    // Simulate 90% success rate
    const success = Math.random() > 0.1;

    if (!success) {
      return {
        success: false,
        error: 'Paiement refuse. Verifiez vos informations et reessayez.',
        code: 'PAYMENT_DECLINED',
      };
    }

    return {
      success: true,
      transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      amount,
      currency,
      method,
      timestamp: new Date().toISOString(),
    };
  },

  /**
   * Validate promo code
   */
  validatePromoCode: async (code) => {
    await simulateNetwork(800);
    const codes = {
      BIENVENUE10: { discount: 10, type: 'percent', label: '10% de reduction' },
      BTC500: { discount: 500, type: 'fixed', label: '500 FCFA de reduction' },
      ETUDIANT: { discount: 15, type: 'percent', label: '15% tarif etudiant' },
    };
    const promo = codes[code.toUpperCase()];
    if (!promo) {
      return { valid: false, error: 'Code promo invalide ou expire' };
    }
    return { valid: true, promo };
  },

  /**
   * Reserve seats (hold for timer)
   */
  reserveSeats: async (seatIds, tripId) => {
    await simulateNetwork(1000);
    return {
      success: true,
      reservationId: `RES-${Date.now()}`,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    };
  },
};

export default PaymentService;
