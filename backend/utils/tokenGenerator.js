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
 * @param {number} expirationMinutes - Minutes until token expires (default: 10)
 * @returns {object} Token and expiration date
 */
const generatePasswordResetToken = (expirationMinutes = 10) => {
    const token = generateToken();
    const expiresAt = new Date(Date.now() + expirationMinutes * 60 * 1000);

    return { token, expiresAt };
};

module.exports = {
    generateToken,
    generatePasswordResetToken,
};
