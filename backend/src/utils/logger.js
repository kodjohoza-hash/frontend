/**
 * Logger léger (console structurée). Niveau via NODE_ENV.
 * LOG_LEVEL : error | warn | info | debug
 */
const LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };

const level = LEVELS[process.env.LOG_LEVEL] ?? (process.env.NODE_ENV === 'production' ? LEVELS.info : LEVELS.debug);

const ts = () => new Date().toISOString();

const log = (lvl, msg, meta) => {
  if (LEVELS[lvl] > level) return;
  const line = `[${ts()}] [${lvl.toUpperCase()}] ${msg}`;
  const json = meta && Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
  if (lvl === 'error') console.error(line + json);
  else if (lvl === 'warn') console.warn(line + json);
  else console.log(line + json);
};

module.exports = {
  error: (msg, meta) => log('error', msg, meta),
  warn: (msg, meta) => log('warn', msg, meta),
  info: (msg, meta) => log('info', msg, meta),
  debug: (msg, meta) => log('debug', msg, meta),
};
