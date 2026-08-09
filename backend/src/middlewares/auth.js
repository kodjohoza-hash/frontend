const { verifyAccessToken } = require('../utils/jwt');
const { Agent, Agence, Compagnie, Client } = require('../models');
const { serializeUser, serializeClient } = require('../utils/serializeUser');
const ApiError = require('../utils/ApiError');

/**
 * Rôles de l'application (alignés sur le frontend).
 */
const ROLES = {
  CLIENT: 'client',
  COMPANY_ADMIN: 'company_admin',
  COUNTER_AGENT: 'counter_agent',
  SUPER_ADMIN: 'super_admin',
};

/** Construit le payload JWT d'un agent (associations déjà chargées). */
const buildTokenPayload = (agent) => ({
  id: agent.id,
  email: agent.email,
  role: agent.role,
  agenceId: agent.agence_id,
  compagnieId: agent.agence?.compagnie_id ?? undefined,
});

/** Recharge un agent depuis la base (vérifie qu'il existe encore et est actif). */
const loadAgent = async (id) =>
  Agent.findOne({
    where: { id },
    include: [
      { model: Agence, as: 'agence', include: [{ model: Compagnie, as: 'compagnie' }] },
    ],
  });

/** Un client peut se connecter s'il est actif ou nouveau (inscription en cours). */
const clientCanLogin = (client) => ['actif', 'nouveau'].includes(client.statut);

/**
 * Recharge le compte (agent OU client) depuis la base selon le rôle porté
 * par le token, puis attache req.agent / req.client et req.user.
 */
const attachActor = async (req, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return next(new ApiError(401, 'Authentification requise.'));
  }

  const payload = verifyAccessToken(token);
  if (!payload || !payload.id) {
    return next(new ApiError(401, 'Session invalide ou expirée.'));
  }

  try {
    if (payload.role === 'client') {
      const client = await Client.findByPk(payload.id);
      if (!client) {
        return next(new ApiError(401, 'Compte introuvable.'));
      }
      if (!clientCanLogin(client)) {
        return next(new ApiError(403, 'Ce compte est inactif ou suspendu.'));
      }
      req.client = client;
      req.user = {
        id: client.id,
        email: client.email,
        role: 'client',
        user: serializeClient(client),
      };
      return next();
    }

    const agent = await loadAgent(payload.id);
    if (!agent) {
      return next(new ApiError(401, 'Compte introuvable.'));
    }
    if (agent.statut !== 'actif') {
      return next(new ApiError(403, 'Ce compte est inactif ou suspendu.'));
    }

    req.agent = agent;
    req.user = { ...buildTokenPayload(agent), user: serializeUser(agent) };
    return next();
  } catch (err) {
    return next(err);
  }
};

/**
 * Authentification obligatoire : vérifie l'access token puis recharge
 * le compte (agent ou client) depuis la base (révocation immédiate).
 * Attache req.user = { id, role, ... } et req.agent / req.client.
 */
const authenticate = (req, res, next) => attachActor(req, next);

/**
 * Authentification facultative : attache req.user si un token valide est
 * fourni, sinon continue sans (utile pour les routes publiques).
 */
const authOptional = async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next();

  const payload = verifyAccessToken(token);
  if (!payload || !payload.id) return next();

  try {
    if (payload.role === 'client') {
      const client = await Client.findByPk(payload.id);
      if (client && clientCanLogin(client)) {
        req.client = client;
        req.user = {
          id: client.id,
          email: client.email,
          role: 'client',
          user: serializeClient(client),
        };
      }
    } else {
      const agent = await loadAgent(payload.id);
      if (agent && agent.statut === 'actif') {
        req.agent = agent;
        req.user = { ...buildTokenPayload(agent), user: serializeUser(agent) };
      }
    }
  } catch (_err) {
    /* route publique : on ignore les tokens invalides */
  }
  next();
};

module.exports = { authenticate, authOptional, buildTokenPayload, ROLES };
