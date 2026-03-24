/**
 * Shared normalization utilities.
 */

const normalizeUpperOrUndefined = (value) => {
  const normalized = String(value || "").trim().toUpperCase();
  return normalized || undefined;
};

module.exports = { normalizeUpperOrUndefined };
