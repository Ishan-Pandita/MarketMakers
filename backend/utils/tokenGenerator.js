const crypto = require("crypto");

/**
 * Generate a secure random token
 * @param {number} length - Length of the token (default: 32)
 * @returns {string} Random token
 */
const generateToken = (length = 32) => {
    return crypto.randomBytes(length).toString("hex");
};

/**
 * Generate a password reset token with expiration
 * @param {number} expirationHours - Hours until token expires (default: 1)
 * @returns {object} Token and expiration date
 */
const generatePasswordResetToken = (expirationHours = 1) => {
    const token = generateToken();
    const expiresAt = new Date(Date.now() + expirationHours * 60 * 60 * 1000);

    return { token, expiresAt };
};

module.exports = {
    generateToken,
    generatePasswordResetToken,
};
